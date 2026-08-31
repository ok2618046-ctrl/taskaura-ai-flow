import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const LANGS = ["en", "mr", "hi"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  mr: "मराठी",
  hi: "हिंदी",
};

export const LANG_NAMES_EN: Record<Lang, string> = {
  en: "English",
  mr: "Marathi (मराठी)",
  hi: "Hindi (हिंदी)",
};

export const LANG_LOCALES: Record<Lang, string> = {
  en: "en-IN",
  mr: "mr-IN",
  hi: "hi-IN",
};

const STORAGE_KEY = "taskaura-lang";

type Dict = Record<string, string>;

const en = {
  "nav.dashboard": "Dashboard",
  "nav.parser": "AI Task Parser",
  "nav.solver": "Daily Problem Solver",
  "nav.analytics": "Analytics",
  "nav.addTask": "Add Task",
  "nav.language": "Language",
  "nav.themeToDark": "Switch to dark theme",
  "nav.themeToLight": "Switch to light theme",

  "priority.high": "high",
  "priority.medium": "medium",
  "priority.low": "low",
  "category.Work": "Work",
  "category.Personal": "Personal",
  "category.Finance": "Finance",
  "category.Daily Problem": "Daily Problem",

  "stats.total": "Total Tasks",
  "stats.active": "{n} active",
  "stats.completed": "Completed Tasks",
  "stats.overdue": "{n} overdue",
  "stats.score": "Productivity Score",
  "stats.rate": "Daily completion rate: {n}%",

  "input.placeholder": "Finish project report by tomorrow 5pm urgent...",
  "input.aria": "Describe a task in plain language",
  "input.voice": "Simulate voice input",
  "input.noDate": "No date detected",
  "input.priorityChip": "{p} priority",
  "input.add": "Add task",
  "input.tip": "Tip: “Remind me to call Mom at 7pm” · press ⌘K to focus",
  "input.added": "Parsed and added",

  "list.title": "Your Focus",
  "list.parsed": "Parsed tasks",
  "list.active": "active",
  "list.completed": "completed",
  "list.all": "all",
  "list.allCategories": "All categories",
  "list.anyPriority": "Any priority",
  "list.empty": "Nothing here. Type a task in the smart bar to add one.",

  "task.overdue": "overdue",
  "task.noDate": "No date",
  "task.today": "Today",
  "task.tomorrow": "Tomorrow",
  "task.breakdown": "Breakdown with AI",
  "task.breakdownLoading": "Thinking through the steps…",
  "task.aiBreakdown": "AI Breakdown",
  "task.stepsDone": "{a}/{b} steps done",
  "task.delete": "Delete task",

  "dialog.title": "New task",
  "dialog.description": "Set the details manually, or use the smart parser bar.",
  "dialog.titleLabel": "Title",
  "dialog.titlePlaceholder": "Prepare the quarterly review",
  "dialog.priority": "Priority",
  "dialog.category": "Category",
  "dialog.due": "Due date & time",
  "dialog.submit": "Add task",
  "dialog.added": "Task added",

  "solver.title": "Daily Problem Solver",
  "solver.subtitle": "Ask any daily problem — technical, personal or work.",
  "solver.placeholder": "Ask any daily problem (technical, personal, work)...",
  "solver.aria": "Describe your problem",
  "solver.submit": "Get a step-by-step solution",
  "solver.sample1": "WiFi not working",
  "solver.sample2": "How to prepare a presentation",
  "solver.sample3": "Laptop running slow",
  "solver.recent": "Recent queries",
  "solver.noQueries": "No queries yet.",
  "solver.step": "Step {n}",
  "solver.remove": "Remove query",
  "solver.pageSubtitle": "Technical, personal or work — describe it and get a step-by-step plan.",

  "parser.title": "AI Task Parser",
  "parser.subtitle": "Natural language in, structured task out — title, priority, due date and category.",
  "parser.understands": "Things it understands",

  "analytics.title": "Analytics",
  "analytics.subtitle": "How your workload is distributed right now.",
  "analytics.byCategory": "Completion by category",
  "analytics.priorityMix": "Priority mix",
} satisfies Dict;

export type TKey = keyof typeof en;

