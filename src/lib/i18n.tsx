import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "mr" | "hi";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिंदी" },
];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  mr: "Marathi (मराठी)",
  hi: "Hindi (हिंदी)",
};

const KEY = "taskaura-language";

const en = {
  "nav.dashboard": "Dashboard",
  "nav.parser": "AI Task Parser",
  "nav.solver": "Daily Problem Solver",
  "nav.analytics": "Analytics",
  "action.addTask": "Add Task",
  "action.addTaskShort": "Add task",
  "theme.toLight": "Switch to light theme",
  "theme.toDark": "Switch to dark theme",
  "language.label": "Language",

  "stats.total": "Total Tasks",
  "stats.completed": "Completed Tasks",
  "stats.score": "Productivity Score",
  "stats.active": "{n} active",
  "stats.overdue": "{n} overdue",
  "stats.dailyRate": "Daily completion rate: {n}%",

  "smart.placeholder": "Finish project report by tomorrow 5pm urgent...",
  "smart.aria": "Describe a task in plain language",
  "smart.voice": "Simulate voice input",
  "smart.noDate": "No date detected",
  "smart.priority": "{p} priority",
  "smart.tip": "Tip: “Remind me to call Mom at 7pm” · press ⌘K to focus",
  "smart.added": "Parsed and added",

  "list.title": "Your Focus",
  "list.parsed": "Parsed tasks",
  "list.status.active": "active",
  "list.status.completed": "completed",
  "list.status.all": "all",
  "list.allCategories": "All categories",
  "list.anyPriority": "Any priority",
  "list.empty": "Nothing here. Type a task in the smart bar to add one.",

  "card.overdue": "overdue",
  "card.aiBreakdown": "AI Breakdown",
  "card.stepsDone": "{done}/{total} steps done",
  "card.breakdown": "Breakdown with AI",
  "card.thinking": "Thinking through the steps…",
  "card.delete": "Delete task {title}",
  "card.noDate": "No due date",

  "priority.high": "high",
  "priority.medium": "medium",
  "priority.low": "low",
  "category.Work": "Work",
  "category.Personal": "Personal",
  "category.Finance": "Finance",
  "category.Daily Problem": "Daily Problem",

  "solver.title": "Daily Problem Solver",
  "solver.subtitle": "Ask any daily problem — technical, personal or work.",
  "solver.placeholder": "Ask any daily problem (technical, personal, work)...",
  "solver.aria": "Describe your problem",
  "solver.submit": "Get a step-by-step solution",
  "solver.sample1": "WiFi not working",
  "solver.sample2": "How to prepare a presentation",
  "solver.sample3": "Laptop running slow",
  "solver.step": "Step {n}: {title}",
  "solver.recent": "Recent queries",
  "solver.none": "No queries yet.",
  "solver.remove": "Remove query {query}",
  "solver.pageSubtitle": "Technical, personal or work — describe it and get a step-by-step plan.",

  "parser.title": "AI Task Parser",
  "parser.subtitle":
    "Natural language in, structured task out — title, priority, due date and category.",
  "parser.understands": "Things it understands",

  "analytics.title": "Analytics",
  "analytics.subtitle": "How your workload is distributed right now.",
  "analytics.byCategory": "Completion by category",
  "analytics.priorityMix": "Priority mix",

  "dialog.new": "New task",
  "dialog.desc": "Set the details manually, or use the smart parser bar.",
  "dialog.title": "Title",
  "dialog.titlePlaceholder": "Prepare the quarterly review",
  "dialog.priority": "Priority",
  "dialog.category": "Category",
  "dialog.due": "Due date & time",
  "dialog.added": "Task added",
};

export type TranslationKey = keyof typeof en;

