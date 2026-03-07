import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
    ArrowLeft, Calendar, Clock, MapPin, Star, Phone, User,
    CheckCircle, X, Heart, Stethoscope, Brain, Eye, Bone, Baby,
    AlertCircle, ChevronRight, Loader, Building2, Navigation, ExternalLink, Bell
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons (known Vite/Webpack issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom user location marker (blue)
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// Custom doctor marker (green)
const doctorIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// Component to recenter map when location changes
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => { map.setView([lat, lng], 14); }, [lat, lng, map]);
    return null;
};

// Helper: pick icon based on amenity type
const getSpecialtyIcon = (type) => {
    switch (type) {
        case 'hospital': return Building2;
        case 'clinic': return Stethoscope;
        case 'doctors': return User;
        case 'dentist': return Heart;
        case 'pharmacy': return AlertCircle;
        default: return Stethoscope;
    }
};

const getSpecialtyLabel = (type) => {
    switch (type) {
        case 'hospital': return 'Hospital';
        case 'clinic': return 'Clinic';
        case 'doctors': return 'Doctor';
        case 'dentist': return 'Dentist';
        case 'pharmacy': return 'Pharmacy';
        default: return 'Healthcare';
    }
};

// Multilingual translations
const translations = {
    en: {
        title: "Doctor Appointments", subtitle: "Find and book appointments with healthcare professionals",
        back: "Back to Dashboard", findDoctors: "Find Doctors Near You", myAppointments: "My Appointments",
        noAppointments: "No appointments scheduled yet", bookNow: "Book Now", viewProfile: "View Profile",
        specializations: "Specializations", experience: "years exp.", rating: "Rating",
        available: "Available", booked: "Booked", selectDate: "Select Date", selectTime: "Select Time",
        confirmBooking: "Confirm Booking", bookingConfirmed: "Booking Confirmed!",
        bookingMessage: "Your appointment has been scheduled successfully.", cancel: "Cancel",
        upcoming: "Upcoming", completed: "Completed", cancelled: "Cancelled",
        disclaimer: "Doctor data is sourced from OpenStreetMap. Availability may vary. Always verify with the facility directly.",
        mapPlaceholder: "Interactive Map Coming Soon", mapDescription: "Find doctors near your location",
        morning: "Morning", afternoon: "Afternoon", evening: "Evening",
        loadingMap: "Fetching your location...", loadingDoctors: "Searching nearby doctors...",
        locationDenied: "Location access denied. Showing default location.",
        noResults: "No medical facilities found nearby. Try allowing location access.",
        notAvailable: "Not Available", yourLocation: "Your Location",
        address: "Address", phone: "Phone", type: "Type",
        getDirections: "Get Directions", callNow: "Call", visitWebsite: "Website",
        setReminder: "Set Reminder", reminderSet: "Reminder Set!",
        reminderMessage: "Your visit reminder has been saved successfully.",
        plannedVisits: "Planned Visits"
    },
    hi: {
        title: "डॉक्टर की नियुक्तियां", subtitle: "स्वास्थ्य पेशेवरों के साथ अपॉइंटमेंट खोजें और बुक करें",
        back: "डैशबोर्ड पर वापस जाएं", findDoctors: "अपने पास के डॉक्टर खोजें",
        myAppointments: "मेरी नियुक्तियां", noAppointments: "अभी तक कोई नियुक्ति निर्धारित नहीं",
        bookNow: "अभी बुक करें", viewProfile: "प्रोफाइल देखें", specializations: "विशेषज्ञताएं",
        experience: "साल का अनुभव", rating: "रेटिंग", available: "उपलब्ध", booked: "बुक किया गया",
        selectDate: "तारीख चुनें", selectTime: "समय चुनें", confirmBooking: "बुकिंग की पुष्टि करें",
        bookingConfirmed: "बुकिंग की पुष्टि हो गई!", bookingMessage: "आपकी नियुक्ति सफलतापूर्वक निर्धारित की गई है।",
        cancel: "रद्द करें", upcoming: "आगामी", completed: "पूर्ण", cancelled: "रद्द",
        disclaimer: "यह एक डेमो है। वास्तविक डॉक्टर की उपलब्धता भिन्न हो सकती है।",
        mapPlaceholder: "इंटरैक्टिव मैप जल्द आ रहा है", mapDescription: "अपने स्थान के पास डॉक्टर खोजें",
        morning: "सुबह", afternoon: "दोपहर", evening: "शाम",
        loadingMap: "आपका स्थान खोज रहे हैं...", loadingDoctors: "पास के डॉक्टर खोज रहे हैं...",
        locationDenied: "स्थान एक्सेस अस्वीकृत। डिफ़ॉल्ट स्थान दिखा रहे हैं।",
        noResults: "पास में कोई चिकित्सा सुविधा नहीं मिली।", notAvailable: "उपलब्ध नहीं",
        yourLocation: "आपका स्थान", address: "पता", phone: "फ़ोन", type: "प्रकार",
        getDirections: "दिशा-निर्देश", callNow: "कॉल करें", visitWebsite: "वेबसाइट",
        setReminder: "रिमाइंडर सेट करें", reminderSet: "रिमाइंडर सेट!",
        reminderMessage: "आपका विज़िट रिमाइंडर सफलतापूर्वक सहेजा गया।",
        plannedVisits: "नियोजित विज़िट"
    },
    mr: {
        title: "डॉक्टरांच्या भेटी", subtitle: "आरोग्य व्यावसायिकांसोबत भेटी शोधा आणि बुक करा",
        back: "डॅशबोर्डवर परत जा", findDoctors: "तुमच्या जवळचे डॉक्टर शोधा",
        myAppointments: "माझ्या भेटी", noAppointments: "अद्याप कोणतीही भेट नियोजित नाही",
        bookNow: "आता बुक करा", viewProfile: "प्रोफाइल पहा", specializations: "विशेषज्ञता",
        experience: "वर्षे अनुभव", rating: "रेटिंग", available: "उपलब्ध", booked: "बुक केले",
        selectDate: "तारीख निवडा", selectTime: "वेळ निवडा", confirmBooking: "बुकिंग पुष्टी करा",
        bookingConfirmed: "बुकिंग पुष्टी झाली!", bookingMessage: "तुमची भेट यशस्वीरित्या नियोजित झाली आहे.",
        cancel: "रद्द करा", upcoming: "आगामी", completed: "पूर्ण", cancelled: "रद्द",
        disclaimer: "हे एक डेमो आहे. वास्तविक डॉक्टरांची उपलब्धता वेगळी असू शकते.",
        mapPlaceholder: "इंटरॅक्टिव मॅप लवकरच येत आहे", mapDescription: "तुमच्या स्थानाजवळील डॉक्टर शोधा",
        morning: "सकाळ", afternoon: "दुपार", evening: "संध्याकाळ",
        loadingMap: "तुमचे स्थान शोधत आहे...", loadingDoctors: "जवळचे डॉक्टर शोधत आहे...",
        locationDenied: "स्थान प्रवेश नाकारला.", noResults: "जवळ कोणतीही वैद्यकीय सुविधा सापडली नाही.",
        notAvailable: "उपलब्ध नाही", yourLocation: "तुमचे स्थान", address: "पत्ता", phone: "फोन", type: "प्रकार",
        getDirections: "दिशानिर्देश", callNow: "कॉल करा", visitWebsite: "वेबसाइट",
        setReminder: "रिमाइंडर सेट करा", reminderSet: "रिमाइंडर सेट!",
        reminderMessage: "तुमचा भेटीचा रिमाइंडर यशस्वीरित्या सेव झाला.",
        plannedVisits: "नियोजित भेटी"
    },
    ta: {
        title: "மருத்துவர் சந்திப்புகள்", subtitle: "சுகாதார நிபுணர்களுடன் சந்திப்புகளைக் கண்டுபிடித்து முன்பதிவு செய்யுங்கள்",
        back: "டாஷ்போர்டுக்கு திரும்ப", findDoctors: "உங்கள் அருகிலுள்ள மருத்துவர்களைக் கண்டறியுங்கள்",
        myAppointments: "எனது சந்திப்புகள்", noAppointments: "இதுவரை சந்திப்புகள் திட்டமிடப்படவில்லை",
        bookNow: "இப்போது முன்பதிவு செய்யுங்கள்", viewProfile: "சுயவிவரத்தைக் காண்க",
        specializations: "நிபுணத்துவங்கள்", experience: "ஆண்டுகள் அனுபவம்", rating: "மதிப்பீடு",
        available: "கிடைக்கும்", booked: "முன்பதிவு செய்யப்பட்டது", selectDate: "தேதியைத் தேர்ந்தெடுக்கவும்",
        selectTime: "நேரத்தைத் தேர்ந்தெடுக்கவும்", confirmBooking: "முன்பதிவை உறுதிப்படுத்துங்கள்",
        bookingConfirmed: "முன்பதிவு உறுதிப்படுத்தப்பட்டது!", bookingMessage: "உங்கள் சந்திப்பு வெற்றிகரமாக திட்டமிடப்பட்டது.",
        cancel: "ரத்து செய்", upcoming: "வரவிருக்கும்", completed: "நிறைவு", cancelled: "ரத்து செய்யப்பட்டது",
        disclaimer: "இது ஒரு டெமோ. உண்மையான மருத்துவர் கிடைக்கும் தன்மை மாறுபடலாம்.",
        mapPlaceholder: "ஊடாடும் வரைபடம் விரைவில் வருகிறது", mapDescription: "உங்கள் இருப்பிடத்திற்கு அருகிலுள்ள மருத்துவர்களைக் கண்டறியுங்கள்",
        morning: "காலை", afternoon: "மதியம்", evening: "மாலை",
        loadingMap: "உங்கள் இருப்பிடத்தைப் பெறுகிறது...", loadingDoctors: "அருகிலுள்ள மருத்துவர்களைத் தேடுகிறது...",
        locationDenied: "இருப்பிட அணுகல் மறுக்கப்பட்டது.", noResults: "அருகில் மருத்துவ வசதிகள் எதுவும் கிடைக்கவில்லை.",
        notAvailable: "கிடைக்கவில்லை", yourLocation: "உங்கள் இருப்பிடம்", address: "முகவரி", phone: "தொலைபேசி", type: "வகை",
        getDirections: "வழிகாட்டு", callNow: "அழைப்பு", visitWebsite: "வலைதளம்",
        setReminder: "நினைவூட்டல் அமை", reminderSet: "நினைவூட்டல் அமைக்கப்பட்டது!",
        reminderMessage: "உங்கள் வருகை நினைவூட்டல் வெற்றிகரமாக சேமிக்கப்பட்டது.",
        plannedVisits: "திட்டமிட்ட வருகைகள்"
    },
    te: {
        title: "డాక్టర్ అపాయింట్‌మెంట్లు", subtitle: "ఆరోగ్య నిపుణులతో అపాయింట్‌మెంట్లు కనుగొని బుక్ చేయండి",
        back: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు", findDoctors: "మీ సమీపంలోని డాక్టర్లను కనుగొనండి",
        myAppointments: "నా అపాయింట్‌మెంట్లు", noAppointments: "ఇంకా అపాయింట్‌మెంట్లు షెడ్యూల్ చేయలేదు",
        bookNow: "ఇప్పుడు బుక్ చేయండి", viewProfile: "ప్రొఫైల్ చూడండి", specializations: "స్పెషలైజేషన్లు",
        experience: "సంవత్సరాల అనుభవం", rating: "రేటింగ్", available: "అందుబాటులో ఉంది", booked: "బుక్ చేయబడింది",
        selectDate: "తేదీని ఎంచుకోండి", selectTime: "సమయాన్ని ఎంచుకోండి", confirmBooking: "బుకింగ్ నిర్ధారించండి",
        bookingConfirmed: "బుకింగ్ నిర్ధారించబడింది!", bookingMessage: "మీ అపాయింట్‌మెంట్ విజయవంతంగా షెడ్యూల్ చేయబడింది.",
        cancel: "రద్దు చేయి", upcoming: "రాబోతున్న", completed: "పూర్తయింది", cancelled: "రద్దు చేయబడింది",
        disclaimer: "ఇది డెమో. నిజమైన డాక్టర్ అందుబాటు మారవచ్చు.",
        mapPlaceholder: "ఇంటరాక్టివ్ మ్యాప్ త్వరలో వస్తుంది", mapDescription: "మీ స్థానానికి సమీపంలో డాక్టర్లను కనుగొనండి",
        morning: "ఉదయం", afternoon: "మధ్యాహ్నం", evening: "సాయంత్రం",
        loadingMap: "మీ స్థానాన్ని పొందుతోంది...", loadingDoctors: "సమీపంలోని డాక్టర్లను శోధిస్తోంది...",
        locationDenied: "స్థానం యాక్సెస్ నిరాకరించబడింది.", noResults: "సమీపంలో వైద్య సౌకర్యాలు కనుగొనబడలేదు.",
        notAvailable: "అందుబాటులో లేదు", yourLocation: "మీ స్థానం", address: "చిరునామా", phone: "ఫోన్", type: "రకం",
        getDirections: "దిశలు", callNow: "కాల్ చేయండి", visitWebsite: "వెబ్‌సైట్",
        setReminder: "రిమైండర్ సెట్ చేయండి", reminderSet: "రిమైండర్ సెట్!",
        reminderMessage: "మీ సందర్శన రిమైండర్ విజయవంతంగా సేవ్ చేయబడింది.",
        plannedVisits: "ప్లాన్ చేసిన సందర్శనలు"
    },
    bn: {
        title: "ডাক্তার অ্যাপয়েন্টমেন্ট", subtitle: "স্বাস্থ্য পেশাদারদের সাথে অ্যাপয়েন্টমেন্ট খুঁজুন এবং বুক করুন",
        back: "ড্যাশবোর্ডে ফিরে যান", findDoctors: "আপনার কাছের ডাক্তার খুঁজুন",
        myAppointments: "আমার অ্যাপয়েন্টমেন্টগুলি", noAppointments: "এখনও কোনো অ্যাপয়েন্টমেন্ট নির্ধারিত হয়নি",
        bookNow: "এখনই বুক করুন", viewProfile: "প্রোফাইল দেখুন", specializations: "বিশেষজ্ঞতা",
        experience: "বছরের অভিজ্ঞতা", rating: "রেটিং", available: "উপলব্ধ", booked: "বুক হয়েছে",
        selectDate: "তারিখ নির্বাচন করুন", selectTime: "সময় নির্বাচন করুন", confirmBooking: "বুকিং নিশ্চিত করুন",
        bookingConfirmed: "বুকিং নিশ্চিত হয়েছে!", bookingMessage: "আপনার অ্যাপয়েন্টমেন্ট সফলভাবে নির্ধারিত হয়েছে।",
        cancel: "বাতিল করুন", upcoming: "আসন্ন", completed: "সম্পূর্ণ", cancelled: "বাতিল",
        disclaimer: "এটি একটি ডেমো। প্রকৃত ডাক্তারের প্রাপ্যতা ভিন্ন হতে পারে।",
        mapPlaceholder: "ইন্টারেক্টিভ মানচিত্র শীঘ্রই আসছে", mapDescription: "আপনার অবস্থানের কাছে ডাক্তার খুঁজুন",
        morning: "সকাল", afternoon: "দুপুর", evening: "সন্ধ্যা",
        loadingMap: "আপনার অবস্থান পাওয়া যাচ্ছে...", loadingDoctors: "কাছের ডাক্তার খোঁজা হচ্ছে...",
        locationDenied: "অবস্থান অ্যাক্সেস প্রত্যাখ্যান।", noResults: "কাছে কোনো চিকিৎসা সুবিধা পাওয়া যায়নি।",
        notAvailable: "উপলব্ধ নয়", yourLocation: "আপনার অবস্থান", address: "ঠিকানা", phone: "ফোন", type: "ধরন",
        getDirections: "দিকনির্দেশ", callNow: "কল করুন", visitWebsite: "ওয়েবসাইট",
        setReminder: "রিমাইন্ডার সেট করুন", reminderSet: "রিমাইন্ডার সেট!",
        reminderMessage: "আপনার ভিজিট রিমাইন্ডার সফলভাবে সংরক্ষিত হয়েছে।",
        plannedVisits: "পরিকল্পিত ভিজিট"
    },
    gu: {
        title: "ડૉક્ટર એપોઇન્ટમેન્ટ્સ", subtitle: "આરોગ્ય વ્યાવસાયિકો સાથે એપોઇન્ટમેન્ટ્સ શોધો અને બુક કરો",
        back: "ડેશબોર્ડ પર પાછા જાઓ", findDoctors: "તમારી નજીકના ડૉક્ટરો શોધો",
        myAppointments: "મારી એપોઇન્ટમેન્ટ્સ", noAppointments: "હજુ સુધી કોઈ એપોઇન્ટમેન્ટ નિર્ધારિત નથી",
        bookNow: "હમણાં બુક કરો", viewProfile: "પ્રોફાઇલ જુઓ", specializations: "વિશેષજ્ઞતાઓ",
        experience: "વર્ષોનો અનુભવ", rating: "રેટિંગ", available: "ઉપલબ્ધ", booked: "બુક થયેલ",
        selectDate: "તારીખ પસંદ કરો", selectTime: "સમય પસંદ કરો", confirmBooking: "બુકિંગ પુષ્ટિ કરો",
        bookingConfirmed: "બુકિંગ પુષ્ટિ થઈ!", bookingMessage: "તમારી એપોઇન્ટમેન્ટ સફળતાપૂર્વક નિર્ધારિત થઈ છે.",
        cancel: "રદ કરો", upcoming: "આગામી", completed: "પૂર્ણ", cancelled: "રદ",
        disclaimer: "આ એક ડેમો છે. વાસ્તવિક ડૉક્ટરની ઉપલબ્ધતા અલગ હોઈ શકે છે.",
        mapPlaceholder: "ઇન્ટરેક્ટિવ નકશો ટૂંક સમયમાં આવી રહ્યો છે", mapDescription: "તમારા સ્થાન નજીકના ડૉક્ટરો શોધો",
        morning: "સવાર", afternoon: "બપોર", evening: "સાંજ",
        loadingMap: "તમારું સ્થાન મેળવી રહ્યા છે...", loadingDoctors: "નજીકના ડૉક્ટરો શોધી રહ્યા છે...",
        locationDenied: "સ્થાન ઍક્સેસ નકારવામાં આવ્યું.", noResults: "નજીકમાં કોઈ તબીબી સુવિધા મળી નથી.",
        notAvailable: "ઉપલબ્ધ નથી", yourLocation: "તમારું સ્થાન", address: "સરનામું", phone: "ફોન", type: "પ્રકાર",
        getDirections: "દિશાઓ", callNow: "કૉલ કરો", visitWebsite: "વેબસાઇટ",
        setReminder: "રિમાઇન્ડર સેટ કરો", reminderSet: "રિમાઇન્ડર સેટ!",
        reminderMessage: "તમારો મુલાકાત રિમાઇન્ડર સફળતાપૂર્વક સાચવવામાં આવ્યો.",
        plannedVisits: "આયોજિત મુલાકાતો"
    },
    kn: {
        title: "ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು", subtitle: "ಆರೋಗ್ಯ ವೃತ್ತಿಪರರೊಂದಿಗೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಬುಕ್ ಮಾಡಿ",
        back: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ", findDoctors: "ನಿಮ್ಮ ಹತ್ತಿರದ ವೈದ್ಯರನ್ನು ಹುಡುಕಿ",
        myAppointments: "ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು", noAppointments: "ಇನ್ನೂ ಯಾವುದೇ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ",
        bookNow: "ಈಗ ಬುಕ್ ಮಾಡಿ", viewProfile: "ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ", specializations: "ವಿಶೇಷತೆಗಳು",
        experience: "ವರ್ಷಗಳ ಅನುಭವ", rating: "ರೇಟಿಂಗ್", available: "ಲಭ್ಯವಿದೆ", booked: "ಬುಕ್ ಆಗಿದೆ",
        selectDate: "ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ", selectTime: "ಸಮಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ", confirmBooking: "ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಿ",
        bookingConfirmed: "ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!", bookingMessage: "ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಯಶಸ್ವಿಯಾಗಿ ನಿಗದಿಯಾಗಿದೆ.",
        cancel: "ರದ್ದುಮಾಡಿ", upcoming: "ಮುಂಬರುವ", completed: "ಪೂರ್ಣಗೊಂಡಿದೆ", cancelled: "ರದ್ದುಮಾಡಲಾಗಿದೆ",
        disclaimer: "ಇದು ಡೆಮೊ. ನಿಜವಾದ ವೈದ್ಯರ ಲಭ್ಯತೆ ಬೇರೆಯಾಗಿರಬಹುದು.",
        mapPlaceholder: "ಇಂಟರ್ಯಾಕ್ಟಿವ್ ನಕ್ಷೆ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ", mapDescription: "ನಿಮ್ಮ ಸ್ಥಳದ ಹತ್ತಿರದ ವೈದ್ಯರನ್ನು ಹುಡುಕಿ",
        morning: "ಬೆಳಿಗ್ಗೆ", afternoon: "ಮಧ್ಯಾಹ್ನ", evening: "ಸಂಜೆ",
        loadingMap: "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...", loadingDoctors: "ಹತ್ತಿರದ ವೈದ್ಯರನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
        locationDenied: "ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ.", noResults: "ಹತ್ತಿರ ಯಾವುದೇ ವೈದ್ಯಕೀಯ ಸೌಲಭ್ಯ ಕಂಡುಬಂದಿಲ್ಲ.",
        notAvailable: "ಲಭ್ಯವಿಲ್ಲ", yourLocation: "ನಿಮ್ಮ ಸ್ಥಳ", address: "ವಿಳಾಸ", phone: "ಫೋನ್", type: "ವಿಧ",
        getDirections: "ದಿಕ್ಕುಗಳು", callNow: "ಕರೆ ಮಾಡಿ", visitWebsite: "ವೆಬ್‌ಸೈಟ್",
        setReminder: "ರಿಮೈಂಡರ್ ಹೊಂದಿಸಿ", reminderSet: "ರಿಮೈಂಡರ್ ಹೊಂದಿಸಲಾಗಿದೆ!",
        reminderMessage: "ನಿಮ್ಮ ಭೇಟಿ ರಿಮೈಂಡರ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.",
        plannedVisits: "ಯೋಜಿತ ಭೇಟಿಗಳು"
    }
};