const mr: Record<TKey, string> = {
  "nav.dashboard": "डॅशबोर्ड",
  "nav.parser": "एआय टास्क पार्सर",
  "nav.solver": "दैनंदिन समस्या निवारक",
  "nav.analytics": "विश्लेषण",
  "nav.addTask": "कार्य जोडा",
  "nav.language": "भाषा",
  "nav.themeToDark": "गडद थीमवर जा",
  "nav.themeToLight": "फिकट थीमवर जा",

  "priority.high": "उच्च",
  "priority.medium": "मध्यम",
  "priority.low": "कमी",
  "category.Work": "काम",
  "category.Personal": "वैयक्तिक",
  "category.Finance": "आर्थिक",
  "category.Daily Problem": "दैनंदिन समस्या",

  "stats.total": "एकूण कार्ये",
  "stats.active": "{n} सुरू",
  "stats.completed": "पूर्ण झालेली कार्ये",
  "stats.overdue": "{n} मुदत उलटलेली",
  "stats.score": "उत्पादकता गुण",
  "stats.rate": "दैनंदिन पूर्णत्व दर: {n}%",

  "input.placeholder": "उद्या संध्याकाळी ५ वाजेपर्यंत प्रकल्प अहवाल पूर्ण करा, तातडीचे...",
  "input.aria": "साध्या भाषेत कार्य लिहा",
  "input.voice": "व्हॉइस इनपुटचे अनुकरण करा",
  "input.noDate": "तारीख आढळली नाही",
  "input.priorityChip": "{p} प्राधान्य",
  "input.add": "कार्य जोडा",
  "input.tip": "टीप: “संध्याकाळी ७ वाजता आईला फोन करण्याची आठवण कर” · फोकससाठी ⌘K दाबा",
  "input.added": "पार्स करून जोडले",

  "list.title": "तुमचे लक्ष",
  "list.parsed": "पार्स केलेली कार्ये",
  "list.active": "सुरू",
  "list.completed": "पूर्ण",
  "list.all": "सर्व",
  "list.allCategories": "सर्व श्रेणी",
  "list.anyPriority": "कोणतेही प्राधान्य",
  "list.empty": "इथे काहीच नाही. स्मार्ट बारमध्ये कार्य लिहून जोडा.",

  "task.overdue": "मुदत उलटली",
  "task.noDate": "तारीख नाही",
  "task.today": "आज",
  "task.tomorrow": "उद्या",
  "task.breakdown": "एआयने विभागणी करा",
  "task.breakdownLoading": "पायऱ्यांचा विचार करत आहे…",
  "task.aiBreakdown": "एआय विभागणी",
  "task.stepsDone": "{a}/{b} पायऱ्या पूर्ण",
  "task.delete": "कार्य हटवा",

  "dialog.title": "नवीन कार्य",
  "dialog.description": "तपशील स्वतः भरा, किंवा स्मार्ट पार्सर बार वापरा.",
  "dialog.titleLabel": "शीर्षक",
  "dialog.titlePlaceholder": "तिमाही आढाव्याची तयारी करा",
  "dialog.priority": "प्राधान्य",
  "dialog.category": "श्रेणी",
  "dialog.due": "अंतिम तारीख आणि वेळ",
  "dialog.submit": "कार्य जोडा",
  "dialog.added": "कार्य जोडले",

  "solver.title": "दैनंदिन समस्या निवारक",
  "solver.subtitle": "कोणतीही दैनंदिन समस्या विचारा — तांत्रिक, वैयक्तिक किंवा कामाची.",
  "solver.placeholder": "कोणतीही दैनंदिन समस्या विचारा (तांत्रिक, वैयक्तिक, काम)...",
  "solver.aria": "तुमची समस्या सांगा",
  "solver.submit": "टप्प्याटप्प्याने उपाय मिळवा",
  "solver.sample1": "वायफाय चालत नाही",
  "solver.sample2": "सादरीकरणाची तयारी कशी करावी",
  "solver.sample3": "लॅपटॉप हळू चालतो",
  "solver.recent": "अलीकडील प्रश्न",
  "solver.noQueries": "अजून कोणतेही प्रश्न नाहीत.",
  "solver.step": "पायरी {n}",
  "solver.remove": "प्रश्न काढून टाका",
  "solver.pageSubtitle": "तांत्रिक, वैयक्तिक किंवा कामाची — सांगा आणि टप्प्याटप्प्याने योजना मिळवा.",

  "parser.title": "एआय टास्क पार्सर",
  "parser.subtitle": "साधी भाषा आत, रचनाबद्ध कार्य बाहेर — शीर्षक, प्राधान्य, अंतिम तारीख आणि श्रेणी.",
  "parser.understands": "हे समजते",

  "analytics.title": "विश्लेषण",
  "analytics.subtitle": "तुमचा कामाचा भार सध्या कसा विभागलेला आहे.",
  "analytics.byCategory": "श्रेणीनुसार पूर्णत्व",
  "analytics.priorityMix": "प्राधान्य मिश्रण",
};

