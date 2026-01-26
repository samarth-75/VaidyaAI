import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Shield, Languages, Heart, Brain, FileText, Eye, Volume2, ArrowRight } from 'lucide-react';

const translations = {
  en: {
    hero_title: "Making medical reports simple, clear, and understandable for everyone.",
    hero_subtitle: "Upload your medical report and receive a clear, easy-to-understand explanation in your language. No medical jargon, just clarity.",
    cta_primary: "Upload Medical Report",
    cta_secondary: "See How It Works",
    process_title: "From Confusion to Clarity",
    process_step1: "Complex Medical Report",
    process_step2: "AI Analysis",
    process_step3: "Simple Explanation",
    audio_title: "Listen to Your Report",
    audio_subtitle: "Audio explanations for elderly and visually impaired users",
    audio_cta: "Play Demo",
    trust_title: "Your Health, Your Understanding",
    trust_point1: "No Diagnosis Given",
    trust_desc1: "We explain your reports, never diagnose conditions",
    trust_point2: "No Prescriptions",
    trust_desc2: "We don't replace your doctor, we help you understand them",
    trust_point3: "Complete Privacy",
    trust_desc3: "Your medical data is encrypted and never shared",
    footer_note: "वैद्यAI is an educational tool. Always consult qualified healthcare professionals for medical advice."
  },
  hi: {
    hero_title: "मेडिकल रिपोर्ट को सरल, स्पष्ट और सभी के लिए समझने योग्य बनाना।",
    hero_subtitle: "अपनी मेडिकल रिपोर्ट अपलोड करें और अपनी भाषा में एक स्पष्ट, आसानी से समझ में आने वाला विवरण प्राप्त करें। कोई मेडिकल शब्दजाल नहीं, बस स्पष्टता।",
    cta_primary: "मेडिकल रिपोर्ट अपलोड करें",
    cta_secondary: "यह कैसे काम करता है",
    process_title: "भ्रम से स्पष्टता तक",
    process_step1: "जटिल मेडिकल रिपोर्ट",
    process_step2: "AI विश्लेषण",
    process_step3: "सरल व्याख्या",
    audio_title: "अपनी रिपोर्ट सुनें",
    audio_subtitle: "बुजुर्गों और दृष्टिबाधित उपयोगकर्ताओं के लिए ऑडियो व्याख्या",
    audio_cta: "डेमो चलाएं",
    trust_title: "आपका स्वास्थ्य, आपकी समझ",
    trust_point1: "कोई निदान नहीं",
    trust_desc1: "हम आपकी रिपोर्ट समझाते हैं, कभी बीमारी का निदान नहीं करते",
    trust_point2: "कोई नुस्खा नहीं",
    trust_desc2: "हम आपके डॉक्टर की जगह नहीं लेते, आपको उन्हें समझने में मदद करते हैं",
    trust_point3: "पूर्ण गोपनीयता",
    trust_desc3: "आपका मेडिकल डेटा एन्क्रिप्टेड है और कभी साझा नहीं किया जाता",
    footer_note: "वैद्यAI एक शैक्षिक उपकरण है। चिकित्सा सलाह के लिए हमेशा योग्य स्वास्थ्य पेशेवरों से परामर्श करें।"
  },
  mr: {
    hero_title: "वैद्यकीय अहवाल सोपे, स्पष्ट आणि प्रत्येकासाठी समजण्यायोग्य बनवणे.",
    hero_subtitle: "तुमचा वैद्यकीय अहवाल अपलोड करा आणि तुमच्या भाषेत एक स्पष्ट, सहज समजणारे स्पष्टीकरण मिळवा. वैद्यकीय शब्दजाल नाही, फक्त स्पष्टता.",
    cta_primary: "वैद्यकीय अहवाल अपलोड करा",
    cta_secondary: "हे कसे कार्य करते ते पहा",
    process_title: "संभ्रमापासून स्पष्टतेपर्यंत",
    process_step1: "जटिल वैद्यकीय अहवाल",
    process_step2: "AI विश्लेषण",
    process_step3: "सोपे स्पष्टीकरण",
    audio_title: "तुमचा अहवाल ऐका",
    audio_subtitle: "वृद्ध आणि दृष्टीदोष असलेल्या वापरकर्त्यांसाठी ऑडिओ स्पष्टीकरण",
    audio_cta: "डेमो चालवा",
    trust_title: "तुमचे आरोग्य, तुमची समज",
    trust_point1: "निदान नाही",
    trust_desc1: "आम्ही तुमचा अहवाल समजावतो, कधीही रोगनिदान करत नाही",
    trust_point2: "औषधोपचार नाही",
    trust_desc2: "आम्ही तुमच्या डॉक्टरांची जागा घेत नाही, तुम्हाला त्यांना समजण्यास मदत करतो",
    trust_point3: "संपूर्ण गोपनीयता",
    trust_desc3: "तुमचा वैद्यकीय डेटा एन्क्रिप्टेड आहे आणि कधीही शेअर केला जात नाही",
    footer_note: "वैद्यAI हे एक शैक्षणिक साधन आहे. वैद्यकीय सल्ल्यासाठी नेहमी पात्र आरोग्य व्यावसायिकांचा सल्ला घ्या."
  },
  ta: {
    hero_title: "மருத்துவ அறிக்கைகளை எளிமையாகவும், தெளிவாகவும், அனைவருக்கும் புரியும்படியாகவும் செய்தல்.",
    hero_subtitle: "உங்கள் மருத்துவ அறிக்கையைப் பதிவேற்றி, உங்கள் மொழியில் தெளிவான, எளிதில் புரிந்துகொள்ளக்கூடிய விளக்கத்தைப் பெறுங்கள். மருத்துவச் சொற்கள் இல்லை, வெறும் தெளிவு மட்டுமே.",
    cta_primary: "மருத்துவ அறிக்கையைப் பதிவேற்றவும்",
    cta_secondary: "இது எப்படி வேலை செய்கிறது என்பதைப் பார்க்கவும்",
    process_title: "குழப்பத்திலிருந்து தெளிவுக்கு",
    process_step1: "சிக்கலான மருத்துவ அறிக்கை",
    process_step2: "AI பகுப்பாய்வு",
    process_step3: "எளிய விளக்கம்",
    audio_title: "உங்கள் அறிக்கையைக் கேளுங்கள்",
    audio_subtitle: "வயதானவர்கள் மற்றும் பார்வையற்ற பயனர்களுக்கான ஆடியோ விளக்கங்கள்",
    audio_cta: "டெமோவை இயக்கவும்",
    trust_title: "உங்கள் ஆரோக்கியம், உங்கள் புரிதல்",
    trust_point1: "நோய்க்குறி இல்லை",
    trust_desc1: "நாங்கள் உங்கள் அறிக்கையை விளக்குகிறோம், நோயைக் கண்டறிவதில்லை",
    trust_point2: "மருந்து பரிந்துரை இல்லை",
    trust_desc2: "நாங்கள் உங்கள் மருத்துவரை மாற்றவில்லை, அவர்களைப் புரிந்துகொள்ள உதவுகிறோம்",
    trust_point3: "முழுமையான தனியுரிமை",
    trust_desc3: "உங்கள் மருத்துவ தரவுகள் குறியாக்கம் செய்யப்பட்டுள்ளது, பகிரப்படுவதில்லை",
    footer_note: "வைத்யAI ஒரு கல்வி கருவி. மருத்துவ ஆலோசனைக்கு எப்போதும் தகுதிவாய்ந்த சுகாதார நிபுணர்களை அணுகவும்."
  },
  te: {
    hero_title: "వైద్య నివేదికలను సరళంగా, స్పష్టంగా మరియు అందరికీ అర్థమయ్యేలా చేయడం.",
    hero_subtitle: "మీ వైద్య నివేదికను అప్‌లోడ్ చేసి, మీ భాషలో స్పష్టమైన, సులభంగా అర్థమయ్యే వివరణను పొందండి. వైద్య పరిభాష లేదు, కేవలం స్పష్టత మాత్రమే.",
    cta_primary: "వైద్య నివేదికను అప్‌లోడ్ చేయండి",
    cta_secondary: "ఇది ఎలా పనిచేస్తుందో చూడండి",
    process_title: "గందరగోళం నుండి స్పష్టతకు",
    process_step1: "సంక్లిష్ట వైద్య నివేదిక",
    process_step2: "AI విశ్లేషణ",
    process_step3: "సరళ వివరణ",
    audio_title: "మీ నివేదికను వినండి",
    audio_subtitle: "వృద్ధులు మరియు దృష్టి లోపం ఉన్న వినియోగదారుల కోసం ఆడియో వివరణలు",
    audio_cta: "డెమో ప్లే చేయండి",
    trust_title: "మీ ఆరోగ్యం, మీ అవగాహన",
    trust_point1: "రోగ నిర్ధారణ లేదు",
    trust_desc1: "మేము మీ నివేదికను వివరిస్తాము, ఎప్పుడూ రోగాన్ని నిర్ధారించము",
    trust_point2: "మందుల సూచనలు లేవు",
    trust_desc2: "మేము మీ వైద్యుడి స్థానంలో లేము, వారిని అర్థం చేసుకోవడంలో మీకు సహాయం చేస్తాము",
    trust_point3: "పూర్తి గోప్యత",
    trust_desc3: "మీ వైద్య డేటా ఎన్‌క్రిప్ట్ చేయబడింది మరియు ఎప్పుడూ భాగస్వామ్యం చేయబడదు",
    footer_note: "వైద్యAI ఒక విద్యా సాధనం. వైద్య సలహా కోసం ఎల్లప్పుడూ అర్హత కలిగిన ఆరోగ్య నిపుణులను సంప్రదించండి."
  },
  bn: {
    hero_title: "চিকিৎসা রিপোর্টগুলি সহজ, স্পষ্ট এবং সবার জন্য বোধগম্য করা।",
    hero_subtitle: "আপনার চিকিৎসা রিপোর্ট আপলোড করুন এবং আপনার ভাষায় একটি স্পষ্ট, সহজে বোধগম্য ব্যাখ্যা পান। কোনো চিকিৎসা পরিভাষা নেই, শুধু স্পষ্টতা।",
    cta_primary: "চিকিৎসা রিপোর্ট আপলোড করুন",
    cta_secondary: "এটি কীভাবে কাজ করে দেখুন",
    process_title: "বিভ্রান্তি থেকে স্পষ্টতায়",
    process_step1: "জটিল চিকিৎসা রিপোর্ট",
    process_step2: "AI বিশ্লেষণ",
    process_step3: "সহজ ব্যাখ্যা",
    audio_title: "আপনার রিপোর্ট শুনুন",
    audio_subtitle: "বয়স্ক এবং দৃষ্টি প্রতিবন্ধী ব্যবহারকারীদের জন্য অডিও ব্যাখ্যা",
    audio_cta: "ডেমো চালান",
    trust_title: "আপনার স্বাস্থ্য, আপনার বোঝাপড়া",
    trust_point1: "কোনো রোগ নির্ণয় নেই",
    trust_desc1: "আমরা আপনার রিপোর্ট ব্যাখ্যা করি, কখনো রোগ নির্ণয় করি না",
    trust_point2: "কোনো প্রেসক্রিপশন নেই",
    trust_desc2: "আমরা আপনার ডাক্তারের জায়গা নিই না, আপনাকে তাদের বুঝতে সাহায্য করি",
    trust_point3: "সম্পূর্ণ গোপনীয়তা",
    trust_desc3: "আপনার চিকিৎসা তথ্য এনক্রিপ্ট করা এবং কখনো শেয়ার করা হয় না",
    footer_note: "वैद्यAI একটি শিক্ষামূলক সরঞ্জাম। চিকিৎসা পরামর্শের জন্য সর্বদা যোগ্য স্বাস্থ্যসেবা পেশাদারদের পরামর্শ নিন।"
  },
  gu: {
    hero_title: "તબીબી અહેવાલોને સરળ, સ્પષ્ટ અને દરેક માટે સમજી શકાય તેવા બનાવવું.",
    hero_subtitle: "તમારો તબીબી અહેવાલ અપલોડ કરો અને તમારી ભાષામાં સ્પષ્ટ, સરળતાથી સમજી શકાય તેવું સમજૂતી મેળવો. કોઈ તબીબી શબ્દજાળ નહીં, ફક્ત સ્પષ્ટતા.",
    cta_primary: "તબીબી અહેવાલ અપલોડ કરો",
    cta_secondary: "તે કેવી રીતે કાર્ય કરે છે તે જુઓ",
    process_title: "મૂંઝવણથી સ્પષ્ટતા સુધી",
    process_step1: "જટિલ તબીબી અહેવાલ",
    process_step2: "AI વિશ્લેષણ",
    process_step3: "સરળ સમજૂતી",
    audio_title: "તમારો અહેવાલ સાંભળો",
    audio_subtitle: "વૃદ્ધો અને દૃષ્ટિહીન વપરાશકર્તાઓ માટે ઑડિયો સમજૂતીઓ",
    audio_cta: "ડેમો ચલાવો",
    trust_title: "તમારું સ્વાસ્થ્ય, તમારી સમજ",
    trust_point1: "કોઈ નિદાન નથી",
    trust_desc1: "અમે તમારા અહેવાલને સમજાવીએ છીએ, ક્યારેય રોગનું નિદાન કરતા નથી",
    trust_point2: "કોઈ પ્રિસ્ક્રિપ્શન નથી",
    trust_desc2: "અમે તમારા ડૉક્ટરની જગ્યા લેતા નથી, તમને તેમને સમજવામાં મદદ કરીએ છીએ",
    trust_point3: "સંપૂર્ણ ગોપનીયતા",
    trust_desc3: "તમારો તબીબી ડેટા એન્ક્રિપ્ટેડ છે અને ક્યારેય શેર કરવામાં આવતો નથી",
    footer_note: "वैद्यAI એક શૈક્ષણિક સાધન છે. તબીબી સલાહ માટે હંમેશા લાયક આરોગ્ય વ્યાવસાયિકોની સલાહ લો."
  },
  kn: {
    hero_title: "ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ಸರಳ, ಸ್ಪಷ್ಟ ಮತ್ತು ಎಲ್ಲರಿಗೂ ಅರ್ಥವಾಗುವಂತೆ ಮಾಡುವುದು.",
    hero_subtitle: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸ್ಪಷ್ಟವಾದ, ಸುಲಭವಾಗಿ ಅರ್ಥವಾಗುವ ವಿವರಣೆಯನ್ನು ಪಡೆಯಿರಿ. ವೈದ್ಯಕೀಯ ಪರಿಭಾಷೆ ಇಲ್ಲ, ಕೇವಲ ಸ್ಪಷ್ಟತೆ ಮಾತ್ರ.",
    cta_primary: "ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ಅಪ್‌లೋಡ್ ಮಾಡಿ",
    cta_secondary: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ಎಂಬುದನ್ನು ನೋಡಿ",
    process_title: "ಗೊಂದಲದಿಂದ ಸ್ಪಷ್ಟತೆಗೆ",
    process_step1: "ಸಂಕೀರ್ಣ ವೈದ್ಯಕೀಯ ವರದಿ",
    process_step2: "AI ವಿಶ್ಲೇಷಣೆ",
    process_step3: "ಸರಳ ವಿವರಣೆ",
    audio_title: "ನಿಮ್ಮ ವರದಿಯನ್ನು ಕೇಳಿ",
    audio_subtitle: "ವಯಸ್ಸಾದವರು ಮತ್ತು ದೃಷ್ಟಿಹೀನ ಬಳಕೆದಾರರಿಗಾಗಿ ಆಡಿಯೋ ವಿವರಣೆಗಳು",
    audio_cta: "ಡೆಮೋ ಪ್ಲೇ ಮಾಡಿ",
    trust_title: "ನಿಮ್ಮ ಆರೋಗ್ಯ, ನಿಮ್ಮ ತಿಳುವಳಿಕೆ",
    trust_point1: "ರೋಗನಿರ್ಣಯ ಇಲ್ಲ",
    trust_desc1: "ನಾವು ನಿಮ್ಮ ವರದಿಯನ್ನು ವಿವರಿಸುತ್ತೇವೆ, ಎಂದಿಗೂ ರೋಗನಿರ್ಣಯ ಮಾಡುವುದಿಲ್ಲ",
    trust_point2: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಇಲ್ಲ",
    trust_desc2: "ನಾವು ನಿಮ್ಮ ವೈದ್ಯರ ಸ್ಥಾನವನ್ನು ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ, ಅವರನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ",
    trust_point3: "ಸಂಪೂರ್ಣ ಗೌಪ್ಯತೆ",
    trust_desc3: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದತ್ತಾಂಶವನ್ನು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಲಾಗುವುದಿಲ್ಲ",
    footer_note: "वैद्यAI ಒಂದು ಶೈಕ್ಷಣಿಕ ಸಾಧನ. ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾಗಿ ಯಾವಾಗಲೂ ಅರ್ಹ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ."
  }
};

