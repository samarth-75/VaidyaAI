import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Upload,
  FileText,
  Image,
  File,
  X,
  Sparkles,
  Menu,
  User,
  Calendar,
  History,
  Settings,
  LogOut,
  Loader,
  CheckCircle,
  AlertCircle,
  Leaf,
  Heart,
  Pill,
  Activity,
} from "lucide-react";

/* =========================
   TRANSLATIONS (ALL LANGS)
========================= */

const translations = {
  en: {
    title: "Medical Report Analysis Dashboard",
    aiReady: "AI Ready",
    uploadTitle: "Upload Medical Reports",
    uploadSubtitle: "Upload your PDF, images, or documents for AI analysis",
    dropFiles: "Drop files here or click to browse",
    supportedFiles: "Supports PDF, JPG, PNG, DOC (Max 10MB)",
    outputTitle: "AI Analysis Output",
    uploadPrompt: "Upload files and click \"Analyze\" to see results",
    analyzing: "AI is analyzing your reports...",
    analyzingWait: "This may take a few moments",
    summary: "Summary",
    keyFindings: "Key Findings",
    normal: "Normal",
    uploadedFilesTitle: "Uploaded Files",
    noFiles: "No files uploaded yet",
    analyzeBtn: "Analyze Reports",
    analyzingBtn: "Analyzing...",
    remediesTitle: "Recommended Remedies",
    remediesPrompt: "Remedies will appear after analysis",
    highPriority: "High Priority",
    sidebar: {
      profile: "Profile",
      appointment: "Dr. Appointment",
      history: "History",
      settings: "Settings",
      logout: "Logout"
    }
  },
  hi: {
    title: "मेडिकल रिपोर्ट विश्लेषण डैशबोर्ड",
    aiReady: "AI तैयार",
    uploadTitle: "मेडिकल रिपोर्ट अपलोड करें",
    uploadSubtitle: "AI विश्लेषण के लिए अपनी PDF, छवियां या दस्तावेज़ अपलोड करें",
    dropFiles: "फ़ाइलें यहां छोड़ें या ब्राउज़ करने के लिए क्लिक करें",
    supportedFiles: "PDF, JPG, PNG, DOC समर्थित (अधिकतम 10MB)",
    outputTitle: "AI विश्लेषण परिणाम",
    uploadPrompt: "परिणाम देखने के लिए फ़ाइलें अपलोड करें और \"विश्लेषण करें\" पर क्लिक करें",
    analyzing: "AI आपकी रिपोर्ट का विश्लेषण कर रहा है...",
    analyzingWait: "इसमें कुछ समय लग सकता है",
    summary: "सारांश",
    keyFindings: "मुख्य निष्कर्ष",
    normal: "सामान्य",
    uploadedFilesTitle: "अपलोड की गई फ़ाइलें",
    noFiles: "अभी तक कोई फ़ाइल अपलोड नहीं की गई",
    analyzeBtn: "रिपोर्ट का विश्लेषण करें",
    analyzingBtn: "विश्लेषण हो रहा है...",
    remediesTitle: "अनुशंसित उपाय",
    remediesPrompt: "विश्लेषण के बाद उपाय दिखाई देंगे",
    highPriority: "उच्च प्राथमिकता",
    sidebar: {
      profile: "प्रोफ़ाइल",
      appointment: "डॉक्टर की नियुक्ति",
      history: "इतिहास",
      settings: "सेटिंग्स",
      logout: "लॉगआउट"
    }
  },
  mr: {
    title: "वैद्यकीय अहवाल विश्लेषण डॅशबोर्ड",
    aiReady: "AI तयार",
    uploadTitle: "वैद्यकीय अहवाल अपलोड करा",
    uploadSubtitle: "AI विश्लेषणासाठी तुमची PDF, प्रतिमा किंवा दस्तऐवज अपलोड करा",
    dropFiles: "फाइल्स येथे टाका किंवा ब्राउझ करण्यासाठी क्लिक करा",
    supportedFiles: "PDF, JPG, PNG, DOC समर्थित (कमाल 10MB)",
    outputTitle: "AI विश्लेषण परिणाम",
    uploadPrompt: "परिणाम पाहण्यासाठी फाइल्स अपलोड करा आणि \"विश्लेषण करा\" वर क्लिक करा",
    analyzing: "AI तुमच्या अहवालांचे विश्लेषण करत आहे...",
    analyzingWait: "याला काही वेळ लागू शकतो",
    summary: "सारांश",
    keyFindings: "मुख्य निष्कर्ष",
    normal: "सामान्य",
    uploadedFilesTitle: "अपलोड केलेल्या फाइल्स",
    noFiles: "अद्याप कोणतीही फाइल अपलोड केलेली नाही",
    analyzeBtn: "अहवालांचे विश्लेषण करा",
    analyzingBtn: "विश्लेषण होत आहे...",
    remediesTitle: "शिफारस केलेले उपाय",
    remediesPrompt: "विश्लेषणानंतर उपाय दिसतील",
    highPriority: "उच्च प्राधान्य",
    sidebar: {
      profile: "प्रोफाइल",
      appointment: "डॉक्टर भेट",
      history: "इतिहास",
      settings: "सेटिंग्ज",
      logout: "लॉगआउट"
    }
  },
  ta: {
    title: "மருத்துவ அறிக்கை பகுப்பாய்வு டாஷ்போர்டு",
    aiReady: "AI தயார்",
    uploadTitle: "மருத்துவ அறிக்கைகளைப் பதிவேற்றவும்",
    uploadSubtitle: "AI பகுப்பாய்வுக்கு உங்கள் PDF, படங்கள் அல்லது ஆவணங்களைப் பதிவேற்றவும்",
    dropFiles: "கோப்புகளை இங்கே இடவும் அல்லது உலாவ கிளிக் செய்யவும்",
    supportedFiles: "PDF, JPG, PNG, DOC ஆதரிக்கப்படும் (அதிகபட்சம் 10MB)",
    outputTitle: "AI பகுப்பாய்வு வெளியீடு",
    uploadPrompt: "முடிவுகளைக் காண கோப்புகளைப் பதிவேற்றி \"பகுப்பாய்வு செய்\" என்பதைக் கிளிக் செய்யவும்",
    analyzing: "AI உங்கள் அறிக்கைகளைப் பகுப்பாய்வு செய்கிறது...",
    analyzingWait: "இது சில நிமிடங்கள் ஆகலாம்",
    summary: "சுருக்கம்",
    keyFindings: "முக்கிய கண்டுபிடிப்புகள்",
    normal: "இயல்பான",
    uploadedFilesTitle: "பதிவேற்றப்பட்ட கோப்புகள்",
    noFiles: "இன்னும் கோப்புகள் பதிவேற்றப்படவில்லை",
    analyzeBtn: "அறிக்கைகளைப் பகுப்பாய்வு செய்",
    analyzingBtn: "பகுப்பாய்வு செய்யப்படுகிறது...",
    remediesTitle: "பரிந்துரைக்கப்பட்ட தீர்வுகள்",
    remediesPrompt: "பகுப்பாய்வுக்குப் பிறகு தீர்வுகள் தோன்றும்",
    highPriority: "உயர் முன்னுரிமை",
    sidebar: {
      profile: "சுயவிவரம்",
      appointment: "மருத்துவர் சந்திப்பு",
      history: "வரலாறு",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு"
    }
  },
  te: {
    title: "వైద్య నివేదిక విశ్లేషణ డాష్‌బోర్డ్",
    aiReady: "AI సిద్ధంగా ఉంది",
    uploadTitle: "వైద్య నివేదికలను అప్‌లోడ్ చేయండి",
    uploadSubtitle: "AI విశ్లేషణ కోసం మీ PDF, చిత్రాలు లేదా పత్రాలను అప్‌లోడ్ చేయండి",
    dropFiles: "ఫైల్‌లను ఇక్కడ వదలండి లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి",
    supportedFiles: "PDF, JPG, PNG, DOC మద్దతు ఇస్తుంది (గరిష్టంగా 10MB)",
    outputTitle: "AI విశ్లేషణ అవుట్‌పుట్",
    uploadPrompt: "ఫలితాలను చూడటానికి ఫైల్‌లను అప్‌లోడ్ చేసి \"విశ్లేషించు\"ని క్లిక్ చేయండి",
    analyzing: "AI మీ నివేదికలను విశ్లేషిస్తోంది...",
    analyzingWait: "దీనికి కొన్ని క్షణాలు పట్టవచ్చు",
    summary: "సారాంశం",
    keyFindings: "కీలక కనుగొన్నవి",
    normal: "సాధారణ",
    uploadedFilesTitle: "అప్‌లోడ్ చేసిన ఫైల్‌లు",
    noFiles: "ఇంకా ఫైల్‌లు అప్‌లోడ్ చేయలేదు",
    analyzeBtn: "నివేదికలను విశ్లేషించండి",
    analyzingBtn: "విశ్లేషిస్తోంది...",
    remediesTitle: "సిఫార్సు చేసిన పరిష్కారాలు",
    remediesPrompt: "విశ్లేషణ తర్వాత పరిష్కారాలు కనిపిస్తాయి",
    highPriority: "అధిక ప్రాధాన్యత",
    sidebar: {
      profile: "ప్రొఫైల్",
      appointment: "వైద్యుల అపాయింట్‌మెంట్",
      history: "చరిత్ర",
      settings: "సెట్టింగ్‌లు",
      logout: "లాగ్అవుట్"
    }
  },
  bn: {
    title: "চিকিৎসা প্রতিবেদন বিশ্লেষণ ড্যাশবোর্ড",
    aiReady: "AI প্রস্তুত",
    uploadTitle: "চিকিৎসা প্রতিবেদন আপলোড করুন",
    uploadSubtitle: "AI বিশ্লেষণের জন্য আপনার PDF, ছবি বা নথি আপলোড করুন",
    dropFiles: "এখানে ফাইল ড্রপ করুন বা ব্রাউজ করতে ক্লিক করুন",
    supportedFiles: "PDF, JPG, PNG, DOC সমর্থিত (সর্বোচ্চ 10MB)",
    outputTitle: "AI বিশ্লেষণ আউটপুট",
    uploadPrompt: "ফলাফল দেখতে ফাইল আপলোড করুন এবং \"বিশ্লেষণ করুন\" ক্লিক করুন",
    analyzing: "AI আপনার প্রতিবেদন বিশ্লেষণ করছে...",
    analyzingWait: "এতে কিছু সময় লাগতে পারে",
    summary: "সারাংশ",
    keyFindings: "মূল ফলাফল",
    normal: "স্বাভাবিক",
    uploadedFilesTitle: "আপলোড করা ফাইল",
    noFiles: "এখনও কোনো ফাইল আপলোড করা হয়নি",
    analyzeBtn: "প্রতিবেদন বিশ্লেষণ করুন",
    analyzingBtn: "বিশ্লেষণ করা হচ্ছে...",
    remediesTitle: "প্রস্তাবিত প্রতিকার",
    remediesPrompt: "বিশ্লেষণের পরে প্রতিকার দেখাবে",
    highPriority: "উচ্চ অগ্রাধিকার",
    sidebar: {
      profile: "প্রোফাইল",
      appointment: "ডাক্তার অ্যাপয়েন্টমেন্ট",
      history: "ইতিহাস",
      settings: "সেটিংস",
      logout: "লগআউট"
    }
  },
  gu: {
    title: "તબીબી અહેવાલ વિશ્લેષણ ડેશબોર્ડ",
    aiReady: "AI તૈયાર",
    uploadTitle: "તબીબી અહેવાલો અપલોડ કરો",
    uploadSubtitle: "AI વિશ્લેષણ માટે તમારી PDF, છબીઓ અથવા દસ્તાવેજો અપલોડ કરો",
    dropFiles: "અહીં ફાઇલો મૂકો અથવા બ્રાઉઝ કરવા માટે ક્લિક કરો",
    supportedFiles: "PDF, JPG, PNG, DOC સમર્થિત (મહત્તમ 10MB)",
    outputTitle: "AI વિશ્લેષણ આઉટપુટ",
    uploadPrompt: "પરિણામો જોવા માટે ફાઇલો અપલોડ કરો અને \"વિશ્લેષણ કરો\" ક્લિક કરો",
    analyzing: "AI તમારા અહેવાલોનું વિશ્લેષણ કરી રહ્યું છે...",
    analyzingWait: "આમાં થોડો સમય લાગી શકે છે",
    summary: "સારાંશ",
    keyFindings: "મુખ્ય તારણો",
    normal: "સામાન્ય",
    uploadedFilesTitle: "અપલોડ કરેલી ફાઇલો",
    noFiles: "હજુ સુધી કોઈ ફાઇલ અપલોડ કરવામાં આવી નથી",
    analyzeBtn: "અહેવાલોનું વિશ્લેષણ કરો",
    analyzingBtn: "વિશ્લેષણ થઈ રહ્યું છે...",
    remediesTitle: "ભલામણ કરેલ ઉપાયો",
    remediesPrompt: "વિશ્લેષણ પછી ઉપાયો દેખાશે",
    highPriority: "ઉચ્ચ પ્રાથમિકતા",
    sidebar: {
      profile: "પ્રોફાઇલ",
      appointment: "ડૉક્ટર મુલાકાત",
      history: "ઇતિહાસ",
      settings: "સેટિંગ્સ",
      logout: "લૉગઆઉટ"
    }
  },
  kn: {
    title: "ವೈದ್ಯಕೀಯ ವರದಿ ವಿಶ್ಲೇಷಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    aiReady: "AI ಸಿದ್ಧ",
    uploadTitle: "ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    uploadSubtitle: "AI ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಿಮ್ಮ PDF, ಚಿತ್ರಗಳು ಅಥವಾ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    dropFiles: "ಫೈಲ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಬಿಡಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    supportedFiles: "PDF, JPG, PNG, DOC ಬೆಂಬಲಿತ (ಗರಿಷ್ಠ 10MB)",
    outputTitle: "AI ವಿಶ್ಲೇಷಣೆ ಔಟ್‌ಪುಟ್",
    uploadPrompt: "ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಲು ಫೈಲ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು \"ವಿಶ್ಲೇಷಿಸಿ\" ಕ್ಲಿಕ್ ಮಾಡಿ",
    analyzing: "AI ನಿಮ್ಮ ವರದಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
    analyzingWait: "ಇದಕ್ಕೆ ಸ್ವಲ್ಪ ಸಮಯ ತೆಗೆದುಕೊಳ್ಳಬಹುದು",
    summary: "ಸಾರಾಂಶ",
    keyFindings: "ಪ್ರಮುಖ ಸಂಶೋಧನೆಗಳು",
    normal: "ಸಾಮಾನ್ಯ",
    uploadedFilesTitle: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಫೈಲ್‌ಗಳು",
    noFiles: "ಇನ್ನೂ ಯಾವುದೇ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿಲ್ಲ",
    analyzeBtn: "ವರದಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    analyzingBtn: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    remediesTitle: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಪರಿಹಾರಗಳು",
    remediesPrompt: "ವಿಶ್ಲೇಷಣೆಯ ನಂತರ ಪರಿಹಾರಗಳು ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ",
    highPriority: "ಹೆಚ್ಚಿನ ಆದ್ಯತೆ",
    sidebar: {
      profile: "ಪ್ರೊಫೈಲ್",
      appointment: "ವೈದ್ಯರ ನೇಮಕಾತಿ",
      history: "ಇತಿಹಾಸ",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      logout: "ಲಾಗ್ಔಟ್"
    }
  }
};

