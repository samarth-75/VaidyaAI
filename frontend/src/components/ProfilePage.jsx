import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Camera,
    Save,
    ArrowLeft,
    Heart,
    Calendar,
    MapPin,
    Phone,
    Mail,
    AlertCircle,
    CheckCircle,
    Edit3,
    Droplet,
    Activity,
    Pill,
    Scale,
    Ruler,
    Languages
} from 'lucide-react';

// Multilingual translations for Profile page
const translations = {
    en: {
        title: "My Health Profile",
        subtitle: "Manage your personal health information",
        personalInfo: "Personal Information",
        healthInfo: "Health Information",
        saveProfile: "Save Profile",
        saving: "Saving...",
        saved: "Profile Saved!",
        back: "Back to Dashboard",
        uploadPhoto: "Upload Photo",
        changePhoto: "Change Photo",
        fields: {
            fullName: "Full Name",
            dateOfBirth: "Date of Birth",
            gender: "Gender",
            phone: "Phone Number",
            email: "Email Address",
            address: "Address",
            bloodGroup: "Blood Group",
            height: "Height (cm)",
            weight: "Weight (kg)",
            allergies: "Known Allergies",
            medications: "Current Medications",
            conditions: "Medical Conditions",
            emergencyContact: "Emergency Contact",
            emergencyPhone: "Emergency Phone"
        },
        placeholders: {
            fullName: "Enter your full name",
            phone: "+91 XXXXX XXXXX",
            email: "your.email@example.com",
            address: "Enter your address",
            allergies: "E.g., Penicillin, Peanuts, Dust",
            medications: "E.g., Metformin 500mg, Aspirin 75mg",
            conditions: "E.g., Diabetes Type 2, Hypertension",
            emergencyContact: "Emergency contact name",
            emergencyPhone: "+91 XXXXX XXXXX"
        },
        genderOptions: {
            male: "Male",
            female: "Female",
            other: "Other",
            preferNotToSay: "Prefer not to say"
        },
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
        disclaimer: "This information is stored locally on your device. It is not a medical record."
    },
    hi: {
        title: "मेरा स्वास्थ्य प्रोफ़ाइल",
        subtitle: "अपनी व्यक्तिगत स्वास्थ्य जानकारी प्रबंधित करें",
        personalInfo: "व्यक्तिगत जानकारी",
        healthInfo: "स्वास्थ्य जानकारी",
        saveProfile: "प्रोफ़ाइल सहेजें",
        saving: "सहेज रहा है...",
        saved: "प्रोफ़ाइल सहेजा गया!",
        back: "डैशबोर्ड पर वापस जाएं",
        uploadPhoto: "फोटो अपलोड करें",
        changePhoto: "फोटो बदलें",
        fields: {
            fullName: "पूरा नाम",
            dateOfBirth: "जन्म तिथि",
            gender: "लिंग",
            phone: "फोन नंबर",
            email: "ईमेल पता",
            address: "पता",
            bloodGroup: "रक्त समूह",
            height: "ऊंचाई (सेमी)",
            weight: "वजन (किलो)",
            allergies: "ज्ञात एलर्जी",
            medications: "वर्तमान दवाइयां",
            conditions: "चिकित्सा स्थितियां",
            emergencyContact: "आपातकालीन संपर्क",
            emergencyPhone: "आपातकालीन फोन"
        },
        placeholders: {
            fullName: "अपना पूरा नाम दर्ज करें",
            phone: "+91 XXXXX XXXXX",
            email: "your.email@example.com",
            address: "अपना पता दर्ज करें",
            allergies: "जैसे, पेनिसिलिन, मूंगफली, धूल",
            medications: "जैसे, मेटफॉर्मिन 500mg, एस्पिरिन 75mg",
            conditions: "जैसे, टाइप 2 मधुमेह, उच्च रक्तचाप",
            emergencyContact: "आपातकालीन संपर्क नाम",
            emergencyPhone: "+91 XXXXX XXXXX"
        },
        genderOptions: {
            male: "पुरुष",
            female: "महिला",
            other: "अन्य",
            preferNotToSay: "नहीं बताना चाहते"
        },
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "अज्ञात"],
        disclaimer: "यह जानकारी आपके डिवाइस पर स्थानीय रूप से संग्रहीत है। यह चिकित्सा रिकॉर्ड नहीं है।"
    },
    mr: {
        title: "माझी आरोग्य प्रोफाइल",
        subtitle: "तुमची वैयक्तिक आरोग्य माहिती व्यवस्थापित करा",
        personalInfo: "वैयक्तिक माहिती",
        healthInfo: "आरोग्य माहिती",
        saveProfile: "प्रोफाइल जतन करा",
        saving: "जतन करत आहे...",
        saved: "प्रोफाइल जतन केली!",
        back: "डॅशबोर्डवर परत जा",
        uploadPhoto: "फोटो अपलोड करा",
        changePhoto: "फोटो बदला",
        fields: {
            fullName: "पूर्ण नाव",
            dateOfBirth: "जन्मतारीख",
            gender: "लिंग",
            phone: "फोन नंबर",
            email: "ईमेल पत्ता",
            address: "पत्ता",
            bloodGroup: "रक्तगट",
            height: "उंची (सेमी)",
            weight: "वजन (किलो)",
            allergies: "ज्ञात ऍलर्जी",
            medications: "सध्याची औषधे",
            conditions: "वैद्यकीय स्थिती",
            emergencyContact: "आपत्कालीन संपर्क",
            emergencyPhone: "आपत्कालीन फोन"
        },
        placeholders: {
            fullName: "तुमचे पूर्ण नाव प्रविष्ट करा",
            phone: "+91 XXXXX XXXXX",
            email: "your.email@example.com",
            address: "तुमचा पत्ता प्रविष्ट करा",
            allergies: "उदा., पेनिसिलिन, शेंगदाणे, धूळ",
            medications: "उदा., मेटफॉर्मिन 500mg, ऍस्पिरिन 75mg",
            conditions: "उदा., टाइप 2 मधुमेह, उच्च रक्तदाब",
            emergencyContact: "आपत्कालीन संपर्क नाव",
            emergencyPhone: "+91 XXXXX XXXXX"
        },
        genderOptions: {
            male: "पुरुष",
            female: "स्त्री",
            other: "इतर",
            preferNotToSay: "सांगायचे नाही"
        },
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "अज्ञात"],
        disclaimer: "ही माहिती तुमच्या डिव्हाइसवर स्थानिक पद्धतीने संग्रहित आहे. हे वैद्यकीय रेकॉर्ड नाही."
    },
    ta: {
        title: "எனது சுகாதார விவரம்",
        subtitle: "உங்கள் தனிப்பட்ட சுகாதார தகவலை நிர்வகிக்கவும்",
        personalInfo: "தனிப்பட்ட தகவல்",
        healthInfo: "சுகாதார தகவல்",
        saveProfile: "விவரத்தை சேமி",
        saving: "சேமிக்கிறது...",
        saved: "விவரம் சேமிக்கப்பட்டது!",
        back: "டாஷ்போர்டுக்கு திரும்ப",
        uploadPhoto: "புகைப்படம் பதிவேற்று",
        changePhoto: "புகைப்படம் மாற்று",
        fields: {
            fullName: "முழு பெயர்",
            dateOfBirth: "பிறந்த தேதி",
            gender: "பாலினம்",
            phone: "தொலைபேசி எண்",
            email: "மின்னஞ்சல் முகவரி",
            address: "முகவரி",
            bloodGroup: "இரத்த வகை",
            height: "உயரம் (செமீ)",
            weight: "எடை (கிலோ)",
            allergies: "அறியப்பட்ட ஒவ்வாமைகள்",
            medications: "தற்போதைய மருந்துகள்",
            conditions: "மருத்துவ நிலைகள்",
            emergencyContact: "அவசர தொடர்பு",
            emergencyPhone: "அவசர தொலைபேசி"
        },
        placeholders: {
            fullName: "உங்கள் முழு பெயரை உள்ளிடவும்",
            phone: "+91 XXXXX XXXXX",
            email: "your.email@example.com",
            address: "உங்கள் முகவரியை உள்ளிடவும்",
            allergies: "எ.கா., பெனிசிலின், நிலக்கடலை, தூசி",
            medications: "எ.கா., மெட்ஃபார்மின் 500mg, ஆஸ்பிரின் 75mg",
            conditions: "எ.கா., வகை 2 நீரிழிவு, உயர் இரத்த அழுத்தம்",
            emergencyContact: "அவசர தொடர்பு பெயர்",
            emergencyPhone: "+91 XXXXX XXXXX"
        },
        genderOptions: {
            male: "ஆண்",
            female: "பெண்",
            other: "மற்றவை",
            preferNotToSay: "சொல்ல விரும்பவில்லை"
        },
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "தெரியாது"],
        disclaimer: "இந்த தகவல் உங்கள் சாதனத்தில் உள்ளூரில் சேமிக்கப்படுகிறது. இது மருத்துவ பதிவு அல்ல."
    },
    te: {
        title: "నా ఆరోగ్య ప్రొఫైల్",
        subtitle: "మీ వ్యక్తిగత ఆరోగ్య సమాచారాన్ని నిర్వహించండి",
        personalInfo: "వ్యక్తిగత సమాచారం",
        healthInfo: "ఆరోగ్య సమాచారం",
        saveProfile: "ప్రొఫైల్ సేవ్ చేయి",
        saving: "సేవ్ అవుతోంది...",
        saved: "ప్రొఫైల్ సేవ్ అయింది!",
        back: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు",
        uploadPhoto: "ఫోటో అప్‌లోడ్ చేయి",
        changePhoto: "ఫోటో మార్చు",
        fields: {
            fullName: "పూర్తి పేరు",
            dateOfBirth: "పుట్టిన తేదీ",
            gender: "లింగం",
            phone: "ఫోన్ నంబర్",
            email: "ఇమెయిల్ చిరునామా",
            address: "చిరునామా",
            bloodGroup: "రక్త వర్గం",
            height: "ఎత్తు (సెంమీ)",
            weight: "బరువు (కిలో)",
            allergies: "తెలిసిన అలర్జీలు",
            medications: "ప్రస్తుత మందులు",
            conditions: "వైద్య పరిస్థితులు",
            emergencyContact: "అత్యవసర సంప్రదింపు",
            emergencyPhone: "అత్యవసర ఫోన్"
        },
        placeholders: {
            fullName: "మీ పూర్తి పేరు నమోదు చేయండి",
            phone: "+91 XXXXX XXXXX",
            email: "your.email@example.com",
            address: "మీ చిరునామా నమోదు చేయండి",
            allergies: "ఉదా., పెన్సిలిన్, వేరుశెనగలు, దుమ్ము",
            medications: "ఉదా., మెట్‌ఫార్మిన్ 500mg, ఆస్పిరిన్ 75mg",
            conditions: "ఉదా., టైప్ 2 మధుమేహం, అధిక రక్తపోటు",
            emergencyContact: "అత్యవసర సంప్రదింపు పేరు",
            emergencyPhone: "+91 XXXXX XXXXX"
        },
        genderOptions: {
            male: "పురుషుడు",
            female: "స్త్రీ",
            other: "ఇతర",
            preferNotToSay: "చెప్పడం ఇష్టం లేదు"
        },
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "తెలియదు"],
        disclaimer: "ఈ సమాచారం మీ పరికరంలో స్థానికంగా నిల్వ చేయబడుతుంది. ఇది వైద్య రికార్డు కాదు."
    },
    bn: {
        title: "আমার স্বাস্থ্য প্রোফাইল",
        subtitle: "আপনার ব্যক্তিগত স্বাস্থ্য তথ্য পরিচালনা করুন",
        personalInfo: "ব্যক্তিগত তথ্য",
        healthInfo: "স্বাস্থ্য তথ্য",
        saveProfile: "প্রোফাইল সংরক্ষণ করুন",
        saving: "সংরক্ষণ হচ্ছে...",
        saved: "প্রোফাইল সংরক্ষিত!",
        back: "ড্যাশবোর্ডে ফিরে যান",
        uploadPhoto: "ছবি আপলোড করুন",
        changePhoto: "ছবি পরিবর্তন করুন",
        fields: {
            fullName: "পুরো নাম",
            dateOfBirth: "জন্ম তারিখ",
            gender: "লিঙ্গ",
            phone: "ফোন নম্বর",
            email: "ইমেইল ঠিকানা",
            address: "ঠিকানা",
            bloodGroup: "রক্তের গ্রুপ",
            height: "উচ্চতা (সেমি)",
            weight: "ওজন (কেজি)",
            allergies: "পরিচিত অ্যালার্জি",
            medications: "বর্তমান ওষুধ",
            conditions: "চিকিৎসা অবস্থা",
            emergencyContact: "জরুরি যোগাযোগ",
            emergencyPhone: "জরুরি ফোন"
        },
        placeholders: {
            fullName: "আপনার পুরো নাম লিখুন",
            phone: "+91 XXXXX XXXXX",
            email: "your.email@example.com",
            address: "আপনার ঠিকানা লিখুন",
            allergies: "যেমন, পেনিসিলিন, চিনাবাদাম, ধুলো",
            medications: "যেমন, মেটফর্মিন 500mg, অ্যাসপিরিন 75mg",
            conditions: "যেমন, টাইপ 2 ডায়াবেটিস, উচ্চ রক্তচাপ",
            emergencyContact: "জরুরি যোগাযোগের নাম",
            emergencyPhone: "+91 XXXXX XXXXX"
        },
        genderOptions: {
            male: "পুরুষ",
            female: "মহিলা",
            other: "অন্যান্য",
            preferNotToSay: "বলতে চাই না"
        },
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "অজানা"],
        disclaimer: "এই তথ্য আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত। এটি চিকিৎসা রেকর্ড নয়।"
    },
    gu: {
        title: "મારી આરોગ્ય પ્રોફાઇલ",
        subtitle: "તમારી વ્યક્તિગત આરોગ્ય માહિતી સંચાલિત કરો",
        personalInfo: "વ્યક્તિગત માહિતી",
        healthInfo: "આરોગ્ય માહિતી",
        saveProfile: "પ્રોફાઇલ સાચવો",
        saving: "સાચવી રહ્યું છે...",
        saved: "પ્રોફાઇલ સાચવ્યું!",
        back: "ડેશબોર્ડ પર પાછા જાઓ",
        uploadPhoto: "ફોટો અપલોડ કરો",
        changePhoto: "ફોટો બદલો",
        fields: {
            fullName: "પૂરું નામ",
            dateOfBirth: "જન્મ તારીખ",
            gender: "જાતિ",
            phone: "ફોન નંબર",
            email: "ઇમેઇલ સરનામું",
            address: "સરનામું",
            bloodGroup: "બ્લડ ગ્રુપ",
            height: "ઊંચાઈ (સેમી)",
            weight: "વજન (કિલો)",
            allergies: "જાણીતી એલર્જી",
            medications: "વર્તમાન દવાઓ",
            conditions: "તબીબી સ્થિતિઓ",
            emergencyContact: "કટોકટી સંપર્ક",
            emergencyPhone: "કટોકટી ફોન"
        },
        placeholders: {
            fullName: "તમારું પૂરું નામ દાખલ કરો",
            phone: "+91 XXXXX XXXXX",
            email: "your.email@example.com",
            address: "તમારું સરનામું દાખલ કરો",
            allergies: "દા.ત., પેનિસિલિન, મગફળી, ધૂળ",
            medications: "દા.ત., મેટફોર્મિન 500mg, એસ્પિરિન 75mg",
            conditions: "દા.ત., ટાઇપ 2 ડાયાબિટીસ, હાઈ બ્લડ પ્રેશર",
            emergencyContact: "કટોકટી સંપર્ક નામ",
            emergencyPhone: "+91 XXXXX XXXXX"
        },
        genderOptions: {
            male: "પુરુષ",
            female: "સ્ત્રી",
            other: "અન્ય",
            preferNotToSay: "કહેવા માંગતા નથી"
        },
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "અજ્ઞાત"],
        disclaimer: "આ માહિતી તમારા ઉપકરણ પર સ્થાનિક રીતે સંગ્રહિત છે. આ તબીબી રેકોર્ડ નથી."
    },
    kn: {
        title: "ನನ್ನ ಆರೋಗ್ಯ ಪ್ರೊಫೈಲ್",
        subtitle: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ನಿರ್ವಹಿಸಿ",
        personalInfo: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
        healthInfo: "ಆರೋಗ್ಯ ಮಾಹಿತಿ",
        saveProfile: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ",
        saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
        saved: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಲಾಗಿದೆ!",
        back: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
        uploadPhoto: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        changePhoto: "ಫೋಟೋ ಬದಲಾಯಿಸಿ",
        fields: {
            fullName: "ಪೂರ್ಣ ಹೆಸರು",
            dateOfBirth: "ಹುಟ್ಟಿದ ದಿನಾಂಕ",
            gender: "ಲಿಂಗ",
            phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
            email: "ಇಮೇಲ್ ವಿಳಾಸ",
            address: "ವಿಳಾಸ",
            bloodGroup: "ರಕ್ತದ ಗುಂಪು",
            height: "ಎತ್ತರ (ಸೆಂಮೀ)",
            weight: "ತೂಕ (ಕೆಜಿ)",
            allergies: "ತಿಳಿದಿರುವ ಅಲರ್ಜಿಗಳು",
            medications: "ಪ್ರಸ್ತುತ ಔಷಧಿಗಳು",
            conditions: "ವೈದ್ಯಕೀಯ ಪರಿಸ್ಥಿತಿಗಳು",
            emergencyContact: "ತುರ್ತು ಸಂಪರ್ಕ",
            emergencyPhone: "ತುರ್ತು ಫೋನ್"
        },
        placeholders: {
            fullName: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
            phone: "+91 XXXXX XXXXX",
            email: "your.email@example.com",
            address: "ನಿಮ್ಮ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ",
            allergies: "ಉದಾ., ಪೆನಿಸಿಲಿನ್, ಕಡಲೆಕಾಯಿ, ಧೂಳು",
            medications: "ಉದಾ., ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg, ಆಸ್ಪಿರಿನ್ 75mg",
            conditions: "ಉದಾ., ಟೈಪ್ 2 ಮಧುಮೇಹ, ಅಧಿಕ ರಕ್ತದೊತ್ತಡ",
            emergencyContact: "ತುರ್ತು ಸಂಪರ್ಕ ಹೆಸರು",
            emergencyPhone: "+91 XXXXX XXXXX"
        },
        genderOptions: {
            male: "ಪುರುಷ",
            female: "ಮಹಿಳೆ",
            other: "ಇತರ",
            preferNotToSay: "ಹೇಳಲು ಇಷ್ಟವಿಲ್ಲ"
        },
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "ತಿಳಿದಿಲ್ಲ"],
        disclaimer: "ಈ ಮಾಹಿತಿಯನ್ನು ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ. ಇದು ವೈದ್ಯಕೀಯ ದಾಖಲೆ ಅಲ್ಲ."
    }
};

