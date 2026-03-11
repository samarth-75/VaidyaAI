import { InferenceClient } from '@huggingface/inference';
import multer from 'multer';
import mammoth from 'mammoth';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import Profile from '../models/Profile.js';
import ReportHistory from '../models/ReportHistory.js';

// ─── Multer config (in-memory, max 10 MB) ──────────────────────────────────
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type. Please upload PDF, JPG, PNG, or DOC/DOCX.'), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// ─── PDF text extraction using pdf.js ───────────────────────────────────────
async function extractTextFromPDF(buffer) {
    const uint8Array = new Uint8Array(buffer);
    const doc = await getDocument({ data: uint8Array, useSystemFonts: true }).promise;
    let fullText = '';
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText.trim();
}

// ─── Language full-name map ─────────────────────────────────────────────────
const languageNames = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    ta: 'Tamil',
    te: 'Telugu',
    bn: 'Bengali',
    gu: 'Gujarati',
    kn: 'Kannada'
};

// ─── Build the analysis prompt ──────────────────────────────────────────────
function buildPrompt(langName, content, context = '') {
    const contextPrompt = context ? `\n\nPATIENT HEALTH CONTEXT (take these into account when analyzing and suggesting lifestyle remedies):\n${context}` : '';

    return `You are VaidyaAI, an expert medical report analyzer. Analyze the following medical report and return a JSON response.${contextPrompt}

IMPORTANT RULES:
1. Respond ENTIRELY in ${langName} language.
2. Use simple, everyday language that a non-medical person can understand.
3. For remedies, suggest ONLY lifestyle changes (diet, exercise, yoga, sleep, hydration, stress management). Do NOT suggest any medicines, drugs, or medical treatments.
4. Return ONLY valid JSON, no markdown, no code blocks, no extra text.

The JSON must follow this exact structure:
{
  "summary": "A 2-3 sentence plain-language summary of the report findings",
  "findings": [
    {
      "label": "Test/Parameter name",
      "value": "Measured value with unit",
      "status": "normal OR elevated OR low",
      "normal": "Normal reference range"
    }
  ],
  "remedies": [
    {
      "iconName": "one of: Leaf, Activity, Heart, Pill",
      "title": "Short remedy title",
      "description": "Detailed lifestyle recommendation (diet, exercise, yoga, sleep, etc.)",
      "priority": "high OR medium"
    }
  ]
}

Icon mapping guide:
- "Leaf" = dietary/nutrition advice
- "Activity" = exercise/physical activity
- "Heart" = lifestyle/stress/sleep/wellness
- "Pill" = supplements/vitamins (natural only, NOT prescription drugs)

Medical Report Content:
---
${content}
---

Respond with ONLY the JSON object, nothing else.`;
}

// ─── Controller ─────────────────────────────────────────────────────────────