/* =========================
   COMPONENT
========================= */

const VaidyaAIApp = ({ language = 'en' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentLang, setCurrentLang] = useState(language);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [output, setOutput] = useState(null);
  const [remedies, setRemedies] = useState([]);
  const fileInputRef = useRef(null);

  const t = translations[currentLang];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'document',
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const analyzeReports = () => {
    if (uploadedFiles.length === 0) return;

    setAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
      setOutput({
        summary: "Your blood test results show slightly elevated cholesterol levels (220 mg/dL) and vitamin D deficiency (18 ng/mL). Your hemoglobin levels are normal at 14.2 g/dL. Liver function tests are within normal range.",
        findings: [
          { label: "Total Cholesterol", value: "220 mg/dL", status: "elevated", normal: "< 200 mg/dL" },
          { label: "Vitamin D", value: "18 ng/mL", status: "low", normal: "30-100 ng/mL" },
          { label: "Hemoglobin", value: "14.2 g/dL", status: "normal", normal: "13.5-17.5 g/dL" },
          { label: "Liver Enzymes", value: "Normal", status: "normal", normal: "Within range" }
        ]
      });
      setRemedies([
        {
          icon: Leaf,
          title: "Dietary Changes",
          description: "Reduce saturated fats. Include more fiber-rich foods like oats, beans, and vegetables. Add fatty fish (salmon, mackerel) twice weekly.",
          priority: "high"
        },
        {
          icon: Activity,
          title: "Exercise Routine",
          description: "30 minutes of moderate cardio 5 times per week. Include walking, jogging, or cycling to help lower cholesterol naturally.",
          priority: "high"
        },
        {
          icon: Pill,
          title: "Vitamin D Supplementation",
          description: "Take Vitamin D3 supplement (2000 IU daily) with a meal containing healthy fats for better absorption. Get 15-20 minutes of sunlight daily.",
          priority: "medium"
        },
        {
          icon: Heart,
          title: "Lifestyle Modifications",
          description: "Maintain healthy weight, reduce stress through yoga or meditation, ensure 7-8 hours of quality sleep, and avoid smoking.",
          priority: "medium"
        }
      ]);
    }, 3000);
  };

  const sidebarItems = [
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Calendar, label: 'Dr. Appointment', id: 'appointment' },
    { icon: History, label: 'History', id: 'history' },
    { icon: Settings, label: 'Settings', id: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-gradient-to-b from-emerald-900 to-teal-900 text-white transition-all duration-500 z-50 ${sidebarOpen ? 'w-72' : 'w-20'} shadow-2xl`}>
        <div className="p-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 p-2 hover:bg-emerald-800 rounded-lg transition-all duration-300"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="space-y-2">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                className="w-full flex items-center gap-4 p-3 hover:bg-emerald-800 rounded-xl transition-all duration-300 group"
              >
                <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className={`font-medium whitespace-nowrap transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 hover:bg-red-800 rounded-xl transition-all duration-300 group">
              <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className={`font-medium whitespace-nowrap transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-emerald-200 sticky top-0 z-40 shadow-sm">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                वैद्यAI
              </h1>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Crimson Text, serif' }}>Medical Report Analysis Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">{user.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-800">AI Ready</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Grid */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Crimson Text, serif' }}>
                  <Upload className="w-7 h-7" />
                  Upload Medical Reports
                </h2>
                <p className="text-emerald-50 mt-2">Upload your PDF, images, or documents for AI analysis</p>
              </div>

              <div className="p-8">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-3 border-dashed border-emerald-300 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Drop files here or click to browse</p>
                      <p className="text-sm text-gray-500 mt-1">Supports PDF, JPG, PNG, DOC (Max 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-yellow-100 overflow-hidden min-h-[400px]">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Crimson Text, serif' }}>
                  <Sparkles className="w-7 h-7" />
                  AI Analysis Output
                </h2>
              </div>

              <div className="p-8">
                {!analysisComplete && !analyzing && (
                  <div className="text-center py-16 text-gray-400">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Upload files and click "Analyze" to see results</p>
                  </div>
                )}

                {analyzing && (
                  <div className="text-center py-16">
                    <Loader className="w-16 h-16 mx-auto mb-4 text-emerald-600 animate-spin" />
                    <p className="text-lg font-semibold text-gray-700">AI is analyzing your reports...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                )}

                {analysisComplete && output && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg">
                      <h3 className="font-bold text-emerald-900 mb-3 text-lg">Summary</h3>
                      <p className="text-gray-700 leading-relaxed">{output.summary}</p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-900 text-lg">Key Findings</h3>
                      {output.findings.map((finding, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{finding.label}</p>
                            <p className="text-sm text-gray-500">Normal: {finding.normal}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg text-gray-900">{finding.value}</span>
                            {finding.status === 'elevated' && <AlertCircle className="w-6 h-6 text-orange-500" />}
                            {finding.status === 'low' && <AlertCircle className="w-6 h-6 text-yellow-500" />}
                            {finding.status === 'normal' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Uploaded Files */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Crimson Text, serif' }}>
                  <FileText className="w-7 h-7" />
                  Uploaded Files
                </h2>
              </div>

              <div className="p-6 max-h-[400px] overflow-y-auto">
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <File className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No files uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 group hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          {file.type === 'pdf' && <FileText className="w-5 h-5 text-purple-700" />}
                          {file.type === 'image' && <Image className="w-5 h-5 text-purple-700" />}
                          {file.type === 'document' && <File className="w-5 h-5 text-purple-700" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <button
                    onClick={analyzeReports}
                    disabled={analyzing}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analyze Reports
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Remedies Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Crimson Text, serif' }}>
                  <Heart className="w-7 h-7" />
                  Recommended Remedies
                </h2>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                {remedies.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Remedies will appear after analysis</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {remedies.map((remedy, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all duration-300 animate-slideIn"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${remedy.priority === 'high' ? 'bg-orange-200' : 'bg-green-200'
                            }`}>
                            <remedy.icon className={`w-6 h-6 ${remedy.priority === 'high' ? 'text-orange-700' : 'text-green-700'
                              }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-gray-900">{remedy.title}</h3>
                              {remedy.priority === 'high' && (
                                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-semibold">
                                  High Priority
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{remedy.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Crimson+Text:wght@400;600;700&display=swap');
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 20s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default VaidyaAIApp;