const mr: Record<TranslationKey, string> = {
  "nav.dashboard": "डॅशबोर्ड",
  "nav.parser": "एआय टास्क पार्सर",
  "nav.solver": "दैनंदिन समस्या निवारक",
  "nav.analytics": "विश्लेषण",
  "action.addTask": "कार्य जोडा",
  "action.addTaskShort": "कार्य जोडा",
  "theme.toLight": "फिकट थीमवर जा",
  "theme.toDark": "गडद थीमवर जा",
  "language.label": "भाषा",

  "stats.total": "एकूण कार्ये",
  "stats.completed": "पूर्ण झालेली कार्ये",
  "stats.score": "उत्पादकता स्कोअर",
  "stats.active": "{n} सुरू",
  "stats.overdue": "{n} मुदत उलटलेली",
  "stats.dailyRate": "दैनंदिन पूर्णता दर: {n}%",

  "smart.placeholder": "उद्या संध्याकाळी ५ वाजेपर्यंत प्रकल्प अहवाल पूर्ण करा, तातडीचे...",
  "smart.aria": "साध्या भाषेत कार्याचे वर्णन करा",
  "smart.voice": "व्हॉइस इनपुटचे अनुकरण करा",
  "smart.noDate": "तारीख आढळली नाही",
  "smart.priority": "{p} प्राधान्य",
  "smart.tip": "टीप: “संध्याकाळी ७ वाजता आईला फोन करायची आठवण दे” · ⌘K दाबा",
  "smart.added": "पार्स करून जोडले",

  "list.title": "तुमचे लक्ष",
  "list.parsed": "पार्स केलेली कार्ये",
  "list.status.active": "सुरू",
  "list.status.completed": "पूर्ण",
  "list.status.all": "सर्व",
  "list.allCategories": "सर्व श्रेणी",
  "list.anyPriority": "कोणतेही प्राधान्य",
  "list.empty": "इथे काहीच नाही. स्मार्ट बारमध्ये कार्य लिहून जोडा.",

  "card.overdue": "मुदत उलटली",
  "card.aiBreakdown": "एआय विभाजन",
  "card.stepsDone": "{done}/{total} पायऱ्या पूर्ण",
  "card.breakdown": "एआयने विभाजन करा",
  "card.thinking": "पायऱ्यांचा विचार सुरू आहे…",
  "card.delete": "{title} कार्य हटवा",
  "card.noDate": "मुदत नाही",

  "priority.high": "उच्च",
  "priority.medium": "मध्यम",
  "priority.low": "कमी",
  "category.Work": "काम",
  "category.Personal": "वैयक्तिक",
  "category.Finance": "आर्थिक",
  "category.Daily Problem": "दैनंदिन समस्या",

  "solver.title": "दैनंदिन समस्या निवारक",
  "solver.subtitle": "कोणतीही दैनंदिन समस्या विचारा — तांत्रिक, वैयक्तिक किंवा कामाची.",
  "solver.placeholder": "कोणतीही दैनंदिन समस्या विचारा (तांत्रिक, वैयक्तिक, काम)...",
  "solver.aria": "तुमच्या समस्येचे वर्णन करा",
  "solver.submit": "टप्प्याटप्प्याने उपाय मिळवा",
  "solver.sample1": "वायफाय चालत नाही",
  "solver.sample2": "सादरीकरण कसे तयार करावे",
  "solver.sample3": "लॅपटॉप हळू चालतो",
  "solver.step": "पायरी {n}: {title}",
  "solver.recent": "अलीकडील प्रश्न",
  "solver.none": "अद्याप कोणतेही प्रश्न नाहीत.",
  "solver.remove": "{query} हा प्रश्न काढा",
  "solver.pageSubtitle": "तांत्रिक, वैयक्तिक किंवा कामाची — समस्या सांगा आणि टप्प्याटप्प्याने योजना मिळवा.",

  "parser.title": "एआय टास्क पार्सर",
  "parser.subtitle": "साधी भाषा द्या, रचनाबद्ध कार्य मिळवा — शीर्षक, प्राधान्य, मुदत आणि श्रेणी.",
  "parser.understands": "हे त्याला समजते",

  "analytics.title": "विश्लेषण",
  "analytics.subtitle": "सध्या तुमचे काम कसे विभागले आहे.",
  "analytics.byCategory": "श्रेणीनुसार पूर्णता",
  "analytics.priorityMix": "प्राधान्य विभागणी",

  "dialog.new": "नवीन कार्य",
  "dialog.desc": "तपशील स्वतः भरा किंवा स्मार्ट पार्सर बार वापरा.",
  "dialog.title": "शीर्षक",
  "dialog.titlePlaceholder": "तिमाही आढावा तयार करा",
  "dialog.priority": "प्राधान्य",
  "dialog.category": "श्रेणी",
  "dialog.due": "मुदत तारीख आणि वेळ",
  "dialog.added": "कार्य जोडले",
};

