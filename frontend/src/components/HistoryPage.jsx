import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import {
    ArrowLeft,
    Calendar,
    Clock,
    FileText,
    Stethoscope,
    Heart,
    Activity,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Droplet,
    Leaf,
    Sun,
    Pill,
    Brain,
    Eye,
    Bone,
    Baby,
    Trash2
} from 'lucide-react';

// Icon lookup maps for restoring icons from localStorage
const reportIconMap = {
    'Droplet': Droplet, 'Activity': Activity, 'Heart': Heart, 'Brain': Brain,
    'Eye': Eye, 'Bone': Bone, 'Baby': Baby, 'Stethoscope': Stethoscope
};
const remedyIconMap = {
    'Leaf': Leaf, 'Activity': Activity, 'Sun': Sun, 'Pill': Pill,
    'Heart': Heart, 'Brain': Brain
};
const specialtyIconMap = {
    'Stethoscope': Stethoscope, 'Heart': Heart, 'Brain': Brain,
    'Eye': Eye, 'Bone': Bone, 'Baby': Baby, 'Activity': Activity
};

// Safe icon render helper
const SafeIcon = ({ icon: IconComponent, className }) => {
    if (!IconComponent || typeof IconComponent !== 'function') {
        return <FileText className={className} />;
    }
    return <IconComponent className={className} />;
};

