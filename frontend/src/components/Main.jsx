import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ProfilePage from "./ProfilePage";
import AppointmentsPage from "./AppointmentsPage";
import HistoryPage from "./HistoryPage";
import SettingsPage from "./SettingsPage";
import {
  Upload,
  FileText,
  Image,
  File,
  X,
  Sparkles,
  ArrowLeft,
  Shield,
  Menu,
  User,
  Calendar,
  History,
  Settings,
  LogOut,
  Loader,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
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
      logout: "Logout",
      backToDashboard: "Back to Dashboard"
    },
    disclaimer: {
      title: "Important Disclaimer",
      body: "VaidyaAI is an educational tool designed to help you understand your medical reports. It does NOT provide medical diagnosis, treatment advice, or prescriptions. Always consult a qualified healthcare professional for medical advice.",
      point1: "This is NOT a medical diagnosis",
      point2: "Always consult your doctor",
      point3: "Educational purposes only",
      button: "I Understand"
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
      logout: "लॉगआउट",
      backToDashboard: "डैशबोर्ड पर वापस"
    },
    disclaimer: {
      title: "महत्वपूर्ण अस्वीकरण",
      body: "वैद्यAI आपकी मेडिकल रिपोर्ट को समझने में मदद करने के लिए डिज़ाइन किया गया एक शैक्षिक उपकरण है। यह चिकित्सा निदान, उपचार सलाह या नुस्खे प्रदान नहीं करता। चिकित्सा सलाह के लिए हमेशा एक योग्य स्वास्थ्य पेशेवर से परामर्श करें।",
      point1: "यह चिकित्सा निदान नहीं है",
      point2: "हमेशा अपने डॉक्टर से परामर्श करें",
      point3: "केवल शैक्षिक उद्देश्यों के लिए",
      button: "मैं समझता/समझती हूँ"
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
      logout: "लॉगआउट",
      backToDashboard: "डॅशबोर्डवर परत"
    },
    disclaimer: {
      title: "महत्त्वाचे अस्वीकरण",
      body: "वैद्यAI हे तुमचे वैद्यकीय अहवाल समजून घेण्यासाठी तयार केलेले शैक्षणिक साधन आहे. हे वैद्यकीय निदान, उपचार सल्ला किंवा प्रिस्क्रिप्शन देत नाही. वैद्यकीय सल्ल्यासाठी नेहमी पात्र आरोग्य व्यावसायिकांचा सल्ला घ्या.",
      point1: "हे वैद्यकीय निदान नाही",
      point2: "नेहमी तुमच्या डॉक्टरांचा सल्ला घ्या",
      point3: "केवळ शैक्षणिक हेतूंसाठी",
      button: "मला समजले"
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
      logout: "வெளியேறு",
      backToDashboard: "டாஷ்போர்டுக்குத் திரும்பு"
    },
    disclaimer: {
      title: "முக்கியமான மறுப்பு",
      body: "VaidyaAI உங்கள் மருத்துவ அறிக்கைகளைப் புரிந்துகொள்ள உதவும் கல்வி கருவி. இது மருத்துவ நோய் கண்டறிதல், சிகிச்சை ஆலோசனை அல்லது மருந்துச் சீட்டுகளை வழங்காது. மருத்துவ ஆலோசனைக்கு எப்போதும் தகுதிவாய்ந்த மருத்துவரை அணுகவும்.",
      point1: "இது மருத்துவ நோய் கண்டறிதல் அல்ல",
      point2: "எப்போதும் உங்கள் மருத்துவரை அணுகவும்",
      point3: "கல்வி நோக்கங்களுக்கு மட்டுமே",
      button: "நான் புரிந்துகொள்கிறேன்"
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
      logout: "లాగ్అవుట్",
      backToDashboard: "డాష్‌బోర్డ్‌కు తిరిగి"
    },
    disclaimer: {
      title: "ముఖ్యమైన నిరాకరణ",
      body: "VaidyaAI మీ వైద్య నివేదికలను అర్థం చేసుకోవడంలో సహాయం చేయడానికి రూపొందించబడిన విద్యా సాధనం. ఇది వైద్య రోగ నిర్ధారణ, చికిత్స సలహా లేదా ప్రిస్క్రిప్షన్‌లను అందించదు. వైద్య సలహా కోసం ఎల్లప్పుడూ అర్హత కలిగిన వైద్య నిపుణులను సంప్రదించండి.",
      point1: "ఇది వైద్య రోగ నిర్ధారణ కాదు",
      point2: "ఎల్లప్పుడూ మీ వైద్యుడిని సంప్రదించండి",
      point3: "విద్యా ప్రయోజనాల కోసం మాత్రమే",
      button: "నేను అర్థం చేసుకున్నాను"
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
      logout: "লগআউট",
      backToDashboard: "ড্যাশবোর্ডে ফিরুন"
    },
    disclaimer: {
      title: "গুরুত্বপূর্ণ দাবিত্যাগ",
      body: "VaidyaAI আপনার চিকিৎসা প্রতিবেদন বুঝতে সাহায্য করার জন্য ডিজাইন করা একটি শিক্ষামূলক সরঞ্জাম। এটি চিকিৎসা নির্ণয়, চিকিৎসা পরামর্শ বা প্রেসক্রিপশন প্রদান করে না। চিকিৎসা পরামর্শের জন্য সর্বদা একজন যোগ্য স্বাস্থ্য পেশাদারের সাথে পরামর্শ করুন।",
      point1: "এটি চিকিৎসা নির্ণয় নয়",
      point2: "সর্বদা আপনার ডাক্তারের সাথে পরামর্শ করুন",
      point3: "শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে",
      button: "আমি বুঝেছি"
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
      logout: "લૉગઆઉટ",
      backToDashboard: "ડેશબોર્ડ પર પાછા"
    },
    disclaimer: {
      title: "મહત્વપૂર્ણ અસ્વીકરણ",
      body: "VaidyaAI તમારા તબીબી અહેવાલો સમજવામાં મદદ કરવા માટે રચાયેલ શૈક્ષણિક સાધન છે. તે તબીબી નિદાન, સારવાર સલાહ અથવા પ્રિસ્ક્રિપ્શન પ્રદાન કરતું નથી. તબીબી સલાહ માટે હંમેશા લાયક આરોગ્ય વ્યાવસાયિકની સલાહ લો.",
      point1: "આ તબીબી નિદાન નથી",
      point2: "હંમેશા તમારા ડૉક્ટરની સલાહ લો",
      point3: "ફક્ત શૈક્ષણિક હેતુઓ માટે",
      button: "હું સમજું છું"
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
      logout: "ಲಾಗ್ಔಟ್",
      backToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ"
    },
    disclaimer: {
      title: "ಮಹತ್ವದ ಹಕ್ಕು ನಿರಾಕರಣೆ",
      body: "VaidyaAI ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಶೈಕ್ಷಣಿಕ ಸಾಧನವಾಗಿದೆ. ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ, ಚಿಕಿತ್ಸೆ ಸಲಹೆ ಅಥವಾ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳನ್ನು ಒದಗಿಸುವುದಿಲ್ಲ. ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾಗಿ ಯಾವಾಗಲೂ ಅರ್ಹ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      point1: "ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ ಅಲ್ಲ",
      point2: "ಯಾವಾಗಲೂ ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ",
      point3: "ಶೈಕ್ಷಣಿಕ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ",
      button: "ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ"
    }
  }
};