export const analyzeReport = async (req, res) => {
    try {
        // 1. Validate file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Please upload a medical report.'
            });
        }

        const language = req.body.language || 'en';
        const langName = languageNames[language] || 'English';
        const useProfile = req.body.useProfile !== 'false';
        const mime = req.file.mimetype;

        let profileContext = '';
        if (useProfile && req.user && req.user._id) {
            try {
                const profile = await Profile.findOne({ userId: req.user._id });
                if (profile && !profile.privacyOptOut) {
                    const parts = [];
                    if (profile.conditions) parts.push(`Pre-existing conditions: ${profile.conditions}`);
                    if (profile.allergies) parts.push(`Allergies: ${profile.allergies}`);
                    if (profile.medications) parts.push(`Current medications: ${profile.medications}`);
                    if (parts.length > 0) profileContext = parts.join(' | ');
                }
            } catch (err) {
                console.error("Error fetching profile for context:", err);
            }
        }

        console.log(`📄 Analyzing file: ${req.file.originalname} (${mime}, ${(req.file.size / 1024).toFixed(1)} KB)`);

        // 2. Initialize HF Inference Client
        const client = new InferenceClient(process.env.HF_ACCESS_TOKEN);
        const visionModel = 'Qwen/Qwen2.5-VL-7B-Instruct';
        const textModel = 'Qwen/Qwen2.5-72B-Instruct';

        let messages;

        // 3. Route based on file type
        if (mime === 'image/jpeg' || mime === 'image/png') {
            // ── IMAGES: Send directly to vision model as base64 ──
            console.log('🖼️  Sending image to HF Vision model...');
            const base64Data = req.file.buffer.toString('base64');
            const dataUri = `data:${mime};base64,${base64Data}`;

            messages = [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: { url: dataUri }
                        },
                        {
                            type: 'text',
                            text: buildPrompt(langName, 'See the medical report image above.', profileContext)
                        }
                    ]
                }
            ];

            const result = await client.chatCompletion({
                model: visionModel,
                messages,
                max_tokens: 2048
            });

            return processHFResponse(result, res, req.user._id);

        } else if (mime === 'application/pdf') {
            // ── PDF: Extract text with pdf.js ──
            console.log('📑 Extracting text from PDF...');
            let pdfText = '';
            try {
                pdfText = await extractTextFromPDF(req.file.buffer);
            } catch (pdfErr) {
                console.warn('⚠️  PDF text extraction failed:', pdfErr.message);
            }

            if (pdfText.trim().length < 10) {
                return res.status(422).json({
                    success: false,
                    message: 'Could not extract readable text from the PDF. Please try uploading a clear image (JPG/PNG) of the report instead.'
                });
            }

            console.log(`✅ Extracted ${pdfText.length} chars from PDF`);

            messages = [
                {
                    role: 'user',
                    content: buildPrompt(langName, pdfText, profileContext)
                }
            ];

            const result = await client.chatCompletion({
                model: textModel,
                messages,
                max_tokens: 2048
            });

            return processHFResponse(result, res, req.user._id);

        } else {
            // ── DOC/DOCX: Extract text with mammoth ──
            console.log('📝 Extracting text from DOC/DOCX...');
            let docText = '';
            try {
                const docResult = await mammoth.extractRawText({ buffer: req.file.buffer });
                docText = docResult.value || '';
            } catch (docErr) {
                console.error('❌ mammoth extraction failed:', docErr.message);
                return res.status(422).json({
                    success: false,
                    message: 'Could not read the document file. Please try a different format.'
                });
            }

            if (docText.trim().length < 10) {
                return res.status(422).json({
                    success: false,
                    message: 'The document appears to be empty or contains too little text.'
                });
            }

            console.log(`✅ Extracted ${docText.length} chars from document`);

            messages = [
                {
                    role: 'user',
                    content: buildPrompt(langName, docText, profileContext)
                }
            ];

            const result = await client.chatCompletion({
                model: textModel,
                messages,
                max_tokens: 2048
            });

            return processHFResponse(result, res, req.user._id);
        }

    } catch (error) {
        console.error('❌ Report analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during report analysis.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ─── Process HF response and send to client ────────────────────────────────
async function processHFResponse(result, res, userId) {
    let responseText = result.choices?.[0]?.message?.content || '';
    console.log('🤖 HF raw response length:', responseText.length);

    // Strip markdown code fences if present
    responseText = responseText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

    let analysis;
    try {
        analysis = JSON.parse(responseText);
    } catch (parseErr) {
        console.error('❌ HF response parse error:', parseErr.message);
        console.error('Raw response:', responseText.substring(0, 500));
        return res.status(500).json({
            success: false,
            message: 'AI returned an invalid response. Please try again.'
        });
    }

    // Validate & normalize
    const safeAnalysis = {
        summary: analysis.summary || 'Analysis complete. Please review the findings below.',
        findings: Array.isArray(analysis.findings)
            ? analysis.findings.map(f => ({
                label: f.label || 'Unknown',
                value: f.value || '-',
                status: ['normal', 'elevated', 'low'].includes(f.status) ? f.status : 'normal',
                normal: f.normal || '-'
            }))
            : [],
        remedies: Array.isArray(analysis.remedies)
            ? analysis.remedies.map(r => ({
                iconName: ['Leaf', 'Activity', 'Heart', 'Pill'].includes(r.iconName) ? r.iconName : 'Leaf',
                title: r.title || 'Recommendation',
                description: r.description || '',
                priority: ['high', 'medium'].includes(r.priority) ? r.priority : 'medium'
            }))
            : []
    };

    console.log(`✅ Analysis complete: ${safeAnalysis.findings.length} findings, ${safeAnalysis.remedies.length} remedies`);

    try {
        if (userId) {
            const reportHistory = new ReportHistory({
                userId,
                type: 'Medical Report',
                summary: safeAnalysis.summary,
                abnormalValues: safeAnalysis.findings.map(f => ({
                    name: f.label,
                    value: f.value,
                    status: f.status,
                    normal: f.normal
                })),
                remedies: safeAnalysis.remedies
            });
            await reportHistory.save();
        }
    } catch (saveErr) {
        console.error("Error saving report history:", saveErr);
        // Do not return error, still serve the response
    }

    return res.status(200).json({
        success: true,
        analysis: safeAnalysis
    });
}

// ─── Get Report History ──────────────────────────────────────────────────────
export const getHistory = async (req, res) => {
    try {
        const history = await ReportHistory.find({ userId: req.user._id })
            .sort({ date: -1 }) // Newest first
            .lean(); // Use lean for better performance

        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        console.error('❌ Failed to fetch report history:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching report history.'
        });
    }
};