// Multilingual translations
const translations = {
    en: {
        title: "Health History",
        subtitle: "Your personal health timeline",
        back: "Back to Dashboard",
        reportsSection: "Analyzed Reports",
        appointmentsSection: "Appointment History",
        noReports: "No reports analyzed yet",
        noAppointments: "No appointments in history",
        viewDetails: "View Details",
        hideDetails: "Hide Details",
        summary: "Summary",
        abnormalValues: "Abnormal Values",
        remedies: "Recommended Remedies",
        upcoming: "Upcoming",
        completed: "Completed",
        cancelled: "Cancelled",
        today: "Today",
        yesterday: "Yesterday",
        daysAgo: "days ago",
        deleteBtn: "Delete",
        deleteConfirm: "Are you sure you want to delete this report?",
        deleteCancel: "Cancel",
        deleteYes: "Yes, Delete"
    },
    hi: {
        title: "स्वास्थ्य इतिहास",
        subtitle: "आपकी व्यक्तिगत स्वास्थ्य समयरेखा",
        back: "डैशबोर्ड पर वापस जाएं",
        reportsSection: "विश्लेषित रिपोर्ट",
        appointmentsSection: "नियुक्ति इतिहास",
        noReports: "अभी तक कोई रिपोर्ट विश्लेषित नहीं",
        noAppointments: "इतिहास में कोई नियुक्ति नहीं",
        viewDetails: "विवरण देखें",
        hideDetails: "विवरण छुपाएं",
        summary: "सारांश",
        abnormalValues: "असामान्य मान",
        remedies: "अनुशंसित उपाय",
        upcoming: "आगामी",
        completed: "पूर्ण",
        cancelled: "रद्द",
        today: "आज",
        yesterday: "कल",
        daysAgo: "दिन पहले",
        deleteBtn: "हटाएं",
        deleteConfirm: "क्या आप वाकई इस रिपोर्ट को हटाना चाहते हैं?",
        deleteCancel: "रद्द करें",
        deleteYes: "हाँ, हटाएं"
    },
    mr: {
        title: "आरोग्य इतिहास",
        subtitle: "तुमची वैयक्तिक आरोग्य समयरेखा",
        back: "डॅशबोर्डवर परत जा",
        reportsSection: "विश्लेषित अहवाल",
        appointmentsSection: "भेट इतिहास",
        noReports: "अद्याप कोणताही अहवाल विश्लेषित नाही",
        noAppointments: "इतिहासात कोणतीही भेट नाही",
        viewDetails: "तपशील पहा",
        hideDetails: "तपशील लपवा",
        summary: "सारांश",
        abnormalValues: "असामान्य मूल्ये",
        remedies: "शिफारस केलेले उपाय",
        upcoming: "आगामी",
        completed: "पूर्ण",
        cancelled: "रद्द",
        today: "आज",
        yesterday: "काल",
        daysAgo: "दिवसांपूर्वी",
        deleteBtn: "हटवा",
        deleteConfirm: "तुम्हाला खात्री आहे की तुम्हाला हा अहवाल हटवायचा आहे?",
        deleteCancel: "रद्द करा",
        deleteYes: "होय, हटवा"
    },
    ta: {
        title: "சுகாதார வரலாறு",
        subtitle: "உங்கள் தனிப்பட்ட சுகாதார கால வரிசை",
        back: "டாஷ்போர்டுக்கு திரும்ப",
        reportsSection: "பகுப்பாய்வு செய்யப்பட்ட அறிக்கைகள்",
        appointmentsSection: "சந்திப்பு வரலாறு",
        noReports: "இதுவரை அறிக்கைகள் பகுப்பாய்வு செய்யப்படவில்லை",
        noAppointments: "வரலாற்றில் சந்திப்புகள் இல்லை",
        viewDetails: "விவரங்களைக் காண்க",
        hideDetails: "விவரங்களை மறை",
        summary: "சுருக்கம்",
        abnormalValues: "அசாதாரண மதிப்புகள்",
        remedies: "பரிந்துரைக்கப்பட்ட தீர்வுகள்",
        upcoming: "வரவிருக்கும்",
        completed: "நிறைவு",
        cancelled: "ரத்து",
        today: "இன்று",
        yesterday: "நேற்று",
        daysAgo: "நாட்களுக்கு முன்பு",
        deleteBtn: "நீக்கு",
        deleteConfirm: "இந்த அறிக்கையை நீக்க விரும்புகிறீர்களா?",
        deleteCancel: "ரத்து செய்",
        deleteYes: "ஆம், நீக்கு"
    },
    te: {
        title: "ఆరోగ్య చరిత్ర",
        subtitle: "మీ వ్యక్తిగత ఆరోగ్య కాల రేఖ",
        back: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు",
        reportsSection: "విశ్లేషించిన నివేదికలు",
        appointmentsSection: "అపాయింట్‌మెంట్ చరిత్ర",
        noReports: "ఇంకా నివేదికలు విశ్లేషించబడలేదు",
        noAppointments: "చరిత్రలో అపాయింట్‌మెంట్లు లేవు",
        viewDetails: "వివరాలు చూడండి",
        hideDetails: "వివరాలు దాచు",
        summary: "సారాంశం",
        abnormalValues: "అసాధారణ విలువలు",
        remedies: "సిఫార్సు చేసిన నివారణలు",
        upcoming: "రాబోతున్న",
        completed: "పూర్తయింది",
        cancelled: "రద్దు",
        today: "ఈ రోజు",
        yesterday: "నిన్న",
        daysAgo: "రోజుల క్రితం",
        deleteBtn: "తొలగించు",
        deleteConfirm: "మీరు ఈ నివేదికను తొలగించాలనుకుంటున్నారా?",
        deleteCancel: "రద్దు",
        deleteYes: "అవును, తొలగించు"
    },
    bn: {
        title: "স্বাস্থ্য ইতিহাস",
        subtitle: "আপনার ব্যক্তিগত স্বাস্থ্য টাইমলাইন",
        back: "ড্যাশবোর্ডে ফিরে যান",
        reportsSection: "বিশ্লেষিত রিপোর্ট",
        appointmentsSection: "অ্যাপয়েন্টমেন্ট ইতিহাস",
        noReports: "এখনও কোনো রিপোর্ট বিশ্লেষণ করা হয়নি",
        noAppointments: "ইতিহাসে কোনো অ্যাপয়েন্টমেন্ট নেই",
        viewDetails: "বিস্তারিত দেখুন",
        hideDetails: "বিস্তারিত লুকান",
        summary: "সারাংশ",
        abnormalValues: "অস্বাভাবিক মান",
        remedies: "প্রস্তাবিত প্রতিকার",
        upcoming: "আসন্ন",
        completed: "সম্পূর্ণ",
        cancelled: "বাতিল",
        today: "আজ",
        yesterday: "গতকাল",
        daysAgo: "দিন আগে",
        deleteBtn: "মুছুন",
        deleteConfirm: "আপনি কি এই রিপোর্টটি মুছে ফেলতে চান?",
        deleteCancel: "বাতিল",
        deleteYes: "হ্যাঁ, মুছুন"
    },
    gu: {
        title: "આરોગ્ય ઇતિહાસ",
        subtitle: "તમારી વ્યક્તિગત આરોગ્ય સમયરેખા",
        back: "ડેશબોર્ડ પર પાછા જાઓ",
        reportsSection: "વિશ્લેષિત રિપોર્ટ્સ",
        appointmentsSection: "એપોઇન્ટમેન્ટ ઇતિહાસ",
        noReports: "હજુ સુધી કોઈ રિપોર્ટ વિશ્લેષિત નથી",
        noAppointments: "ઇતિહાસમાં કોઈ એપોઇન્ટમેન્ટ નથી",
        viewDetails: "વિગતો જુઓ",
        hideDetails: "વિગતો છુપાવો",
        summary: "સારાંશ",
        abnormalValues: "અસામાન્ય મૂલ્યો",
        remedies: "ભલામણ કરેલ ઉપાયો",
        upcoming: "આગામી",
        completed: "પૂર્ણ",
        cancelled: "રદ",
        today: "આજે",
        yesterday: "ગઈકાલે",
        daysAgo: "દિવસ પહેલા",
        deleteBtn: "કાઢી નાખો",
        deleteConfirm: "શું તમે ખરેખર આ રિપોર્ટ કાઢી નાખવા માંગો છો?",
        deleteCancel: "રદ કરો",
        deleteYes: "હા, કાઢી નાખો"
    },
    kn: {
        title: "ಆರೋಗ್ಯ ಇತಿಹಾಸ",
        subtitle: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಕಾಲಾನುಕ್ರಮ",
        back: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
        reportsSection: "ವಿಶ್ಲೇಷಿಸಿದ ವರದಿಗಳು",
        appointmentsSection: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಇತಿಹಾಸ",
        noReports: "ಇನ್ನೂ ಯಾವುದೇ ವರದಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗಿಲ್ಲ",
        noAppointments: "ಇತಿಹಾಸದಲ್ಲಿ ಯಾವುದೇ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳಿಲ್ಲ",
        viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ",
        hideDetails: "ವಿವರಗಳನ್ನು ಮರೆಮಾಡಿ",
        summary: "ಸಾರಾಂಶ",
        abnormalValues: "ಅಸಹಜ ಮೌಲ್ಯಗಳು",
        remedies: "ಶಿಫಾರಸು ಮಾಡಿದ ಪರಿಹಾರಗಳು",
        upcoming: "ಮುಂಬರುವ",
        completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
        cancelled: "ರದ್ದುಮಾಡಲಾಗಿದೆ",
        today: "ಇಂದು",
        yesterday: "ನಿನ್ನೆ",
        daysAgo: "ದಿನಗಳ ಹಿಂದೆ",
        deleteBtn: "ಅಳಿಸಿ",
        deleteConfirm: "ನೀವು ಈ ವರದಿಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?",
        deleteCancel: "ರದ್ದುಮಾಡಿ",
        deleteYes: "ಹೌದು, ಅಳಿಸಿ"
    }
};