const LandingPage = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [logoText, setLogoText] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const t = translations[currentLang];

  // Continuous typewriter effect for logo
  useEffect(() => {
    const fullText = 'वैद्यAI';
    let index = 0;
    let isDeleting = false;
    let pauseCount = 0;

    const typeEffect = () => {
      if (!isDeleting && index <= fullText.length) {
        setLogoText(fullText.slice(0, index));
        index++;
        
        if (index > fullText.length) {
          pauseCount = 20; // Pause at full text
          isDeleting = true;
        }
      } else if (isDeleting) {
        if (pauseCount > 0) {
          pauseCount--;
        } else {
          setLogoText(fullText.slice(0, index));
          index--;
          
          if (index === 0) {
            isDeleting = false;
            pauseCount = 10; // Pause before restarting
          }
        }
      }
    };

    const interval = setInterval(typeEffect, 150);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3D Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let rotation = 0;
    const particles = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width / 2,
        y: Math.random() * canvas.height / 2,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      
      // Draw floating particles
      particles.forEach(p => {
        ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width / 2) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height / 2) p.speedY *= -1;
      });

      // Draw rotating 3D-ish medical report
      rotation += 0.01;
      const centerX = canvas.width / 4;
      const centerY = canvas.height / 4;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      // Document shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(-85, -115, 170, 230);
      
      // Document
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(-80, -120, 160, 220);
      
      // Document lines
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.lineWidth = 2;
      for (let i = -80; i < 80; i += 20) {
        ctx.beginPath();
        ctx.moveTo(-60, i);
        ctx.lineTo(60, i);
        ctx.stroke();
      }
      
      // Heart icon on document
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.beginPath();
      ctx.arc(-15, -40, 10, 0, Math.PI * 2);
      ctx.arc(15, -40, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-25, -35);
      ctx.lineTo(0, -10);
      ctx.lineTo(25, -35);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold py-1">
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent py-2" style={{ fontFamily: 'Georgia, serif' }}>
              {logoText}
              <span className="inline-block w-0.5 h-8 bg-green-600 ml-1 animate-pulse"></span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-green-600" />
            <select 
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-white border-2 border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div 
            className="space-y-6"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              {t.hero_title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t.hero_subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => {
                window.location.href = "/main";
              }} className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Upload className="w-5 h-5" />
                {t.cta_primary}
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-green-50 transition-all duration-300">
                {t.cta_secondary}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right 3D Canvas */}
          <div 
            className="relative h-[500px]"
            style={{
              transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px) translateY(${scrollY * 0.1}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <canvas 
              ref={canvasRef}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100/20 to-transparent rounded-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            {t.process_title}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: t.process_step1, color: 'from-red-500 to-orange-500' },
              { icon: Brain, title: t.process_step2, color: 'from-green-500 to-emerald-500' },
              { icon: Heart, title: t.process_step3, color: 'from-emerald-500 to-teal-500' }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="relative group"
                style={{
                  transform: `translateY(${scrollY * 0.05 * (idx + 1)}px)`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col items-center text-center group-hover:scale-105">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  {idx < 2 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-green-300" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audio Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 mb-8 shadow-lg">
            <Volume2 className="w-6 h-6 text-green-600" />
            <Eye className="w-6 h-6 text-emerald-600" />
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {t.audio_title}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t.audio_subtitle}
          </p>
          
          <button className="bg-white border-2 border-green-600 text-green-600 px-10 py-4 rounded-full font-semibold flex items-center justify-center gap-3 mx-auto hover:bg-green-50 transition-all duration-300 hover:scale-105">
            <Play className="w-6 h-6" />
            {t.audio_cta}
          </button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            {t.trust_title}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t.trust_point1, desc: t.trust_desc1, icon: Shield, color: 'bg-green-100 text-green-600' },
              { title: t.trust_point2, desc: t.trust_desc2, icon: Heart, color: 'bg-emerald-100 text-emerald-600' },
              { title: t.trust_point3, desc: t.trust_desc3, icon: Eye, color: 'bg-teal-100 text-teal-600' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-green-900 to-emerald-800 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg leading-relaxed opacity-90">
            {t.footer_note}
          </p>
          <div className="mt-8 pt-8 border-t border-green-700">
            <p className="text-3xl font-bold bg-gradient-to-r from-green-200 to-emerald-300 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
              वैद्यAI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;