// Time slots
const timeSlots = {
    morning: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
    afternoon: ["2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"],
    evening: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"]
};

const APPOINTMENTS_KEY = 'vaidyaai_appointments';
const DEFAULT_LOCATION = { lat: 19.076, lng: 72.8777 }; // Mumbai fallback

// Fetch nearby doctors from Overpass API
const fetchNearbyDoctors = async (lat, lng, radiusMeters = 5000) => {
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"="doctors"](around:${radiusMeters},${lat},${lng});
          node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
          node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
          node["amenity"="dentist"](around:${radiusMeters},${lat},${lng});
          way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
          way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
          way["amenity"="doctors"](around:${radiusMeters},${lat},${lng});
        );
        out center body;
    `;
    const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
    });
    if (!response.ok) throw new Error('Overpass API request failed');
    const data = await response.json();

    return data.elements.map((el, idx) => {
        const tags = el.tags || {};
        const elLat = el.lat || el.center?.lat;
        const elLng = el.lon || el.center?.lon;
        const amenity = tags.amenity || 'doctors';
        return {
            id: el.id || idx + 1,
            name: tags.name || tags['name:en'] || null,
            specialty: getSpecialtyLabel(amenity),
            specialtyIcon: getSpecialtyIcon(amenity),
            location: [tags['addr:full'], tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || null,
            phone: tags.phone || tags['contact:phone'] || null,
            website: tags.website || tags['contact:website'] || null,
            openingHours: tags.opening_hours || null,
            lat: elLat,
            lng: elLng,
            amenityType: amenity,
            available: true,
            fee: null,
            rating: null,
            reviews: null,
            experience: null,
        };
    }).filter(d => d.lat && d.lng);
};

const AppointmentsPage = () => {
    const navigate = useNavigate();
    const { currentLang } = useLanguage();
    const t = translations[currentLang] || translations.en;

    const [appointments, setAppointments] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('doctors');

    // Map & doctor states
    const [userLocation, setUserLocation] = useState(null);
    const [nearbyDoctors, setNearbyDoctors] = useState([]);
    const [mapLoading, setMapLoading] = useState(true);
    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const [mapError, setMapError] = useState('');
    const [locationDenied, setLocationDenied] = useState(false);

    // Load appointments from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(APPOINTMENTS_KEY);
        if (saved) {
            try { setAppointments(JSON.parse(saved)); } catch (e) { console.error('Error loading appointments:', e); }
        }
    }, []);

    // Get user location
    useEffect(() => {
        if (!navigator.geolocation) {
            setUserLocation(DEFAULT_LOCATION);
            setMapLoading(false);
            setLocationDenied(true);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setMapLoading(false);
            },
            () => {
                setUserLocation(DEFAULT_LOCATION);
                setMapLoading(false);
                setLocationDenied(true);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    }, []);

    // Fetch doctors once location is available
    useEffect(() => {
        if (!userLocation) return;
        setDoctorsLoading(true);
        setMapError('');
        fetchNearbyDoctors(userLocation.lat, userLocation.lng)
            .then(docs => {
                setNearbyDoctors(docs.slice(0, 12)); // cap at 12
                setDoctorsLoading(false);
            })
            .catch(err => {
                console.error('Overpass API error:', err);
                setMapError(t.noResults);
                setDoctorsLoading(false);
            });
    }, [userLocation]);

    const getNextDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push({ date: date.toISOString().split('T')[0], day: date.toLocaleDateString('en-US', { weekday: 'short' }), dayNum: date.getDate() });
        }
        return days;
    };

    const handleBookClick = (doctor) => {
        setSelectedDoctor(doctor);
        setSelectedDate('');
        setSelectedTime('');
        setBookingSuccess(false);
        setShowBookingModal(true);
    };

    const handleConfirmBooking = () => {
        if (!selectedDate || !selectedTime) return;
        const newAppointment = {
            id: Date.now(), doctorId: selectedDoctor.id, doctorName: selectedDoctor.name || t.notAvailable,
            specialty: selectedDoctor.specialty, location: selectedDoctor.location || t.notAvailable,
            date: selectedDate, time: selectedTime, fee: selectedDoctor.fee, status: 'upcoming',
            bookedAt: new Date().toISOString()
        };
        const updated = [...appointments, newAppointment];
        setAppointments(updated);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
        setBookingSuccess(true);
    };

    const handleCancelAppointment = (id) => {
        const updated = appointments.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt);
        setAppointments(updated);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    };

    const displayDoctors = nearbyDoctors.length > 0 ? nearbyDoctors : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h2>
                    <p className="text-gray-600">{t.subtitle}</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button onClick={() => setActiveTab('doctors')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'doctors' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-emerald-50'}`}>
                        {t.findDoctors}
                    </button>
                    <button onClick={() => setActiveTab('appointments')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === 'appointments' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-emerald-50'}`}>
                        {t.plannedVisits}
                        {appointments.filter(a => a.status === 'upcoming').length > 0 && (
                            <span className="w-6 h-6 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                                {appointments.filter(a => a.status === 'upcoming').length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === 'doctors' ? (
                    <>
                        {/* Map Section */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-emerald-200 mb-8 overflow-hidden">
                            {mapLoading ? (
                                <div className="flex flex-col items-center justify-center h-80">
                                    <Loader className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                                    <p className="text-emerald-700 font-medium">{t.loadingMap}</p>
                                </div>
                            ) : userLocation ? (
                                <div style={{ height: '380px', width: '100%' }}>
                                    <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={14}
                                        style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }} scrollWheelZoom={true}>
                                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
                                        {/* User location marker */}
                                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                                            <Popup><strong>{t.yourLocation}</strong></Popup>
                                        </Marker>
                                        {/* Doctor markers */}
                                        {displayDoctors.map(doc => (
                                            <Marker key={doc.id} position={[doc.lat, doc.lng]} icon={doctorIcon}>
                                                <Popup>
                                                    <strong>{doc.name || t.notAvailable}</strong><br />
                                                    <span style={{ color: '#059669' }}>{doc.specialty}</span><br />
                                                    {doc.location && <><MapPin style={{ display: 'inline', width: 12, height: 12 }} /> {doc.location}<br /></>}
                                                    {doc.phone && <><Phone style={{ display: 'inline', width: 12, height: 12 }} /> {doc.phone}</>}
                                                </Popup>
                                            </Marker>
                                        ))}
                                    </MapContainer>
                                </div>
                            ) : null}
                            {locationDenied && (
                                <div className="bg-amber-50 px-4 py-2 text-center text-sm text-amber-700">
                                    <AlertCircle className="w-4 h-4 inline mr-1" />{t.locationDenied}
                                </div>
                            )}
                        </div>

                        {/* Doctor Cards */}
                        {doctorsLoading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                                <p className="text-emerald-700 font-medium">{t.loadingDoctors}</p>
                            </div>
                        ) : displayDoctors.length === 0 && !mapError ? (
                            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-12 text-center mb-8">
                                <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-500">{t.noResults}</h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {displayDoctors.map(doctor => {
                                    const IconComp = doctor.specialtyIcon;
                                    return (
                                        <div key={doctor.id}
                                            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500">
                                                    <IconComp className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-800">{doctor.name || t.notAvailable}</h3>
                                                    <p className="text-sm text-emerald-600">{doctor.specialty}</p>
                                                    {doctor.openingHours && <p className="text-xs text-gray-500 mt-1"><Clock className="w-3 h-3 inline mr-1" />{doctor.openingHours}</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                {doctor.location && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                                        <span className="truncate">{doctor.location}</span>
                                                    </div>
                                                )}
                                                {doctor.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4 flex-shrink-0" />
                                                        <span>{doctor.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Smart Action Panel */}
                                            <div className="flex gap-2 mb-2">
                                                <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${doctor.lat},${doctor.lng}`, '_blank')}
                                                    className="flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md text-sm">
                                                    <Navigation className="w-4 h-4" />
                                                    {t.getDirections}
                                                </button>
                                                {doctor.phone && (
                                                    <a href={`tel:${doctor.phone}`}
                                                        className="py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md text-sm">
                                                        <Phone className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {doctor.website && (
                                                    <a href={doctor.website} target="_blank" rel="noopener noreferrer"
                                                        className="py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-md text-sm">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                            <button onClick={() => handleBookClick(doctor)}
                                                className="w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md text-sm">
                                                <Bell className="w-4 h-4" />
                                                {t.setReminder}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {mapError && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-center">
                                <AlertCircle className="w-5 h-5 text-red-500 inline mr-2" />
                                <span className="text-red-700">{mapError}</span>
                            </div>
                        )}
                    </>
                ) : (
                    /* My Appointments Tab */
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-500">{t.noAppointments}</h3>
                            </div>
                        ) : (
                            appointments.map(apt => (
                                <div key={apt.id}
                                    className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border ${apt.status === 'upcoming' ? 'border-emerald-200' : apt.status === 'cancelled' ? 'border-red-200' : 'border-gray-200'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${apt.status === 'upcoming' ? 'bg-emerald-100' : apt.status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'}`}>
                                                <Stethoscope className={`w-7 h-7 ${apt.status === 'upcoming' ? 'text-emerald-600' : apt.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{apt.doctorName}</h3>
                                                <p className="text-sm text-emerald-600">{apt.specialty}</p>
                                                <p className="text-xs text-gray-500">{apt.location}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-800">{new Date(apt.date).toLocaleDateString()}</p>
                                            <p className="text-sm text-emerald-600">{apt.time}</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${apt.status === 'upcoming' ? 'bg-emerald-100 text-emerald-700' : apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {apt.status === 'upcoming' ? t.upcoming : apt.status === 'cancelled' ? t.cancelled : t.completed}
                                            </span>
                                        </div>
                                    </div>
                                    {apt.status === 'upcoming' && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                            <button onClick={() => handleCancelAppointment(apt.id)}
                                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm">
                                                {t.cancel}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-8">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{t.disclaimer}</p>
                    </div>
                </div>
            </main>

            {/* Visit Reminder Modal */}
            {showBookingModal && selectedDoctor && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        {!bookingSuccess ? (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">{t.setReminder}</h3>
                                    <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                                        <selectedDoctor.specialtyIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{selectedDoctor.name || t.notAvailable}</h4>
                                        <p className="text-sm text-emerald-600">{selectedDoctor.specialty}</p>
                                        {selectedDoctor.phone && <p className="text-xs text-gray-500"><Phone className="w-3 h-3 inline mr-1" />{selectedDoctor.phone}</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">{t.selectDate}</label>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {getNextDays().map(day => (
                                            <button key={day.date} onClick={() => setSelectedDate(day.date)}
                                                className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center transition-all ${selectedDate === day.date ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-emerald-50'}`}>
                                                <span className="text-xs">{day.day}</span>
                                                <span className="text-xl font-bold">{day.dayNum}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">{t.selectTime}</label>
                                    <div className="space-y-4">
                                        {Object.entries(timeSlots).map(([period, slots]) => (
                                            <div key={period}>
                                                <p className="text-xs text-gray-500 mb-2">{t[period]}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {slots.map(time => (
                                                        <button key={time} onClick={() => setSelectedTime(time)}
                                                            className={`px-3 py-2 rounded-lg text-sm transition-all ${selectedTime === time ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-emerald-50'}`}>
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={handleConfirmBooking} disabled={!selectedDate || !selectedTime}
                                    className={`w-full py-4 rounded-xl font-semibold transition-all ${selectedDate && selectedTime ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                                    {t.confirmBooking}
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Bell className="w-10 h-10 text-amber-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.reminderSet}</h3>
                                <p className="text-gray-600 mb-6">{t.reminderMessage}</p>
                                <div className="bg-emerald-50 rounded-2xl p-4 mb-6 text-left">
                                    <p className="font-medium text-gray-800">{selectedDoctor.name || t.notAvailable}</p>
                                    <p className="text-sm text-emerald-600">{selectedDoctor.specialty}</p>
                                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(selectedDate).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedTime}</span>
                                    </div>
                                </div>
                                <button onClick={() => { setShowBookingModal(false); setActiveTab('appointments'); }}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg transition-all">
                                    {t.plannedVisits}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentsPage;