// Demo reports data
const demoReports = [
    {
        id: 1,
        type: "Complete Blood Count",
        icon: Droplet,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        summary: "Your blood test results show mostly normal values with slightly elevated cholesterol levels that require dietary attention.",
        abnormalValues: [
            { name: "Total Cholesterol", value: "220 mg/dL", status: "elevated", normal: "< 200 mg/dL" },
            { name: "LDL Cholesterol", value: "145 mg/dL", status: "borderline", normal: "< 130 mg/dL" }
        ],
        remedies: [
            { icon: Leaf, title: "Dietary Changes", description: "Reduce saturated fats and increase fiber intake" },
            { icon: Activity, title: "Regular Exercise", description: "30 minutes of moderate activity daily" }
        ]
    },
    {
        id: 2,
        type: "Glucose Tolerance Test",
        icon: Activity,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        summary: "Blood sugar levels are within normal range. Good glycemic control observed.",
        abnormalValues: [],
        remedies: [
            { icon: Sun, title: "Maintain Lifestyle", description: "Continue healthy eating habits" }
        ]
    },
    {
        id: 3,
        type: "Lipid Profile",
        icon: Heart,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        summary: "Cardiovascular risk markers show improvement from previous tests. HDL levels are good.",
        abnormalValues: [
            { name: "Triglycerides", value: "165 mg/dL", status: "borderline", normal: "< 150 mg/dL" }
        ],
        remedies: [
            { icon: Leaf, title: "Omega-3 Rich Diet", description: "Include fish and nuts in your diet" },
            { icon: Pill, title: "Consider Supplements", description: "Fish oil supplements may help" }
        ]
    },
    {
        id: 4,
        type: "Thyroid Function",
        icon: Brain,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        summary: "Thyroid hormone levels are within optimal range. No intervention needed.",
        abnormalValues: [],
        remedies: []
    }
];