/* =========================
   COMPONENT
========================= */

const VaidyaAIApp = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentLang } = useLanguage();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [output, setOutput] = useState(null);
  const [remedies, setRemedies] = useState([]);
  const fileInputRef = useRef(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return !sessionStorage.getItem('vaidyaai_disclaimer_seen');
  });

  const handleDisclaimerClose = () => {
    sessionStorage.setItem('vaidyaai_disclaimer_seen', 'true');
    setShowDisclaimer(false);
  };

  const handleSidebarClick = (id) => {
    setActivePage(id);
  };

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
    { icon: User, label: t.sidebar.profile, id: 'profile' },
    { icon: Calendar, label: t.sidebar.appointment, id: 'appointment' },
    { icon: History, label: t.sidebar.history, id: 'history' },
    { icon: Settings, label: t.sidebar.settings, id: 'settings' }
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
                onClick={() => handleSidebarClick(item.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${activePage === item.id ? 'bg-emerald-700 shadow-lg' : 'hover:bg-emerald-800'
                  }`}
              >
                <item.icon className={`w-6 h-6 transition-transform ${activePage === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
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
                {t.sidebar.logout}
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
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Crimson Text, serif' }}>{t.title}</p>
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
                <span className="text-sm font-medium text-emerald-800">{t.aiReady}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Conditional Page Rendering */}
        {activePage === 'dashboard' && (
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Crimson Text, serif' }}>
                    <Upload className="w-7 h-7" />
                    {t.uploadTitle}
                  </h2>
                  <p className="text-emerald-50 mt-2">{t.uploadSubtitle}</p>
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
                        <p className="text-lg font-semibold text-gray-700">{t.dropFiles}</p>
                        <p className="text-sm text-gray-500 mt-1">{t.supportedFiles}</p>
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
                    {t.outputTitle}
                  </h2>
                </div>

                <div className="p-8">
                  {!analysisComplete && !analyzing && (
                    <div className="text-center py-16 text-gray-400">
                      <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg">{t.uploadPrompt}</p>
                    </div>
                  )}

                  {analyzing && (
                    <div className="text-center py-16">
                      <Loader className="w-16 h-16 mx-auto mb-4 text-emerald-600 animate-spin" />
                      <p className="text-lg font-semibold text-gray-700">{t.analyzing}</p>
                      <p className="text-sm text-gray-500 mt-2">{t.analyzingWait}</p>
                    </div>
                  )}

                  {analysisComplete && output && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg">
                        <h3 className="font-bold text-emerald-900 mb-3 text-lg">{t.summary}</h3>
                        <p className="text-gray-700 leading-relaxed">{output.summary}</p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-lg">{t.keyFindings}</h3>
                        {output.findings.map((finding, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{finding.label}</p>
                              <p className="text-sm text-gray-500">{t.normal}: {finding.normal}</p>
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
                    {t.uploadedFilesTitle}
                  </h2>
                </div>

                <div className="p-6 max-h-[400px] overflow-y-auto">
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <File className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>{t.noFiles}</p>
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
                          {t.analyzingBtn}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          {t.analyzeBtn}
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
                    {t.remediesTitle}
                  </h2>
                </div>

                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {remedies.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>{t.remediesPrompt}</p>
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
        )}

        {activePage === 'profile' && (
          <div className="animate-fadeIn">
            <div className="p-6">
              <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium mb-4 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                {t.sidebar.backToDashboard}
              </button>
            </div>
            <ProfilePage />
          </div>
        )}

        {activePage === 'appointment' && (
          <div className="animate-fadeIn">
            <div className="p-6">
              <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium mb-4 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                {t.sidebar.backToDashboard}
              </button>
            </div>
            <AppointmentsPage />
          </div>
        )}

        {activePage === 'history' && (
          <div className="animate-fadeIn">
            <div className="p-6">
              <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium mb-4 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                {t.sidebar.backToDashboard}
              </button>
            </div>
            <HistoryPage />
          </div>
        )}

        {activePage === 'settings' && (
          <div className="animate-fadeIn">
            <div className="p-6">
              <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium mb-4 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                {t.sidebar.backToDashboard}
              </button>
            </div>
            <SettingsPage />
          </div>
        )}
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

      {/* Disclaimer Popup */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            {/* Orange Header */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                {t.disclaimer.title}
              </h2>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {t.disclaimer.body}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{t.disclaimer.point1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{t.disclaimer.point2}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{t.disclaimer.point3}</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="px-6 pb-6">
              <button
                onClick={handleDisclaimerClose}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                {t.disclaimer.button}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaidyaAIApp;