import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import {
    Mail,
    Lock,
    Shield,
    Eye,
    EyeOff,
    Save,
    Info,
    AlertTriangle,
    CheckCircle,
    ShieldCheck,
    Database,
    FileText,
} from "lucide-react";

/* =========================
   TRANSLATIONS (ALL LANGS)
========================= */

const settingsTranslations = {
    en: {
        pageTitle: "Settings",
        pageSubtitle: "Manage your account preferences and privacy",

        // Change Email
        emailSection: "Change Email",
        emailDesc: "Update your account email address",
        currentEmail: "Current Email",
        newEmail: "New Email Address",
        newEmailPlaceholder: "Enter new email address",
        saveEmail: "Update Email",

        // Change Password
        passwordSection: "Change Password",
        passwordDesc: "Update your account password",
        currentPassword: "Current Password",
        currentPasswordPlaceholder: "Enter current password",
        newPassword: "New Password",
        newPasswordPlaceholder: "Enter new password",
        confirmPassword: "Confirm New Password",
        confirmPasswordPlaceholder: "Re-enter new password",
        savePassword: "Update Password",

        // Privacy Toggle
        privacySection: "Privacy Settings",
        privacyToggleLabel: "Do not use my personal medical conditions for report analysis",
        privacyToggleDesc: "When enabled, the AI will analyze your reports without referencing your saved medical history or personal health conditions.",

        // Disclaimer
        disclaimerSection: "Data Privacy & Security",
        disclaimerItems: [
            {
                icon: "shield",
                title: "End-to-End Encryption",
                desc: "All your personal data and medical reports are encrypted using industry-standard AES-256 encryption, both in transit and at rest.",
            },
            {
                icon: "database",
                title: "Data Usage Policy",
                desc: "Your personal medical data is used solely for generating report analysis within this application. We never sell, share, or distribute your data to any third parties.",
            },
            {
                icon: "file",
                title: "Report Analysis Only",
                desc: "Your health information is only accessed during active report analysis sessions. No data is stored beyond what is necessary for your account functionality.",
            },
            {
                icon: "check",
                title: "Your Control",
                desc: "You have full control over your data. You can delete your account and all associated data at any time. We respect your right to privacy.",
            },
        ],
    },

    hi: {
        pageTitle: "सेटिंग्स",
        pageSubtitle: "अपनी खाता प्राथमिकताएं और गोपनीयता प्रबंधित करें",
        emailSection: "ईमेल बदलें",
        emailDesc: "अपना खाता ईमेल पता अपडेट करें",
        currentEmail: "वर्तमान ईमेल",
        newEmail: "नया ईमेल पता",
        newEmailPlaceholder: "नया ईमेल पता दर्ज करें",
        saveEmail: "ईमेल अपडेट करें",
        passwordSection: "पासवर्ड बदलें",
        passwordDesc: "अपना खाता पासवर्ड अपडेट करें",
        currentPassword: "वर्तमान पासवर्ड",
        currentPasswordPlaceholder: "वर्तमान पासवर्ड दर्ज करें",
        newPassword: "नया पासवर्ड",
        newPasswordPlaceholder: "नया पासवर्ड दर्ज करें",
        confirmPassword: "नया पासवर्ड पुष्टि करें",
        confirmPasswordPlaceholder: "नया पासवर्ड फिर से दर्ज करें",
        savePassword: "पासवर्ड अपडेट करें",
        privacySection: "गोपनीयता सेटिंग्स",
        privacyToggleLabel: "रिपोर्ट विश्लेषण के लिए मेरी व्यक्तिगत चिकित्सा स्थितियों का उपयोग न करें",
        privacyToggleDesc: "सक्षम होने पर, AI आपके सहेजे गए चिकित्सा इतिहास या व्यक्तिगत स्वास्थ्य स्थितियों का संदर्भ लिए बिना आपकी रिपोर्ट का विश्लेषण करेगा।",
        disclaimerSection: "डेटा गोपनीयता और सुरक्षा",
        disclaimerItems: [
            { icon: "shield", title: "एंड-टू-एंड एन्क्रिप्शन", desc: "आपके सभी व्यक्तिगत डेटा और चिकित्सा रिपोर्ट उद्योग-मानक AES-256 एन्क्रिप्शन का उपयोग करके एन्क्रिप्ट किए गए हैं।" },
            { icon: "database", title: "डेटा उपयोग नीति", desc: "आपका व्यक्तिगत चिकित्सा डेटा केवल इस एप्लिकेशन के भीतर रिपोर्ट विश्लेषण उत्पन्न करने के लिए उपयोग किया जाता है। हम कभी भी आपका डेटा तीसरे पक्षों को नहीं बेचते।" },
            { icon: "file", title: "केवल रिपोर्ट विश्लेषण", desc: "आपकी स्वास्थ्य जानकारी केवल सक्रिय रिपोर्ट विश्लेषण सत्रों के दौरान एक्सेस की जाती है।" },
            { icon: "check", title: "आपका नियंत्रण", desc: "आपके डेटा पर आपका पूर्ण नियंत्रण है। आप किसी भी समय अपना खाता और सभी संबंधित डेटा हटा सकते हैं।" },
        ],
    },

    mr: {
        pageTitle: "सेटिंग्ज",
        pageSubtitle: "तुमच्या खात्याची प्राधान्ये आणि गोपनीयता व्यवस्थापित करा",
        emailSection: "ईमेल बदला",
        emailDesc: "तुमचा खाते ईमेल पत्ता अपडेट करा",
        currentEmail: "सध्याचा ईमेल",
        newEmail: "नवीन ईमेल पत्ता",
        newEmailPlaceholder: "नवीन ईमेल पत्ता प्रविष्ट करा",
        saveEmail: "ईमेल अपडेट करा",
        passwordSection: "पासवर्ड बदला",
        passwordDesc: "तुमचा खात्याचा पासवर्ड अपडेट करा",
        currentPassword: "सध्याचा पासवर्ड",
        currentPasswordPlaceholder: "सध्याचा पासवर्ड प्रविष्ट करा",
        newPassword: "नवीन पासवर्ड",
        newPasswordPlaceholder: "नवीन पासवर्ड प्रविष्ट करा",
        confirmPassword: "नवीन पासवर्डची पुष्टी करा",
        confirmPasswordPlaceholder: "नवीन पासवर्ड पुन्हा प्रविष्ट करा",
        savePassword: "पासवर्ड अपडेट करा",
        privacySection: "गोपनीयता सेटिंग्ज",
        privacyToggleLabel: "अहवाल विश्लेषणासाठी माझ्या वैयक्तिक वैद्यकीय स्थितींचा वापर करू नका",
        privacyToggleDesc: "सक्षम केल्यावर, AI तुमच्या सेव्ह केलेल्या वैद्यकीय इतिहासाचा किंवा वैयक्तिक आरोग्य स्थितींचा संदर्भ न घेता तुमच्या अहवालांचे विश्लेषण करेल.",
        disclaimerSection: "डेटा गोपनीयता आणि सुरक्षा",
        disclaimerItems: [
            { icon: "shield", title: "एंड-टू-एंड एन्क्रिप्शन", desc: "तुमचा सर्व वैयक्तिक डेटा आणि वैद्यकीय अहवाल उद्योग-मानक AES-256 एन्क्रिप्शन वापरून एन्क्रिप्ट केले आहेत." },
            { icon: "database", title: "डेटा वापर धोरण", desc: "तुमचा वैयक्तिक वैद्यकीय डेटा केवळ या अनुप्रयोगामध्ये अहवाल विश्लेषण तयार करण्यासाठी वापरला जातो." },
            { icon: "file", title: "केवळ अहवाल विश्लेषण", desc: "तुमची आरोग्य माहिती केवळ सक्रिय अहवाल विश्लेषण सत्रांदरम्यान ऍक्सेस केली जाते." },
            { icon: "check", title: "तुमचे नियंत्रण", desc: "तुमच्या डेटावर तुमचे पूर्ण नियंत्रण आहे. तुम्ही कधीही तुमचे खाते आणि सर्व संबंधित डेटा हटवू शकता." },
        ],
    },

    ta: {
        pageTitle: "அமைப்புகள்",
        pageSubtitle: "உங்கள் கணக்கு விருப்பங்களையும் தனியுரிமையையும் நிர்வகிக்கவும்",
        emailSection: "மின்னஞ்சலை மாற்று",
        emailDesc: "உங்கள் கணக்கு மின்னஞ்சல் முகவரியைப் புதுப்பிக்கவும்",
        currentEmail: "தற்போதைய மின்னஞ்சல்",
        newEmail: "புதிய மின்னஞ்சல் முகவரி",
        newEmailPlaceholder: "புதிய மின்னஞ்சல் முகவரியை உள்ளிடவும்",
        saveEmail: "மின்னஞ்சலைப் புதுப்பிக்க",
        passwordSection: "கடவுச்சொல்லை மாற்று",
        passwordDesc: "உங்கள் கணக்கு கடவுச்சொல்லைப் புதுப்பிக்கவும்",
        currentPassword: "தற்போதைய கடவுச்சொல்",
        currentPasswordPlaceholder: "தற்போதைய கடவுச்சொல்லை உள்ளிடவும்",
        newPassword: "புதிய கடவுச்சொல்",
        newPasswordPlaceholder: "புதிய கடவுச்சொல்லை உள்ளிடவும்",
        confirmPassword: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        confirmPasswordPlaceholder: "புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",
        savePassword: "கடவுச்சொல்லைப் புதுப்பிக்க",
        privacySection: "தனியுரிமை அமைப்புகள்",
        privacyToggleLabel: "அறிக்கை பகுப்பாய்வுக்கு எனது தனிப்பட்ட மருத்துவ நிலைகளைப் பயன்படுத்த வேண்டாம்",
        privacyToggleDesc: "இயக்கப்பட்டால், AI உங்கள் சேமிக்கப்பட்ட மருத்துவ வரலாறு அல்லது தனிப்பட்ட சுகாதார நிலைகளைப் பற்றி குறிப்பிடாமல் உங்கள் அறிக்கைகளை பகுப்பாய்வு செய்யும்.",
        disclaimerSection: "தரவு தனியுரிமை & பாதுகாப்பு",
        disclaimerItems: [
            { icon: "shield", title: "எண்ட்-டு-எண்ட் என்க்ரிப்ஷன்", desc: "உங்கள் அனைத்து தனிப்பட்ட தரவு மற்றும் மருத்துவ அறிக்கைகள் தொழில்துறை தரமான AES-256 என்க்ரிப்ஷன் மூலம் மறைகுறியாக்கம் செய்யப்பட்டுள்ளன." },
            { icon: "database", title: "தரவு பயன்பாட்டு கொள்கை", desc: "உங்கள் தனிப்பட்ட மருத்துவ தரவு இந்த பயன்பாட்டிற்குள் அறிக்கை பகுப்பாய்வை உருவாக்குவதற்கு மட்டுமே பயன்படுத்தப்படுகிறது." },
            { icon: "file", title: "அறிக்கை பகுப்பாய்வு மட்டுமே", desc: "உங்கள் சுகாதார தகவல்கள் செயலில் உள்ள அறிக்கை பகுப்பாய்வு அமர்வுகளின் போது மட்டுமே அணுகப்படும்." },
            { icon: "check", title: "உங்கள் கட்டுப்பாடு", desc: "உங்கள் தரவின் மீது உங்களுக்கு முழு கட்டுப்பாடு உள்ளது. நீங்கள் எந்த நேரத்திலும் உங்கள் கணக்கையும் அதனுடன் தொடர்புடைய அனைத்து தரவையும் நீக்கலாம்." },
        ],
    },

    te: {
        pageTitle: "సెట్టింగ్‌లు",
        pageSubtitle: "మీ ఖాతా ప్రాధాన్యతలు మరియు గోప్యతను నిర్వహించండి",
        emailSection: "ఇమెయిల్ మార్చండి",
        emailDesc: "మీ ఖాతా ఇమెయిల్ చిరునామాను నవీకరించండి",
        currentEmail: "ప్రస్తుత ఇమెయిల్",
        newEmail: "కొత్త ఇమెయిల్ చిరునామా",
        newEmailPlaceholder: "కొత్త ఇమెయిల్ చిరునామా నమోదు చేయండి",
        saveEmail: "ఇమెయిల్ నవీకరించండి",
        passwordSection: "పాస్‌వర్డ్ మార్చండి",
        passwordDesc: "మీ ఖాతా పాస్‌వర్డ్‌ను నవీకరించండి",
        currentPassword: "ప్రస్తుత పాస్‌వర్డ్",
        currentPasswordPlaceholder: "ప్రస్తుత పాస్‌వర్డ్ నమోదు చేయండి",
        newPassword: "కొత్త పాస్‌వర్డ్",
        newPasswordPlaceholder: "కొత్త పాస్‌వర్డ్ నమోదు చేయండి",
        confirmPassword: "కొత్త పాస్‌వర్డ్ నిర్ధారించండి",
        confirmPasswordPlaceholder: "కొత్త పాస్‌వర్డ్ మళ్ళీ నమోదు చేయండి",
        savePassword: "పాస్‌వర్డ్ నవీకరించండి",
        privacySection: "గోప్యతా సెట్టింగ్‌లు",
        privacyToggleLabel: "నివేదిక విశ్లేషణ కోసం నా వ్యక్తిగత వైద్య పరిస్థితులను ఉపయోగించవద్దు",
        privacyToggleDesc: "ప్రారంభించినప్పుడు, AI మీ సేవ్ చేసిన వైద్య చరిత్ర లేదా వ్యక్తిగత ఆరోగ్య పరిస్థితులను సూచించకుండా మీ నివేదికలను విశ్లేషిస్తుంది.",
        disclaimerSection: "డేటా గోప్యత & భద్రత",
        disclaimerItems: [
            { icon: "shield", title: "ఎండ్-టు-ఎండ్ ఎన్‌క్రిప్షన్", desc: "మీ అన్ని వ్యక్తిగత డేటా మరియు వైద్య నివేదికలు పరిశ్రమ ప్రమాణ AES-256 ఎన్‌క్రిప్షన్ ఉపయోగించి ఎన్‌క్రిప్ట్ చేయబడ్డాయి." },
            { icon: "database", title: "డేటా వినియోగ విధానం", desc: "మీ వ్యక్తిగత వైద్య డేటా ఈ అప్లికేషన్‌లో నివేదిక విశ్లేషణను రూపొందించడానికి మాత్రమే ఉపయోగించబడుతుంది." },
            { icon: "file", title: "నివేదిక విశ్లేషణ మాత్రమే", desc: "మీ ఆరోగ్య సమాచారం యాక్టివ్ నివేదిక విశ్లేషణ సెషన్‌ల సమయంలో మాత్రమే యాక్సెస్ చేయబడుతుంది." },
            { icon: "check", title: "మీ నియంత్రణ", desc: "మీ డేటాపై మీకు పూర్తి నియంత్రణ ఉంది. మీరు ఎప్పుడైనా మీ ఖాతాను మరియు అనుబంధ డేటాను తొలగించవచ్చు." },
        ],
    },

    bn: {
        pageTitle: "সেটিংস",
        pageSubtitle: "আপনার অ্যাকাউন্ট পছন্দ এবং গোপনীয়তা পরিচালনা করুন",
        emailSection: "ইমেল পরিবর্তন করুন",
        emailDesc: "আপনার অ্যাকাউন্ট ইমেল ঠিকানা আপডেট করুন",
        currentEmail: "বর্তমান ইমেল",
        newEmail: "নতুন ইমেল ঠিকানা",
        newEmailPlaceholder: "নতুন ইমেল ঠিকানা লিখুন",
        saveEmail: "ইমেল আপডেট করুন",
        passwordSection: "পাসওয়ার্ড পরিবর্তন করুন",
        passwordDesc: "আপনার অ্যাকাউন্ট পাসওয়ার্ড আপডেট করুন",
        currentPassword: "বর্তমান পাসওয়ার্ড",
        currentPasswordPlaceholder: "বর্তমান পাসওয়ার্ড লিখুন",
        newPassword: "নতুন পাসওয়ার্ড",
        newPasswordPlaceholder: "নতুন পাসওয়ার্ড লিখুন",
        confirmPassword: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
        confirmPasswordPlaceholder: "নতুন পাসওয়ার্ড আবার লিখুন",
        savePassword: "পাসওয়ার্ড আপডেট করুন",
        privacySection: "গোপনীয়তা সেটিংস",
        privacyToggleLabel: "প্রতিবেদন বিশ্লেষণের জন্য আমার ব্যক্তিগত চিকিৎসা অবস্থা ব্যবহার করবেন না",
        privacyToggleDesc: "সক্রিয় থাকলে, AI আপনার সংরক্ষিত চিকিৎসা ইতিহাস বা ব্যক্তিগত স্বাস্থ্য অবস্থার উল্লেখ ছাড়াই আপনার প্রতিবেদন বিশ্লেষণ করবে।",
        disclaimerSection: "ডেটা গোপনীয়তা ও নিরাপত্তা",
        disclaimerItems: [
            { icon: "shield", title: "এন্ড-টু-এন্ড এনক্রিপশন", desc: "আপনার সমস্ত ব্যক্তিগত ডেটা এবং চিকিৎসা প্রতিবেদন শিল্প-মানক AES-256 এনক্রিপশন ব্যবহার করে এনক্রিপ্ট করা হয়েছে।" },
            { icon: "database", title: "ডেটা ব্যবহার নীতি", desc: "আপনার ব্যক্তিগত চিকিৎসা ডেটা শুধুমাত্র এই অ্যাপ্লিকেশনের মধ্যে প্রতিবেদন বিশ্লেষণ তৈরির জন্য ব্যবহৃত হয়।" },
            { icon: "file", title: "শুধুমাত্র প্রতিবেদন বিশ্লেষণ", desc: "আপনার স্বাস্থ্য তথ্য শুধুমাত্র সক্রিয় প্রতিবেদন বিশ্লেষণ সেশনের সময় অ্যাক্সেস করা হয়।" },
            { icon: "check", title: "আপনার নিয়ন্ত্রণ", desc: "আপনার ডেটার উপর আপনার সম্পূর্ণ নিয়ন্ত্রণ রয়েছে। আপনি যেকোনো সময় আপনার অ্যাকাউন্ট এবং সমস্ত সংশ্লিষ্ট ডেটা মুছে ফেলতে পারেন।" },
        ],
    },

    gu: {
        pageTitle: "સેટિંગ્સ",
        pageSubtitle: "તમારા ખાતાની પસંદગીઓ અને ગોપનીયતા સંચાલિત કરો",
        emailSection: "ઈમેલ બદલો",
        emailDesc: "તમારા ખાતાનું ઈમેલ સરનામું અપડેટ કરો",
        currentEmail: "વર્તમાન ઈમેલ",
        newEmail: "નવું ઈમેલ સરનામું",
        newEmailPlaceholder: "નવું ઈમેલ સરનામું દાખલ કરો",
        saveEmail: "ઈમેલ અપડેટ કરો",
        passwordSection: "પાસવર્ડ બદલો",
        passwordDesc: "તમારા ખાતાનો પાસવર્ડ અપડેટ કરો",
        currentPassword: "વર્તમાન પાસવર્ડ",
        currentPasswordPlaceholder: "વર્તમાન પાસવર્ડ દાખલ કરો",
        newPassword: "નવો પાસવર્ડ",
        newPasswordPlaceholder: "નવો પાસવર્ડ દાખલ કરો",
        confirmPassword: "નવો પાસવર્ડ પુષ્ટિ કરો",
        confirmPasswordPlaceholder: "નવો પાસવર્ડ ફરીથી દાખલ કરો",
        savePassword: "પાસવર્ડ અપડેટ કરો",
        privacySection: "ગોપનીયતા સેટિંગ્સ",
        privacyToggleLabel: "રિપોર્ટ વિશ્લેષણ માટે મારી વ્યક્તિગત તબીબી સ્થિતિઓનો ઉપયોગ કરશો નહીં",
        privacyToggleDesc: "સક્ષમ કરવામાં આવે ત્યારે, AI તમારા સાચવેલા તબીબી ઇતિહાસ અથવા વ્યક્તિગત આરોગ્ય સ્થિતિઓનો સંદર્ભ લીધા વિના તમારા અહેવાલોનું વિશ્લેષણ કરશે.",
        disclaimerSection: "ડેટા ગોપનીયતા અને સુરક્ષા",
        disclaimerItems: [
            { icon: "shield", title: "એન્ડ-ટુ-એન્ડ એન્ક્રિપ્શન", desc: "તમારા તમામ વ્યક્તિગત ડેટા અને તબીબી અહેવાલો ઉદ્યોગ-માનક AES-256 એન્ક્રિપ્શનનો ઉપયોગ કરીને એન્ક્રિપ્ટ કરવામાં આવે છે." },
            { icon: "database", title: "ડેટા ઉપયોગ નીતિ", desc: "તમારો વ્યક્તિગત તબીબી ડેટા ફક્ત આ એપ્લિકેશનમાં રિપોર્ટ વિશ્લેષણ ઉત્પન્ન કરવા માટે ઉપયોગમાં લેવાય છે." },
            { icon: "file", title: "ફક્ત રિપોર્ટ વિશ્લેષણ", desc: "તમારી આરોગ્ય માહિતી ફક્ત સક્રિય રિપોર્ટ વિશ્લેષણ સત્રો દરમિયાન ઍક્સેસ કરવામાં આવે છે." },
            { icon: "check", title: "તમારું નિયંત્રણ", desc: "તમારા ડેટા પર તમારું સંપૂર્ણ નિયંત્રણ છે. તમે ક​​​​ોઈપણ સમયે તમારું ખાતું અને સંબંધિત ડેટા કાઢી શકો છો." },
        ],
    },

    kn: {
        pageTitle: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        pageSubtitle: "ನಿಮ್ಮ ಖಾತೆಯ ಆದ್ಯತೆಗಳು ಮತ್ತು ಗೌಪ್ಯತೆಯನ್ನು ನಿರ್ವಹಿಸಿ",
        emailSection: "ಇಮೇಲ್ ಬದಲಾಯಿಸಿ",
        emailDesc: "ನಿಮ್ಮ ಖಾತೆ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನವೀಕರಿಸಿ",
        currentEmail: "ಪ್ರ�್ತುತ ಇಮೇಲ್",
        newEmail: "ಹೊಸ ಇಮೇಲ್ ವಿಳಾಸ",
        newEmailPlaceholder: "ಹೊಸ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ",
        saveEmail: "ಇಮೇಲ್ ನವೀಕರಿಸಿ",
        passwordSection: "ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ",
        passwordDesc: "ನಿಮ್ಮ ಖಾತೆಯ ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ",
        currentPassword: "ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್",
        currentPasswordPlaceholder: "ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
        newPassword: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್",
        newPasswordPlaceholder: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
        confirmPassword: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
        confirmPasswordPlaceholder: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತೊಮ್ಮೆ ನಮೂದಿಸಿ",
        savePassword: "ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ",
        privacySection: "ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        privacyToggleLabel: "ವರದಿ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನನ್ನ ವೈಯಕ್ತಿಕ ವೈದ್ಯಕೀಯ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಬಳಸಬೇಡಿ",
        privacyToggleDesc: "ಸಕ್ರಿಯಗೊಳಿಸಿದಾಗ, AI ನಿಮ್ಮ ಉಳಿಸಿದ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ ಅಥವಾ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಉಲ್ಲೇಖಿಸದೆ ನಿಮ್ಮ ವರದಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.",
        disclaimerSection: "ಡೇಟಾ ಗೌಪ್ಯತೆ & ಭದ್ರತೆ",
        disclaimerItems: [
            { icon: "shield", title: "ಎಂಡ್-ಟು-ಎಂಡ್ ಎನ್‌ಕ್ರಿಪ್ಷನ್", desc: "ನಿಮ್ಮ ಎಲ್ಲಾ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಮತ್ತು ವೈದ್ಯಕೀಯ ವರದಿಗಳು ಉದ್ಯಮ ಮಾನಕ AES-256 ಎನ್‌ಕ್ರಿಪ್ಷನ್ ಬಳಸಿ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆಗಿವೆ." },
            { icon: "database", title: "ಡೇಟಾ ಬಳಕೆ ನೀತಿ", desc: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವೈದ್ಯಕೀಯ ಡೇಟಾ ಈ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ವರದಿ ವಿಶ್ಲೇಷಣೆ ಉತ್ಪಾದಿಸಲು ಮಾತ್ರ ಬಳಸಲ್ಪಡುತ್ತದೆ." },
            { icon: "file", title: "ವರದಿ ವಿಶ್ಲೇಷಣೆ ಮಾತ್ರ", desc: "ನಿಮ್ಮ ಆರೋಗ್ಯ ಮಾಹಿತಿ ಸಕ್ರಿಯ ವರದಿ ವಿಶ್ಲೇಷಣೆ ಸೆಷನ್‌ಗಳ ಸಮಯದಲ್ಲಿ ಮಾತ್ರ ಪ್ರವೇಶಿಸಲ್ಪಡುತ್ತದೆ." },
            { icon: "check", title: "ನಿಮ್ಮ ನಿಯಂತ್ರಣ", desc: "ನಿಮ್ಮ ಡೇಟಾ ಮೇಲೆ ನಿಮಗೆ ಸಂಪೂರ್ಣ ನಿಯಂತ್ರಣ ಇದೆ. ನೀವು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಎಲ್ಲಾ ಸಂಬಂಧಿತ ಡೇಟಾವನ್ನು ಅಳಿಸಬಹುದು." },
        ],
    },
};

/* =========================
   COMPONENT
========================= */

const SettingsPage = () => {
    const { currentLang } = useLanguage();
    const { user } = useAuth();
    const t = settingsTranslations[currentLang] || settingsTranslations.en;

    // Local form states (frontend only)
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [privacyOptOut, setPrivacyOptOut] = useState(() => {
        return localStorage.getItem("vaidyaai_privacy_optout") === "true";
    });

    // Status and loading states
    const [emailStatus, setEmailStatus] = useState("");
    const [passwordStatus, setPasswordStatus] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const API_URL = "http://localhost:5000/api/auth";

    // Handler for changing email
    const handleChangeEmail = async (e) => {
        e.preventDefault();
        setEmailStatus("");
        setEmailLoading(true);
        try {
            const response = await axios.put(`${API_URL}/change-email`, {
                newEmail,
                password: currentPassword
            });
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                setEmailStatus("Email updated successfully.");
                setNewEmail("");
            } else {
                setEmailStatus(response.data.message || "Failed to update email.");
            }
        } catch (error) {
            setEmailStatus(error.response?.data?.message || "Failed to update email.");
        }
        setEmailLoading(false);
    };

    // Handler for changing password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordStatus("");
        setPasswordLoading(true);
        if (newPassword !== confirmPassword) {
            setPasswordStatus("New password and confirmation do not match.");
            setPasswordLoading(false);
            return;
        }
        try {
            const response = await axios.put(`${API_URL}/change-password`, {
                currentPassword,
                newPassword
            });
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                setPasswordStatus("Password updated successfully.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPasswordStatus(response.data.message || "Failed to update password.");
            }
        } catch (error) {
            setPasswordStatus(error.response?.data?.message || "Failed to update password.");
        }
        setPasswordLoading(false);
    };

    const handlePrivacyToggle = () => {
        const newValue = !privacyOptOut;
        setPrivacyOptOut(newValue);
        localStorage.setItem("vaidyaai_privacy_optout", String(newValue));
    };

    const getDisclaimerIcon = (iconName) => {
        switch (iconName) {
            case "shield": return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
            case "database": return <Database className="w-6 h-6 text-blue-600" />;
            case "file": return <FileText className="w-6 h-6 text-purple-600" />;
            case "check": return <CheckCircle className="w-6 h-6 text-teal-600" />;
            default: return <Info className="w-6 h-6 text-gray-600" />;
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Page Header */}
            <div>
                <h1
                    className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent"
                    style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                >
                    {t.pageTitle}
                </h1>
                <p className="text-gray-600 mt-2">{t.pageSubtitle}</p>
            </div>

            {/* Change Email Section */}
                <form onSubmit={handleChangeEmail} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "Crimson Text, serif" }}>
                            <Mail className="w-6 h-6" />
                            {t.emailSection}
                        </h2>
                        <p className="text-emerald-50 text-sm mt-1">{t.emailDesc}</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.currentEmail}</label>
                            <div className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 text-gray-600">
                                {user?.email || "user@example.com"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.newEmail}</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder={t.newEmailPlaceholder}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.currentPassword}</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder={t.currentPasswordPlaceholder}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-300"
                            />
                        </div>
                        <button type="submit" disabled={emailLoading} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            {emailLoading ? "Updating..." : t.saveEmail}
                        </button>
                        {emailStatus && <div className="mt-2 text-sm text-emerald-700">{emailStatus}</div>}
                    </div>
                </form>

            {/* Change Password Section */}
                <form onSubmit={handleChangePassword} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "Crimson Text, serif" }}>
                            <Lock className="w-6 h-6" />
                            {t.passwordSection}
                        </h2>
                        <p className="text-purple-50 text-sm mt-1">{t.passwordDesc}</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.currentPassword}</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder={t.currentPasswordPlaceholder}
                                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.newPassword}</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder={t.newPasswordPlaceholder}
                                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.confirmPassword}</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t.confirmPasswordPlaceholder}
                                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={passwordLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            {passwordLoading ? "Updating..." : t.savePassword}
                        </button>
                        {passwordStatus && <div className="mt-2 text-sm text-purple-700">{passwordStatus}</div>}
                    </div>
                </form>

            {/* Privacy Toggle Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "Crimson Text, serif" }}>
                        <Shield className="w-6 h-6" />
                        {t.privacySection}
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-lg">{t.privacyToggleLabel}</p>
                            <p className="text-gray-500 text-sm mt-2 leading-relaxed">{t.privacyToggleDesc}</p>
                        </div>
                        <button
                            onClick={handlePrivacyToggle}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 flex-shrink-0 mt-1 ${privacyOptOut ? "bg-emerald-500" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${privacyOptOut ? "translate-x-7" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Data Privacy Disclaimer Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-teal-100 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "Crimson Text, serif" }}>
                        <Info className="w-6 h-6" />
                        {t.disclaimerSection}
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    {t.disclaimerItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-teal-50/30 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                {getDisclaimerIcon(item.icon)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
        </div>
    );
};

export default SettingsPage;