// Demo appointments data
const demoAppointments = [
    {
        id: 1,
        doctorName: "Dr. Priya Sharma",
        specialty: "General Physician",
        specialtyIcon: Stethoscope,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        time: "10:30 AM",
        status: "upcoming",
        location: "Apollo Hospital, Mumbai"
    },
    {
        id: 2,
        doctorName: "Dr. Rajesh Kumar",
        specialty: "Cardiologist",
        specialtyIcon: Heart,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        time: "2:00 PM",
        status: "completed",
        location: "Fortis Hospital, Delhi"
    },
    {
        id: 3,
        doctorName: "Dr. Ananya Iyer",
        specialty: "Neurologist",
        specialtyIcon: Brain,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        time: "11:00 AM",
        status: "completed",
        location: "AIIMS, Chennai"
    },
    {
        id: 4,
        doctorName: "Dr. Vikram Patel",
        specialty: "Ophthalmologist",
        specialtyIcon: Eye,
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        time: "4:30 PM",
        status: "cancelled",
        location: "Narayana Health, Bangalore"
    }
];

// Scroll Stack Card Component
const ScrollStackCard = ({ children, index, totalCards }) => {
    const cardRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const ratio = entry.intersectionRatio;
                        setScrollProgress(ratio);
                    }
                });
            },
            {
                threshold: Array.from({ length: 20 }, (_, i) => i / 20),
                rootMargin: '-50px 0px -50px 0px'
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const scale = 0.95 + (scrollProgress * 0.05);
    const translateY = (1 - scrollProgress) * 20;
    const opacity = 0.7 + (scrollProgress * 0.3);
    const zIndex = totalCards - index;

    return (
        <div
            ref={cardRef}
            className="scroll-stack-card transition-all duration-300 ease-out"
            style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                opacity,
                zIndex,
                position: 'relative'
            }}
        >
            {children}
        </div>
    );
};

const HistoryPage = () => {
    const navigate = useNavigate();
    const { currentLang } = useLanguage();
    const t = translations[currentLang] || translations.en;

    const [reports, setReports] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [expandedReports, setExpandedReports] = useState({});
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Load from backend or use demo data
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/report/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success && response.data.history) {
                    const restored = response.data.history.map(r => ({
                        ...r,
                        icon: reportIconMap[r.iconName] || FileText,
                        abnormalValues: r.abnormalValues || [],
                        remedies: (r.remedies || []).map(rem => ({
                            ...rem,
                            icon: remedyIconMap[rem.iconName] || Leaf
                        }))
                    }));
                    setReports(restored.length > 0 ? restored : demoReports);
                } else {
                    setReports(demoReports);
                }
            } catch (error) {
                console.error("Failed to fetch report history:", error);
                setReports(demoReports);
            }
        };

        fetchHistory();

        const savedAppointments = localStorage.getItem('vaidyaai_appointments');
        if (savedAppointments) {
            try {
                const parsed = JSON.parse(savedAppointments);
                const restored = parsed.map(a => ({
                    ...a,
                    specialtyIcon: specialtyIconMap[a.specialtyIconName] || Stethoscope
                }));
                setAppointments(restored.length > 0 ? restored : demoAppointments);
            } catch {
                setAppointments(demoAppointments);
            }
        } else {
            setAppointments(demoAppointments);
        }
    }, []);

    const toggleExpand = (id) => {
        setExpandedReports(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleDeleteReport = async (reportId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/report/history/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(prev => prev.filter(r => r._id !== reportId && r.id !== reportId));
            setDeleteConfirmId(null);
        } catch (error) {
            console.error('Failed to delete report:', error);
            setDeleteConfirmId(null);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return t.today;
        if (diffDays === 1) return t.yesterday;
        if (diffDays < 0) return `${Math.abs(diffDays)} ${t.daysAgo}`;
        return `${diffDays} ${t.daysAgo}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'upcoming': return t.upcoming;
            case 'completed': return t.completed;
            case 'cancelled': return t.cancelled;
            default: return status;
        }
    };

    // Sort appointments: upcoming first, then by date
    const sortedAppointments = [...appointments].sort((a, b) => {
        if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
        if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
        return new Date(b.date) - new Date(a.date);
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-x-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 dark:bg-green-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 dark:bg-emerald-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-300 dark:bg-teal-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>



            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                {/* Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{t.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
                </div>

                {/* Reports Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t.reportsSection}</h3>
                    </div>

                    {reports.length === 0 ? (
                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-12 text-center">
                            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">{t.noReports}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reports.map((report, index) => (
                                <ScrollStackCard key={report.id} index={index} totalCards={reports.length}>
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-emerald-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500">
                                        {/* Card Header */}
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                        <SafeIcon icon={report.icon} className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg text-gray-800 dark:text-white">{report.type}</h4>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{new Date(report.date).toLocaleDateString()}</span>
                                                            <span className="text-emerald-600 dark:text-emerald-400">• {formatDate(report.date)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(report._id || report.id); }}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                                                        title={t.deleteBtn}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>

                                                    {/* Status Indicator */}
                                                    {(report.abnormalValues || []).length > 0 ? (
                                                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            <span>{report.abnormalValues.length}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm">
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span>Normal</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Summary */}
                                            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{report.summary}</p>
                                        </div>

                                        {/* Expandable Details */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedReports[report.id] ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="px-6 pb-6 space-y-4">
                                                {/* Abnormal Values */}
                                                {(report.abnormalValues || []).length > 0 && (
                                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
                                                        <h5 className="font-semibold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            {t.abnormalValues}
                                                        </h5>
                                                        <div className="space-y-2">
                                                            {(report.abnormalValues || []).map((val, idx) => (
                                                                <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-3">
                                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{val.name}</span>
                                                                    <div className="text-right">
                                                                        <span className="font-bold text-amber-600 dark:text-amber-400">{val.value}</span>
                                                                        <span className="text-xs text-gray-400 block">Normal: {val.normal}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Remedies */}
                                                {(report.remedies || []).length > 0 && (
                                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
                                                        <h5 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
                                                            <Leaf className="w-4 h-4" />
                                                            {t.remedies}
                                                        </h5>
                                                        <div className="grid gap-3">
                                                            {(report.remedies || []).map((remedy, idx) => (
                                                                <div key={idx} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-3">
                                                                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                        <SafeIcon icon={remedy.icon} className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="font-medium text-gray-800 dark:text-gray-200">{remedy.title}</h6>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{remedy.description}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expand Button */}
                                        <button
                                            onClick={() => toggleExpand(report.id)}
                                            className="w-full py-4 bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-700/50 dark:to-emerald-900/20 border-t border-emerald-100 dark:border-gray-700 flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
                                        >
                                            {expandedReports[report.id] ? (
                                                <>
                                                    <ChevronUp className="w-5 h-5" />
                                                    {t.hideDetails}
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-5 h-5" />
                                                    {t.viewDetails}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </ScrollStackCard>
                            ))}
                        </div>
                    )}
                </section>

                {/* Appointments Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t.appointmentsSection}</h3>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">{t.noAppointments}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedAppointments.map((apt, index) => (
                                <ScrollStackCard key={apt.id} index={index} totalCards={sortedAppointments.length}>
                                    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl ${apt.status === 'upcoming' ? 'border-emerald-200 dark:border-emerald-700' :
                                        apt.status === 'cancelled' ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${apt.status === 'upcoming' ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                                                    apt.status === 'cancelled' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                                                    }`}>
                                                    <SafeIcon icon={apt.specialtyIcon} className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 dark:text-white">{apt.doctorName}</h4>
                                                    <p className="text-sm text-emerald-600 dark:text-emerald-400">{apt.specialty}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{apt.location}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-800 dark:text-white">{new Date(apt.date).toLocaleDateString()}</p>
                                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 justify-end">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{apt.time}</span>
                                                </div>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 border ${getStatusColor(apt.status)}`}>
                                                    {getStatusLabel(apt.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollStackCard>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-fadeIn">
                        <div className="bg-gradient-to-r from-red-500 to-rose-500 p-5 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white">{t.deleteBtn}</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 dark:text-gray-300 mb-6">{t.deleteConfirm}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {t.deleteCancel}
                                </button>
                                <button
                                    onClick={() => handleDeleteReport(deleteConfirmId)}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                                >
                                    {t.deleteYes}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS for animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .scroll-stack-card {
                    will-change: transform, opacity;
                }
            `}</style>
        </div>
    );
};

export default HistoryPage;