const STORAGE_KEY = 'vaidyaai_profile';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { currentLang } = useLanguage();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const t = translations[currentLang] || translations.en;

    // Profile state with default values
    const [profile, setProfile] = useState({
        photoUrl: '',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        email: user?.email || '',
        address: '',
        bloodGroup: '',
        height: '',
        weight: '',
        allergies: '',
        medications: '',
        conditions: '',
        emergencyContact: '',
        emergencyPhone: ''
    });

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load profile from localStorage on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem(STORAGE_KEY);
        if (savedProfile) {
            try {
                setProfile(JSON.parse(savedProfile));
            } catch (e) {
                console.error('Error loading profile:', e);
            }
        }
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
        setSaved(false);
    };

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({
                    ...prev,
                    photoUrl: reader.result
                }));
                setSaved(false);
            };
            reader.readAsDataURL(file);
        }
    };

    // Save profile to localStorage
    const handleSave = () => {
        setSaving(true);

        // Simulate save delay
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
            setSaving(false);
            setSaved(true);

            // Reset saved message after 3 seconds
            setTimeout(() => setSaved(false), 3000);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h2>
                    <p className="text-gray-600">{t.subtitle}</p>
                </div>

                {/* Profile Photo Section */}
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-emerald-100 mb-8">
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-emerald-100">
                                {profile.photoUrl ? (
                                    <img
                                        src={profile.photoUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-16 h-16 text-white" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                            {profile.photoUrl ? t.changePhoto : t.uploadPhoto}
                        </p>
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-emerald-100 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{t.personalInfo}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.fullName}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.fullName}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.dateOfBirth}</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={profile.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.gender}</label>
                            <select
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                            >
                                <option value="">-- Select --</option>
                                <option value="male">{t.genderOptions.male}</option>
                                <option value="female">{t.genderOptions.female}</option>
                                <option value="other">{t.genderOptions.other}</option>
                                <option value="preferNotToSay">{t.genderOptions.preferNotToSay}</option>
                            </select>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.phone}</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.phone}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.email}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.email}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.address}</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.address}
                                    rows={2}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Information Section */}
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-emerald-100 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                            <Heart className="w-5 h-5 text-rose-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{t.healthInfo}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.bloodGroup}</label>
                            <div className="relative">
                                <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="bloodGroup"
                                    value={profile.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none appearance-none"
                                >
                                    <option value="">-- Select --</option>
                                    {t.bloodGroups.map((bg, idx) => (
                                        <option key={idx} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Height */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.height}</label>
                            <div className="relative">
                                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="height"
                                    value={profile.height}
                                    onChange={handleChange}
                                    placeholder="170"
                                    min="50"
                                    max="250"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.weight}</label>
                            <div className="relative">
                                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="weight"
                                    value={profile.weight}
                                    onChange={handleChange}
                                    placeholder="70"
                                    min="20"
                                    max="300"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Allergies */}
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.allergies}</label>
                            <div className="relative">
                                <AlertCircle className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="allergies"
                                    value={profile.allergies}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.allergies}
                                    rows={2}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Current Medications */}
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.medications}</label>
                            <div className="relative">
                                <Pill className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="medications"
                                    value={profile.medications}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.medications}
                                    rows={2}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Medical Conditions */}
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.conditions}</label>
                            <div className="relative">
                                <Activity className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="conditions"
                                    value={profile.conditions}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.conditions}
                                    rows={2}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-rose-100 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Phone className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{t.fields.emergencyContact}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.emergencyContact}</label>
                            <input
                                type="text"
                                name="emergencyContact"
                                value={profile.emergencyContact}
                                onChange={handleChange}
                                placeholder={t.placeholders.emergencyContact}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.emergencyPhone}</label>
                            <input
                                type="tel"
                                name="emergencyPhone"
                                value={profile.emergencyPhone}
                                onChange={handleChange}
                                placeholder={t.placeholders.emergencyPhone}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{t.disclaimer}</p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${saved
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
                            } ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {t.saving}
                            </>
                        ) : saved ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                {t.saved}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {t.saveProfile}
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