const hi: Record<TKey, string> = {
  "nav.dashboard": "डैशबोर्ड",
  "nav.parser": "एआई टास्क पार्सर",
  "nav.solver": "दैनिक समस्या समाधानकर्ता",
  "nav.analytics": "विश्लेषण",
  "nav.addTask": "कार्य जोड़ें",
  "nav.language": "भाषा",
  "nav.themeToDark": "डार्क थीम पर जाएँ",
  "nav.themeToLight": "लाइट थीम पर जाएँ",

  "priority.high": "उच्च",
  "priority.medium": "मध्यम",
  "priority.low": "कम",
  "category.Work": "काम",
  "category.Personal": "व्यक्तिगत",
  "category.Finance": "वित्त",
  "category.Daily Problem": "दैनिक समस्या",

  "stats.total": "कुल कार्य",
  "stats.active": "{n} सक्रिय",
  "stats.completed": "पूर्ण कार्य",
  "stats.overdue": "{n} विलंबित",
  "stats.score": "उत्पादकता स्कोर",
  "stats.rate": "दैनिक पूर्णता दर: {n}%",

  "input.placeholder": "कल शाम 5 बजे तक प्रोजेक्ट रिपोर्ट पूरी करें, ज़रूरी...",
  "input.aria": "सरल भाषा में कार्य लिखें",
  "input.voice": "वॉइस इनपुट का अनुकरण करें",
  "input.noDate": "कोई तारीख नहीं मिली",
  "input.priorityChip": "{p} प्राथमिकता",
  "input.add": "कार्य जोड़ें",
  "input.tip": "सुझाव: “शाम 7 बजे माँ को फ़ोन करने की याद दिलाएँ” · फ़ोकस के लिए ⌘K दबाएँ",
  "input.added": "पार्स करके जोड़ा गया",

  "list.title": "आपका फ़ोकस",
  "list.parsed": "पार्स किए गए कार्य",
  "list.active": "सक्रिय",
  "list.completed": "पूर्ण",
  "list.all": "सभी",
  "list.allCategories": "सभी श्रेणियाँ",
  "list.anyPriority": "कोई भी प्राथमिकता",
  "list.empty": "यहाँ कुछ नहीं है। स्मार्ट बार में कार्य लिखकर जोड़ें।",

  "task.overdue": "विलंबित",
  "task.noDate": "कोई तारीख नहीं",
  "task.today": "आज",
  "task.tomorrow": "कल",
  "task.breakdown": "एआई से विभाजन करें",
  "task.breakdownLoading": "चरणों पर विचार किया जा रहा है…",
  "task.aiBreakdown": "एआई विभाजन",
  "task.stepsDone": "{a}/{b} चरण पूर्ण",
  "task.delete": "कार्य हटाएँ",

  "dialog.title": "नया कार्य",
  "dialog.description": "विवरण स्वयं भरें, या स्मार्ट पार्सर बार का उपयोग करें।",
  "dialog.titleLabel": "शीर्षक",
  "dialog.titlePlaceholder": "तिमाही समीक्षा की तैयारी करें",
  "dialog.priority": "प्राथमिकता",
  "dialog.category": "श्रेणी",
  "dialog.due": "नियत तारीख और समय",
  "dialog.submit": "कार्य जोड़ें",
  "dialog.added": "कार्य जोड़ा गया",

  "solver.title": "दैनिक समस्या समाधानकर्ता",
  "solver.subtitle": "कोई भी दैनिक समस्या पूछें — तकनीकी, व्यक्तिगत या काम से जुड़ी।",
  "solver.placeholder": "कोई भी दैनिक समस्या पूछें (तकनीकी, व्यक्तिगत, काम)...",
  "solver.aria": "अपनी समस्या बताएँ",
  "solver.submit": "चरण-दर-चरण समाधान पाएँ",
  "solver.sample1": "वाईफ़ाई काम नहीं कर रहा",
  "solver.sample2": "प्रेजेंटेशन की तैयारी कैसे करें",
  "solver.sample3": "लैपटॉप धीमा चल रहा है",
  "solver.recent": "हाल के प्रश्न",
  "solver.noQueries": "अभी कोई प्रश्न नहीं।",
  "solver.step": "चरण {n}",
  "solver.remove": "प्रश्न हटाएँ",
  "solver.pageSubtitle": "तकनीकी, व्यक्तिगत या काम — बताइए और चरण-दर-चरण योजना पाइए।",

  "parser.title": "एआई टास्क पार्सर",
  "parser.subtitle": "सरल भाषा अंदर, संरचित कार्य बाहर — शीर्षक, प्राथमिकता, नियत तारीख और श्रेणी।",
  "parser.understands": "यह क्या समझता है",

  "analytics.title": "विश्लेषण",
  "analytics.subtitle": "आपका कार्यभार अभी कैसे बँटा हुआ है।",
  "analytics.byCategory": "श्रेणी के अनुसार पूर्णता",
  "analytics.priorityMix": "प्राथमिकता मिश्रण",
};

const DICTS: Record<Lang, Record<TKey, string>> = { en, mr, hi };

export type Translate = (key: TKey, vars?: Record<string, string | number>) => string;

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translate;
  locale: string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && (LANGS as readonly string[]).includes(stored)) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback<Translate>(
    (key, vars) => {
      let out = DICTS[lang][key] ?? en[key] ?? String(key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
      }
      return out;
    },
    [lang],
  );

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t, locale: LANG_LOCALES[lang] }),
    [lang, setLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