const hi: Record<TranslationKey, string> = {
  "nav.dashboard": "डैशबोर्ड",
  "nav.parser": "एआई टास्क पार्सर",
  "nav.solver": "दैनिक समस्या समाधानकर्ता",
  "nav.analytics": "विश्लेषण",
  "action.addTask": "कार्य जोड़ें",
  "action.addTaskShort": "कार्य जोड़ें",
  "theme.toLight": "लाइट थीम पर जाएँ",
  "theme.toDark": "डार्क थीम पर जाएँ",
  "language.label": "भाषा",

  "stats.total": "कुल कार्य",
  "stats.completed": "पूर्ण कार्य",
  "stats.score": "उत्पादकता स्कोर",
  "stats.active": "{n} सक्रिय",
  "stats.overdue": "{n} विलंबित",
  "stats.dailyRate": "दैनिक पूर्णता दर: {n}%",

  "smart.placeholder": "कल शाम 5 बजे तक प्रोजेक्ट रिपोर्ट पूरी करें, ज़रूरी...",
  "smart.aria": "सरल भाषा में कार्य बताएं",
  "smart.voice": "वॉइस इनपुट का अनुकरण करें",
  "smart.noDate": "कोई तारीख नहीं मिली",
  "smart.priority": "{p} प्राथमिकता",
  "smart.tip": "सुझाव: “शाम 7 बजे माँ को कॉल करने की याद दिलाएँ” · ⌘K दबाएँ",
  "smart.added": "पार्स करके जोड़ा गया",

  "list.title": "आपका फोकस",
  "list.parsed": "पार्स किए गए कार्य",
  "list.status.active": "सक्रिय",
  "list.status.completed": "पूर्ण",
  "list.status.all": "सभी",
  "list.allCategories": "सभी श्रेणियाँ",
  "list.anyPriority": "कोई भी प्राथमिकता",
  "list.empty": "यहाँ कुछ नहीं है। स्मार्ट बार में कार्य लिखकर जोड़ें।",

  "card.overdue": "विलंबित",
  "card.aiBreakdown": "एआई ब्रेकडाउन",
  "card.stepsDone": "{done}/{total} चरण पूरे",
  "card.breakdown": "एआई से ब्रेकडाउन करें",
  "card.thinking": "चरणों पर विचार हो रहा है…",
  "card.delete": "{title} कार्य हटाएँ",
  "card.noDate": "कोई नियत तिथि नहीं",

  "priority.high": "उच्च",
  "priority.medium": "मध्यम",
  "priority.low": "कम",
  "category.Work": "काम",
  "category.Personal": "व्यक्तिगत",
  "category.Finance": "वित्त",
  "category.Daily Problem": "दैनिक समस्या",

  "solver.title": "दैनिक समस्या समाधानकर्ता",
  "solver.subtitle": "कोई भी दैनिक समस्या पूछें — तकनीकी, व्यक्तिगत या काम से जुड़ी।",
  "solver.placeholder": "कोई भी दैनिक समस्या पूछें (तकनीकी, व्यक्तिगत, काम)...",
  "solver.aria": "अपनी समस्या बताएं",
  "solver.submit": "चरण-दर-चरण समाधान पाएं",
  "solver.sample1": "वाईफाई काम नहीं कर रहा",
  "solver.sample2": "प्रेजेंटेशन कैसे तैयार करें",
  "solver.sample3": "लैपटॉप धीमा चल रहा है",
  "solver.step": "चरण {n}: {title}",
  "solver.recent": "हाल के प्रश्न",
  "solver.none": "अभी कोई प्रश्न नहीं।",
  "solver.remove": "{query} प्रश्न हटाएँ",
  "solver.pageSubtitle": "तकनीकी, व्यक्तिगत या काम — समस्या बताएं और चरण-दर-चरण योजना पाएं।",

  "parser.title": "एआई टास्क पार्सर",
  "parser.subtitle": "सरल भाषा दें, संरचित कार्य पाएं — शीर्षक, प्राथमिकता, नियत तिथि और श्रेणी।",
  "parser.understands": "यह क्या-क्या समझता है",

  "analytics.title": "विश्लेषण",
  "analytics.subtitle": "अभी आपका कार्यभार कैसे बँटा है।",
  "analytics.byCategory": "श्रेणी अनुसार पूर्णता",
  "analytics.priorityMix": "प्राथमिकता वितरण",

  "dialog.new": "नया कार्य",
  "dialog.desc": "विवरण स्वयं भरें, या स्मार्ट पार्सर बार का उपयोग करें।",
  "dialog.title": "शीर्षक",
  "dialog.titlePlaceholder": "तिमाही समीक्षा तैयार करें",
  "dialog.priority": "प्राथमिकता",
  "dialog.category": "श्रेणी",
  "dialog.due": "नियत तिथि और समय",
  "dialog.added": "कार्य जोड़ा गया",
};

const DICTS: Record<Language, Record<TranslationKey, string>> = { en, mr, hi };

type Vars = Record<string, string | number>;

interface I18nValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey, vars?: Vars) => string;
}

const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => en[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as Language | null;
    if (stored && stored in DICTS) setLang(stored);
  }, []);

  const update = useCallback((l: Language) => {
    setLang(l);
    window.localStorage.setItem(KEY, l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Vars) => {
      const raw = DICTS[lang][key] ?? en[key] ?? key;
      if (!vars) return raw;
      return raw.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang: update, t }), [lang, update, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
