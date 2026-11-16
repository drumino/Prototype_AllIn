"use client";

import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen,
  Bot, CalendarDays, Camera, Check, CheckCircle2, ChevronDown, Clock3, CreditCard,
  Download, FileText, Heart, LayoutDashboard, Pause,
  MessageCircle, PartyPopper, Play, Plus, Send, Sparkles, Star, Trash2, UserRound, Video,
  WalletCards, X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DemoRecording, getDemoRecording, readDemoRecordings, readDemoSessions, writeDemoSessions } from "@/app/demo/demo-storage";

type Language = "fr" | "en";
type Section = "dashboard" | "coaching" | "profile" | "learning" | "billing";
type Role = "member" | "coach" | "team";
type Celebration = { kind: "course" | "session" | "booking"; title: string; detail?: string };

type MemberProfile = {
  firstName: string;
  lastName: string;
  photo: string;
  sector: string;
  region: string;
  phone: string;
  email: string;
  bio: string;
  personalGoal: string;
};
type CoachingSession = {
  id: string;
  date: string;
  time: string;
  coach: string;
  memberName?: string;
  status: "upcoming" | "completed";
  summary: string;
};
type MemberLesson = {
  id: string;
  courseId: string;
  titleFr: string;
  titleEn: string;
  categoryFr: string;
  categoryEn: string;
  duration: number;
  progress: number;
  color: string;
  lastViewed?: number;
};
type MemberWin = { id: string; title: string; date: string; big: boolean };
type MemberInvoice = { id: string; period: string; amount: string; status: "paid" | "requested" };
type MemberData = {
  profile: MemberProfile;
  sessions: CoachingSession[];
  lessons: MemberLesson[];
  wins: MemberWin[];
  invoices: MemberInvoice[];
  paymentMethod: "visa" | "mastercard";
};

function formatMemberDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { weekday: "long", month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`));
}

function sessionHasStarted(session: CoachingSession, now: number) {
  const start = new Date(`${session.date}T${session.time}:00`).getTime();
  return Number.isFinite(start) && now >= start;
}

const copy = {
  fr: {
    portal: "Portail membre", nav: { dashboard: "Tableau de bord", coaching: "Mon coaching", profile: "Mon profil", learning: "Mes formations", billing: "Abonnement & facturation" },
    role: "Changer d’espace", roleMember: "Membre", roleCoach: "Coach", roleTeam: "Équipe", back: "Retour au site", sample: "Données de démonstration", hello: "Bonjour", subtitle: "Votre parcours, vos progrès et vos prochaines étapes — au même endroit.",
    nextSession: "Prochain coaching", sessionsUsed: "Séances effectuées", sessionsLeft: "Séances restantes", progress: "Progression générale", recentSummaries: "Derniers résumés de coaching", nextActions: "Prochaines actions", continueLearning: "Reprendre ma formation", viewCalendar: "Voir mon calendrier", recommended: "Recommandé pour vous", recommendationCopy: "D’après votre progression, cette prochaine étape peut vous aider à avancer.", startCourse: "Continuer la formation", coach: "Coach", joinMeet: "Participer à la séance", meetDemo: "Démo de présence : regardez la séance jusqu’au bout pour l’ajouter automatiquement à votre historique.",
    coachingTitle: "Mon coaching", coachingSubtitle: "Retrouvez vos séances passées, préparez les prochaines et suivez votre forfait.", history: "Historique des séances", upcoming: "À venir", completed: "Effectuée", booking: "Réserver une séance", chooseDate: "Choisir une date", chooseTime: "Choisir une heure", book: "Confirmer la réservation", bookingDone: "Votre séance de démonstration a été ajoutée au calendrier.", package: "Forfait de coaching", total: "Séances au forfait", used: "Utilisées", left: "Disponibles", markDone: "Marquer comme effectuée", sessionSummary: "Résumé de séance", noSummary: "Le résumé apparaîtra ici après votre séance.",
    profileTitle: "Mon profil", profileSubtitle: "Votre espace personnel, vos informations et vos réussites.", editProfile: "Modifier mon profil", save: "Enregistrer les changements", saved: "Profil mis à jour sur cet appareil.", firstName: "Prénom", lastName: "Nom", sector: "Secteur immobilier", region: "Région", phone: "Téléphone", email: "Courriel", bio: "Présentation professionnelle", goal: "Mon objectif de progression", photo: "Photo de profil", changePhoto: "Choisir une photo", photoLimit: "Image de 1 Mo maximum.", wins: "Wins & Big Wins", addWin: "Ajouter une réussite", winPlaceholder: "Une réussite dont vous êtes fier…", bigWin: "Big Win", remove: "Supprimer", personalProgress: "Ma progression personnelle", sampleProfile: "Profil membre fictif · Modifiez les champs pour le personnaliser.",
    learningTitle: "Mes formations", learningSubtitle: "Des capsules courtes pour faire avancer vos objectifs, à votre rythme.", all: "Tout", category: "Catégorie", historyLearning: "Récemment consultées", courseCatalog: "Bibliothèque vidéo", lesson: "Capsule vidéo", play: "Lire la capsule", pause: "Mettre en pause", markLesson: "Marquer comme terminée", lessonDone: "Formation terminée · Bravo !", lessonProgress: "Progression par vidéo", completion: "Complété", duration: "min", videoPreview: "Aperçu vidéo de démonstration", videoDescription: "Le lecteur de démonstration suit votre progression et enregistre votre avancement sur cet appareil.", noLessons: "Aucune capsule dans cette catégorie.",
    billingTitle: "Abonnement & facturation", billingSubtitle: "Consultez votre formule, vos paiements et vos factures.", currentPlan: "Mon abonnement actuel", planName: "Accompagnement", startDate: "Début de l’abonnement", renewalDate: "Prochain renouvellement", monthsLeft: "Temps avant renouvellement", oneMonth: "1 mois", paymentMethod: "Moyen de paiement", managePayment: "Gérer le moyen de paiement", paymentSaved: "Moyen de paiement mis à jour.", choosePayment: "Choisir un moyen de paiement", invoiceHistory: "Historique des paiements", requestInvoice: "Demander une facture", requestInvoiceCopy: "Nous préparons une facture de démonstration pour la période sélectionnée.", period: "Période", sendRequest: "Créer la demande", invoiceRequested: "Demande de facture ajoutée.", paid: "Payée", requested: "Demandée", download: "Télécharger", amount: "Montant", noRealPayment: "Prototype : aucun paiement ni moyen de paiement réel n’est traité.",
    account: "Espace personnel", savedLocally: "Enregistré sur cet appareil", emptyWin: "Vos réussites apparaîtront ici.", videoComplete: "Capsule terminée", noSessions: "Aucune séance passée pour le moment.", today: "Aujourd’hui", tomorrow: "Demain", info: "Informations personnelles", viewProfile: "Voir mon profil", actions: "Actions suggérées", finishCourse: "Terminer le module en cours", reflect: "Ajouter une réussite à mon profil", upcomingMeetings: "Séances à venir", durationSession: "45 minutes", noUpcoming: "Aucun rendez-vous à venir. Réservez votre prochaine séance.", showMore: "Voir le détail", downloadInvoice: "Télécharger la facture de démonstration", lessonPlayer: "Lecteur de formation", close: "Fermer", availableSlots: "Créneaux proposés", subscriptionNote: "Les dates et montants sont des exemples de démonstration.",
  },
  en: {
    portal: "Member Portal", nav: { dashboard: "Dashboard", coaching: "My Coaching", profile: "My Profile", learning: "My Learning", billing: "Subscription & Billing" },
    role: "Switch workspace", roleMember: "Member", roleCoach: "Coach", roleTeam: "Team", back: "Back to website", sample: "Demo data", hello: "Hello", subtitle: "Your journey, progress, and next steps — all in one place.",
    nextSession: "Next coaching session", sessionsUsed: "Sessions completed", sessionsLeft: "Sessions remaining", progress: "Overall progress", recentSummaries: "Recent coaching summaries", nextActions: "Next actions", continueLearning: "Continue learning", viewCalendar: "View my calendar", recommended: "Recommended for you", recommendationCopy: "Based on your progress, this next step can help you keep moving forward.", startCourse: "Continue course", coach: "Coach", joinMeet: "Join demo session", meetDemo: "Attendance demo: watch the session through to have it added to your history automatically.",
    coachingTitle: "My Coaching", coachingSubtitle: "Review past sessions, prepare for upcoming meetings, and track your package.", history: "Session history", upcoming: "Upcoming", completed: "Completed", booking: "Book a session", chooseDate: "Choose a date", chooseTime: "Choose a time", book: "Confirm booking", bookingDone: "Your demo session has been added to the calendar.", package: "Coaching package", total: "Sessions in package", used: "Used", left: "Available", markDone: "Mark as completed", sessionSummary: "Session summary", noSummary: "Your summary will appear here after your session.",
    profileTitle: "My Profile", profileSubtitle: "Your personal space, details, and wins.", editProfile: "Edit my profile", save: "Save changes", saved: "Profile updated on this device.", firstName: "First name", lastName: "Last name", sector: "Real estate sector", region: "Region", phone: "Phone", email: "Email", bio: "Professional introduction", goal: "My growth goal", photo: "Profile photo", changePhoto: "Choose a photo", photoLimit: "Image up to 1 MB.", wins: "Wins & Big Wins", addWin: "Add a win", winPlaceholder: "A win you are proud of…", bigWin: "Big Win", remove: "Remove", personalProgress: "My personal progress", sampleProfile: "Sample member profile · Edit the fields to personalize it.",
    learningTitle: "My Learning", learningSubtitle: "Short video lessons to move your goals forward, at your own pace.", all: "All", category: "Category", historyLearning: "Recently viewed", courseCatalog: "Video library", lesson: "Video lesson", play: "Play lesson", pause: "Pause lesson", markLesson: "Mark as complete", lessonDone: "Lesson completed · Nice work!", lessonProgress: "Progress by video", completion: "Complete", duration: "min", videoPreview: "Demo video preview", videoDescription: "The demo player tracks lesson progress and saves your progress on this device.", noLessons: "No lessons in this category.",
    billingTitle: "Subscription & Billing", billingSubtitle: "Review your plan, payments, and invoices.", currentPlan: "My current subscription", planName: "Coaching plan", startDate: "Subscription started", renewalDate: "Next renewal", monthsLeft: "Time until renewal", oneMonth: "1 month", paymentMethod: "Payment method", managePayment: "Manage payment method", paymentSaved: "Payment method updated.", choosePayment: "Choose a payment method", invoiceHistory: "Payment history", requestInvoice: "Request an invoice", requestInvoiceCopy: "We’ll prepare a demo invoice for the selected period.", period: "Period", sendRequest: "Create request", invoiceRequested: "Invoice request added.", paid: "Paid", requested: "Requested", download: "Download", amount: "Amount", noRealPayment: "Prototype: no real payments or payment details are processed.",
    account: "Personal space", savedLocally: "Saved on this device", emptyWin: "Your wins will appear here.", videoComplete: "Lesson complete", noSessions: "No past sessions yet.", today: "Today", tomorrow: "Tomorrow", info: "Personal details", viewProfile: "View my profile", actions: "Suggested actions", finishCourse: "Finish your current module", reflect: "Add a win to my profile", upcomingMeetings: "Upcoming sessions", durationSession: "45 minutes", noUpcoming: "No upcoming sessions. Book your next meeting.", showMore: "View details", downloadInvoice: "Download demo invoice", lessonPlayer: "Learning player", close: "Close", availableSlots: "Suggested times", subscriptionNote: "Dates and amounts are illustrative examples.",
  },
} as const;

const initialProfile: MemberProfile = {
  firstName: "Jordan", lastName: "Lee", photo: "", sector: "Résidentiel", region: "Montréal, Québec",
  phone: "+1 (514) 555-0142", email: "jordan.lee@example.com",
  bio: "Courtier immobilier passionné par l’accompagnement de ses clients et le développement de relations durables.",
  personalGoal: "Structurer ma semaine et consacrer plus de temps aux clients que je souhaite accompagner.",
};

const initialSessions: CoachingSession[] = [
  { id: "s-1", date: "2026-11-18", time: "10:30", coach: "Alex Martin", status: "upcoming", summary: "" },
  { id: "s-2", date: "2026-11-25", time: "13:00", coach: "Alex Martin", status: "upcoming", summary: "" },
  { id: "s-3", date: "2026-11-11", time: "10:30", coach: "Alex Martin", status: "completed", summary: "Jordan a clarifié ses priorités et mis en place un nouveau rituel de planification hebdomadaire." },
  { id: "s-4", date: "2026-11-04", time: "13:00", coach: "Alex Martin", status: "completed", summary: "La prospection devient plus régulière. Prochaine étape : protéger deux plages de concentration." },
  { id: "s-5", date: "2026-10-28", time: "10:30", coach: "Alex Martin", status: "completed", summary: "Jordan a identifié les activités qui créent le plus de valeur dans son quotidien." },
  { id: "s-6", date: "2026-10-21", time: "13:00", coach: "Alex Martin", status: "completed", summary: "Les objectifs du mois ont été définis autour du suivi client et du développement." },
];

const initialLessons: MemberLesson[] = [
  { id: "l-1", courseId: "leadership", titleFr: "Clarifier sa vision professionnelle", titleEn: "Clarify your professional vision", categoryFr: "Leadership", categoryEn: "Leadership", duration: 8, progress: 100, color: "violet" },
  { id: "l-2", courseId: "leadership", titleFr: "Transformer ses objectifs en habitudes", titleEn: "Turn goals into habits", categoryFr: "Leadership", categoryEn: "Leadership", duration: 12, progress: 65, color: "violet" },
  { id: "l-3", courseId: "leadership", titleFr: "Garder le cap dans les périodes chargées", titleEn: "Stay focused during busy periods", categoryFr: "Leadership", categoryEn: "Leadership", duration: 10, progress: 0, color: "violet" },
  { id: "l-4", courseId: "productivity", titleFr: "Planifier une semaine réaliste", titleEn: "Plan a realistic week", categoryFr: "Productivité", categoryEn: "Productivity", duration: 9, progress: 100, color: "coral" },
  { id: "l-5", courseId: "productivity", titleFr: "Protéger son temps de concentration", titleEn: "Protect your focus time", categoryFr: "Productivité", categoryEn: "Productivity", duration: 11, progress: 35, color: "coral" },
  { id: "l-6", courseId: "communication", titleFr: "Écouter pour mieux comprendre", titleEn: "Listen to understand", categoryFr: "Communication", categoryEn: "Communication", duration: 7, progress: 0, color: "blue" },
  { id: "l-7", courseId: "communication", titleFr: "Mener une conversation difficile", titleEn: "Lead a difficult conversation", categoryFr: "Communication", categoryEn: "Communication", duration: 13, progress: 0, color: "blue" },
  { id: "l-8", courseId: "business", titleFr: "Créer une expérience client remarquable", titleEn: "Create a remarkable client experience", categoryFr: "Immobilier", categoryEn: "Real estate", duration: 14, progress: 0, color: "lime" },
];

const initialMemberData: MemberData = {
  profile: initialProfile,
  sessions: initialSessions,
  lessons: initialLessons,
  wins: [
    { id: "w-1", title: "J’ai repris contact avec trois clients de longue date.", date: "2026-11-12", big: false },
    { id: "w-2", title: "J’ai obtenu une recommandation grâce à une relation client.", date: "2026-11-08", big: true },
    { id: "w-3", title: "J’ai protégé deux plages de travail sans interruption.", date: "2026-11-02", big: false },
  ],
  invoices: [
    { id: "INV-2026-011", period: "Octobre 2026", amount: "149,00 $", status: "paid" },
    { id: "INV-2026-010", period: "Septembre 2026", amount: "149,00 $", status: "paid" },
    { id: "INV-2026-009", period: "Août 2026", amount: "149,00 $", status: "paid" },
  ],
  paymentMethod: "visa",
};

export function MemberPortal({ language, onLanguageChange, onRoleChange }: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onRoleChange: (role: Role) => void;
}) {
  const t = copy[language];
  const [section, setSection] = useState<Section>("dashboard");
  const [data, setData] = useState<MemberData>(initialMemberData);
  const [currentTime, setCurrentTime] = useState(0);
  const [recordings, setRecordings] = useState<DemoRecording[]>([]);
  const [activeRecording, setActiveRecording] = useState<{ recording: DemoRecording; url: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [lessonPlaying, setLessonPlaying] = useState(false);
  const [lessonElapsed, setLessonElapsed] = useState(0);
  const [bookingDate, setBookingDate] = useState("2026-11-27");
  const [bookingTime, setBookingTime] = useState("10:30");
  const [winDraft, setWinDraft] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [invoicePeriod, setInvoicePeriod] = useState("Novembre 2026");
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<CoachingSession | null>(null);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lessonElapsedRef = useRef(0);
  const activeLessonRef = useRef<MemberLesson | null>(null);
  const sessionElapsedRef = useRef(0);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setCurrentTime(Date.now()), 0);
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 30_000);
    return () => { window.clearTimeout(initialTimer); window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem("allin-member-portal");
        const savedData = saved ? JSON.parse(saved) as Partial<MemberData> : null;
        const hasSharedSchedule = localStorage.getItem("allin-coaching-sessions") !== null;
        const sessions = hasSharedSchedule ? readDemoSessions() : savedData?.sessions ?? readDemoSessions();
        if (!hasSharedSchedule) writeDemoSessions(sessions);
        if (savedData) setData({ ...initialMemberData, ...savedData, sessions });
        else {
          const account = localStorage.getItem("allin-demo-account");
          if (account) {
            const member = JSON.parse(account) as { firstName?: string; lastName?: string; email?: string };
            setData({ ...initialMemberData, sessions, profile: { ...initialProfile, firstName: member.firstName || initialProfile.firstName, lastName: member.lastName || initialProfile.lastName, email: member.email || initialProfile.email } });
          } else {
            setData({ ...initialMemberData, sessions });
          }
        }
        setRecordings(readDemoRecordings());
      } catch { /* Keep the sample member account if storage is unavailable. */ }
      const requestedSection = new URLSearchParams(window.location.search).get("section");
      if (requestedSection === "dashboard" || requestedSection === "coaching" || requestedSection === "profile" || requestedSection === "learning" || requestedSection === "billing") {
        setSection(requestedSection);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("allin-member-portal", JSON.stringify(data)); } catch { /* Keep this session usable when storage is full. */ }
    writeDemoSessions(data.sessions);
  }, [data, hydrated]);

  useEffect(() => {
    const syncSharedData = () => {
      setData((current) => ({ ...current, sessions: readDemoSessions() }));
      setRecordings(readDemoRecordings());
    };
    window.addEventListener("storage", syncSharedData);
    return () => window.removeEventListener("storage", syncSharedData);
  }, []);

  useEffect(() => {
    if (!lessonPlaying || !activeLessonId) return;
    const timer = window.setInterval(() => {
      const next = lessonElapsedRef.current + 1;
      lessonElapsedRef.current = next;
      setLessonElapsed(next);
      if (next >= 90) {
        setLessonPlaying(false);
        const lesson = activeLessonRef.current;
        if (lesson && lesson.progress < 100) {
          setData((current) => ({ ...current, lessons: current.lessons.map((item) => item.id === lesson.id ? { ...item, progress: 100 } : item) }));
          setCelebration({ kind: "course", title: lesson[language === "fr" ? "titleFr" : "titleEn"] });
        }
        setActiveLessonId(null);
        activeLessonRef.current = null;
        return;
      }
      if (next % 12 === 0) setData((current) => ({ ...current, lessons: current.lessons.map((lesson) => lesson.id === activeLessonId ? { ...lesson, progress: Math.max(lesson.progress, Math.min(95, Math.round(next / 90 * 100))) } : lesson) }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lessonPlaying, activeLessonId, language]);

  useEffect(() => {
    if (!activeSession) return;
    const timer = window.setInterval(() => {
      const next = sessionElapsedRef.current + 1;
      sessionElapsedRef.current = next;
      setSessionElapsed(next);
      if (next < 15) return;
      setData((current) => ({ ...current, sessions: current.sessions.map((item) => item.id === activeSession.id ? { ...item, status: "completed", summary: item.summary || (language === "fr" ? "Séance visionnée. Votre présence a été enregistrée automatiquement." : "Session watched. Your attendance was recorded automatically.") } : item) }));
      setCelebration({ kind: "session", title: formatMemberDate(activeSession.date, language) });
      setActiveSession(null);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeSession, language]);

  const completedSessions = data.sessions.filter((session) => session.status === "completed").length;
  const upcomingSessions = data.sessions.filter((session) => session.status === "upcoming").sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const overallProgress = Math.round(data.lessons.reduce((sum, lesson) => sum + lesson.progress, 0) / Math.max(1, data.lessons.length));
  const recommendation = data.lessons.find((lesson) => lesson.progress > 0 && lesson.progress < 100) ?? data.lessons.find((lesson) => lesson.progress < 100);
  const activeLesson = data.lessons.find((lesson) => lesson.id === activeLessonId) ?? null;
  const selectSection = (next: Section) => { setSection(next); setNotice(""); setLessonPlaying(false); setActiveLessonId(null); activeLessonRef.current = null; };
  const updateProfile = (field: keyof MemberProfile, value: string) => setData((current) => ({ ...current, profile: { ...current.profile, [field]: value } }));
  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setNotice(t.saved); };
  const markLessonComplete = (lessonId: string) => {
    const lesson = data.lessons.find((item) => item.id === lessonId);
    if (!lesson || lesson.progress >= 100) { setActiveLessonId(null); return; }
    setData((current) => ({ ...current, lessons: current.lessons.map((lesson) => lesson.id === lessonId ? { ...lesson, progress: 100 } : lesson) }));
    setLessonPlaying(false);
    setActiveLessonId(null);
    activeLessonRef.current = null;
    setCelebration({ kind: "course", title: lessonTitle(lesson) });
  };
  const addWin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = winDraft.trim();
    if (!title) return;
    setData((current) => ({ ...current, wins: [{ id: crypto.randomUUID(), title, date: new Date().toISOString().slice(0, 10), big: false }, ...current.wins] }));
    setWinDraft("");
    setNotice(language === "fr" ? "Réussite ajoutée à votre profil." : "Win added to your profile.");
  };
  const bookSession = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (data.sessions.some((session) => session.status === "upcoming" && session.date === bookingDate && session.time === bookingTime)) {
      setNotice(language === "fr" ? "Ce créneau est déjà réservé." : "That time is already booked.");
      return;
    }
    const reservedCount = data.sessions.filter((session) => session.status === "upcoming").length;
    if (completedSessions + reservedCount >= 8) {
      setNotice(language === "fr" ? "Votre forfait de 8 séances est entièrement planifié." : "All 8 sessions in your package are scheduled.");
      return;
    }
    const booking = { id: crypto.randomUUID(), date: bookingDate, time: bookingTime, coach: "Alex Martin", memberName: `${data.profile.firstName} ${data.profile.lastName}`, status: "upcoming" as const, summary: "" };
    writeDemoSessions([booking, ...readDemoSessions()]);
    setData((current) => ({ ...current, sessions: [booking, ...current.sessions] }));
    setCelebration({ kind: "booking", title: `${formattedDate(bookingDate)} · ${bookingTime}`, detail: t.bookingDone });
  };
  const attendSession = (sessionId: string) => {
    const session = data.sessions.find((item) => item.id === sessionId && item.status === "upcoming");
    if (!session) return;
    if (!sessionHasStarted(session, currentTime)) {
      setNotice(language === "fr" ? `Seance disponible le ${formattedDate(session.date)} a ${session.time}.` : `Session available on ${formattedDate(session.date)} at ${session.time}.`);
      return;
    }
    sessionElapsedRef.current = 0;
    setSessionElapsed(0);
    setActiveSession(session);
  };
  const playRecordedSession = async (recording: DemoRecording) => {
    try {
      const blob = await getDemoRecording(recording.id);
      if (!blob) { setNotice(language === "fr" ? "Video indisponible sur cet appareil." : "This video is unavailable on this device."); return; }
      if (activeRecording) URL.revokeObjectURL(activeRecording.url);
      setActiveRecording({ recording, url: URL.createObjectURL(blob) });
    } catch {
      setNotice(language === "fr" ? "Impossible d’ouvrir cette vidéo sur cet appareil." : "Could not open this video on this device.");
    }
  };
  const closeRecordedSession = () => {
    if (activeRecording) URL.revokeObjectURL(activeRecording.url);
    setActiveRecording(null);
  };
  const requestInvoice = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData((current) => ({ ...current, invoices: [{ id: `REQ-${Date.now().toString().slice(-6)}`, period: invoicePeriod, amount: "149,00 $", status: "requested" }, ...current.invoices] }));
    setNotice(t.invoiceRequested);
  };
  const uploadPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { setNotice(t.photoLimit); return; }
    const reader = new FileReader();
    reader.onload = () => updateProfile("photo", typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };
  const openLesson = (id: string) => {
    const lesson = data.lessons.find((item) => item.id === id);
    if (!lesson) return;
    activeLessonRef.current = lesson;
    lessonElapsedRef.current = 0;
    setActiveLessonId(id);
    setLessonElapsed(0);
    setLessonPlaying(false);
    setData((current) => ({ ...current, lessons: current.lessons.map((lesson) => lesson.id === id ? { ...lesson, lastViewed: Date.now() } : lesson) }));
  };
  const downloadInvoice = (invoice: MemberInvoice) => {
    const content = `ALL-IN OS\n${t.downloadInvoice}\n${invoice.id}\n${invoice.period}\n${invoice.amount}\n${t.subscriptionNote}`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${invoice.id}.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const lessonTitle = (lesson: MemberLesson) => lesson[language === "fr" ? "titleFr" : "titleEn"];
  const formattedDate = (date: string) => formatMemberDate(date, language);
  const changeRole = (role: Role) => onRoleChange(role);

  return (
    <main className="member-portal" lang={language}>
      <aside className="member-sidebar">
        <Link href="/" className="member-brand" aria-label={language === "fr" ? "ALL-IN OS — Retour à l’accueil" : "ALL-IN OS — Back to home"}><span className="member-brand-mark">A</span><span>ALL-IN <i>OS</i></span><b>MEMBER</b></Link>
        <div className="member-space-label">{t.portal}</div>
        <nav className="member-navigation" aria-label={t.portal}>
          <MemberNavButton active={section === "dashboard"} icon={<LayoutDashboard size={17}/>} label={t.nav.dashboard} onClick={() => selectSection("dashboard")}/>
          <MemberNavButton active={section === "coaching"} icon={<CalendarDays size={17}/>} label={t.nav.coaching} onClick={() => selectSection("coaching")}/>
          <MemberNavButton active={section === "profile"} icon={<UserRound size={17}/>} label={t.nav.profile} onClick={() => selectSection("profile")}/>
          <MemberNavButton active={section === "learning"} icon={<BookOpen size={17}/>} label={t.nav.learning} onClick={() => selectSection("learning")}/>
          <MemberNavButton active={section === "billing"} icon={<WalletCards size={17}/>} label={t.nav.billing} onClick={() => selectSection("billing")}/>
        </nav>
        <div className="member-sidebar-bottom">
          <div className="member-role-picker"><span>{t.role}</span><div><span className="selected" aria-current="true">{t.roleMember}</span><button type="button" onClick={() => changeRole("coach")}>{t.roleCoach}</button><button type="button" onClick={() => changeRole("team")}>{t.roleTeam}</button></div></div>
          <Link href="/" className="member-back-link"><ArrowLeft size={15}/>{t.back}</Link>
          <Link href="/auth" className="member-back-link" onClick={() => localStorage.removeItem("allin-demo-session")}><UserRound size={15}/>{language === "fr" ? "Se déconnecter" : "Sign out"}</Link>
        </div>
      </aside>

      <section className="member-main">
        <header className="member-topbar">
          <div className="member-breadcrumb"><Link href="/" aria-label={language === "fr" ? "Retour à l’accueil ALL-IN OS" : "Back to the ALL-IN OS home page"}>ALL-IN OS</Link><b>/</b><strong>{t.portal}</strong></div>
          <div className="member-topbar-actions"><span className="member-sample"><i/>{t.sample}</span><div className="member-language" aria-label={language === "fr" ? "Langue" : "Language"}><button type="button" className={language === "fr" ? "active" : ""} aria-pressed={language === "fr"} onClick={() => onLanguageChange("fr")}>FR</button><button type="button" className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => onLanguageChange("en")}>EN</button></div><button className="member-account-button" type="button" onClick={() => selectSection("profile")}><MemberAvatar profile={data.profile} size="small"/><span>{data.profile.firstName}</span><ChevronDown size={13}/></button></div>
        </header>

        <div className="member-content">
          {notice && <div className="member-toast" role="status"><CheckCircle2 size={16}/>{notice}<button type="button" aria-label={t.close} onClick={() => setNotice("")}><X size={14}/></button></div>}
          <div className="member-view-transition" key={section}>
          {section === "dashboard" && <MemberDashboard data={data} t={t} language={language} now={currentTime} progress={overallProgress} upcomingSessions={upcomingSessions} recommendation={recommendation} lessonTitle={lessonTitle} formattedDate={formattedDate} onSection={selectSection} onAttend={attendSession}/ >}
          {section === "coaching" && <MemberCoaching data={data} t={t} language={language} now={currentTime} completedSessions={completedSessions} upcomingSessions={upcomingSessions} recordings={recordings.filter((item) => item.memberEmail.toLowerCase() === data.profile.email.toLowerCase())} onPlayRecording={playRecordedSession} formattedDate={formattedDate} bookingDate={bookingDate} bookingTime={bookingTime} setBookingDate={setBookingDate} setBookingTime={setBookingTime} onBook={bookSession} onAttend={attendSession}/>}
          {section === "profile" && <MemberProfileView data={data} t={t} language={language} fileInputRef={fileInputRef} onProfileChange={updateProfile} onSave={saveProfile} onPhoto={uploadPhoto} winDraft={winDraft} setWinDraft={setWinDraft} onAddWin={addWin} onRemoveWin={(id) => setData((current) => ({ ...current, wins: current.wins.filter((win) => win.id !== id) }))} onToggleBigWin={(id) => setData((current) => ({ ...current, wins: current.wins.map((win) => win.id === id ? { ...win, big: !win.big } : win) }))}/>}
          {section === "learning" && <MemberLearning data={data} t={t} language={language} progress={overallProgress} lessonTitle={lessonTitle} onOpenLesson={openLesson}/ >}
          {section === "billing" && <MemberBilling data={data} t={t} language={language} invoicePeriod={invoicePeriod} setInvoicePeriod={setInvoicePeriod} onRequestInvoice={requestInvoice} onPaymentDialog={() => setPaymentDialogOpen(true)} onDownloadInvoice={downloadInvoice}/>}
          </div>
        </div>
      </section>

      {activeLesson && <LessonDialog lesson={activeLesson} t={t} language={language} elapsed={lessonElapsed} playing={lessonPlaying} onPlay={() => setLessonPlaying(!lessonPlaying)} onClose={() => { setLessonPlaying(false); setActiveLessonId(null); activeLessonRef.current = null; }} onComplete={() => markLessonComplete(activeLesson.id)}/>}
      {activeSession && <SessionWatchDialog session={activeSession} language={language} elapsed={sessionElapsed} onClose={() => { setActiveSession(null); sessionElapsedRef.current = 0; setSessionElapsed(0); }}/ >}
      {activeRecording && <RecordedSessionDialog recording={activeRecording.recording} url={activeRecording.url} language={language} onClose={closeRecordedSession}/>}
      {paymentDialogOpen && <PaymentDialog selected={data.paymentMethod} t={t} language={language} onClose={() => setPaymentDialogOpen(false)} onSave={(paymentMethod) => { setData((current) => ({ ...current, paymentMethod })); setPaymentDialogOpen(false); setNotice(t.paymentSaved); }} />}
      {celebration && <CelebrationDialog celebration={celebration} language={language} onClose={() => setCelebration(null)} onNext={() => { const destination = celebration.kind === "course" ? "learning" : "coaching"; setCelebration(null); selectSection(destination); }}/>}
      <AICompanion language={language} section={section} data={data} open={assistantOpen} onOpenChange={setAssistantOpen} onNavigate={selectSection}/>
    </main>
  );
}

function MemberNavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button type="button" className={`member-nav-button${active ? " active" : ""}`} onClick={onClick}>{icon}<span>{label}</span>{active && <i/>}</button>;
}

function MemberAvatar({ profile, size = "large" }: { profile: MemberProfile; size?: "small" | "large" }) {
  const initials = `${profile.firstName.slice(0, 1)}${profile.lastName.slice(0, 1)}`.toUpperCase();
  return <span className={`member-avatar ${size}`}>{profile.photo ? <Image src={profile.photo} alt="" width={size === "small" ? 27 : 58} height={size === "small" ? 27 : 58} unoptimized/> : initials}</span>;
}

function MemberSectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="member-section-heading"><div><p className="member-eyebrow"><i/>{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function MemberDashboard({ data, t, language, now, progress, upcomingSessions, recommendation, lessonTitle, formattedDate, onSection, onAttend }: {
  data: MemberData; t: (typeof copy)[Language]; language: Language; now: number; progress: number; upcomingSessions: CoachingSession[]; recommendation?: MemberLesson; lessonTitle: (lesson: MemberLesson) => string; formattedDate: (date: string) => string; onSection: (section: Section) => void; onAttend: (id: string) => void;
}) {
  const completed = data.sessions.filter((session) => session.status === "completed");
  const sessionsLeft = Math.max(0, 8 - completed.length);
  const nextSession = upcomingSessions[0];
  const canJoinNextSession = nextSession ? sessionHasStarted(nextSession, now) : false;
  return <>
    <div className="member-welcome simple"><div><h1>{t.hello}, {data.profile.firstName}</h1><p>{language === "fr" ? "Votre coaching, en un coup d’Å“il." : "Your coaching at a glance."}</p></div></div>

    <section className="member-card simple-next-session">
      <div className="simple-session-heading"><span><CalendarDays size={22}/></span><div><p className="member-card-kicker">{t.nextSession}</p><h2>{nextSession ? formattedDate(nextSession.date) : t.noUpcoming}</h2>
        {nextSession && <p>{nextSession.time} · {nextSession.coach}</p>}</div>
      </div>
      {nextSession ? <button type="button" className="member-primary-button" disabled={!canJoinNextSession} title={!canJoinNextSession ? (language === "fr" ? `Disponible le ${formattedDate(nextSession.date)} à ${nextSession.time}` : `Available on ${formattedDate(nextSession.date)} at ${nextSession.time}`) : undefined} onClick={() => onAttend(nextSession.id)}><Video size={16}/>{canJoinNextSession ? t.joinMeet : (language === "fr" ? "Disponible à l’heure prévue" : "Available at scheduled time")}</button> : <button type="button" className="member-primary-button" onClick={() => onSection("coaching")}><CalendarDays size={16}/>{t.book}</button>}
    </section>

    <div className="member-simple-stats">
      <button type="button" className="member-card simple-stat" onClick={() => onSection("coaching")}><span>{t.sessionsLeft}</span><strong>{sessionsLeft} <small>/ 8</small></strong></button>
      <button type="button" className="member-card simple-stat" onClick={() => onSection("learning")}><span>{t.progress}</span><strong>{progress}%</strong><i><b style={{ width: `${progress}%` }}/></i></button>
    </div>

    <section className="member-card simple-recommendation"><span><Sparkles size={18}/></span><div><small>{language === "fr" ? "CONSEIL IA" : "AI TIP"}</small><h2>{recommendation ? lessonTitle(recommendation) : t.lessonDone}</h2><p>{t.recommendationCopy}</p></div><button type="button" className="member-primary-button" onClick={() => onSection("learning")}>{recommendation ? t.startCourse : t.continueLearning}<ArrowRight size={15}/></button></section>
  </>;
}

function MemberCoaching({ data, t, language, now, completedSessions, upcomingSessions, recordings, onPlayRecording, formattedDate, bookingDate, bookingTime, setBookingDate, setBookingTime, onBook, onAttend }: {
  data: MemberData; t: (typeof copy)[Language]; language: Language; now: number; completedSessions: number; upcomingSessions: CoachingSession[]; recordings: DemoRecording[]; onPlayRecording: (recording: DemoRecording) => void; formattedDate: (date: string) => string; bookingDate: string; bookingTime: string; setBookingDate: (value: string) => void; setBookingTime: (value: string) => void; onBook: (event: React.FormEvent<HTMLFormElement>) => void; onAttend: (id: string) => void;
}) {
  const history = data.sessions.filter((session) => session.status === "completed").sort((a, b) => b.date.localeCompare(a.date));
  const reserved = upcomingSessions.length;
  return <>
    <MemberSectionHeading eyebrow={t.portal} title={t.coachingTitle} description={t.coachingSubtitle} action={<span className="member-total-pill"><CalendarDays size={14}/>{completedSessions} / 8 {t.total.toLowerCase()}</span>}/>
    <div className="member-coaching-grid">
      <section className="member-card package-card"><div className="member-card-top"><div><p className="member-card-kicker">{t.package}</p><h2>{language === "fr" ? "Votre accompagnement" : "Your coaching plan"}</h2></div><span className="member-card-icon coral"><Heart size={17}/></span></div><div className="package-progress-count"><b>{Math.max(0, 8 - completedSessions)}</b><span>/ 8</span></div><div className="package-dots">{Array.from({ length: 8 }, (_, index) => <i key={index} className={index < completedSessions ? "used" : index < completedSessions + reserved ? "reserved" : ""}/>)}</div><div className="package-legends"><span><i className="used"/>{t.used}: {completedSessions}</span><span><i/>{t.left}: {Math.max(0, 8 - completedSessions)}</span></div><p>{reserved} {language === "fr" ? "séance(s) planifiée(s)" : "session(s) scheduled"}</p></section>
      <section className="member-card booking-card"><div className="member-card-top"><div><p className="member-card-kicker">{t.booking}</p><h2>{language === "fr" ? "Choisissez votre prochain créneau." : "Choose your next time."}</h2></div><span className="member-card-icon violet"><Plus size={17}/></span></div><form onSubmit={onBook} className="member-booking-form"><label>{t.chooseDate}<input type="date" required min={new Date().toISOString().slice(0, 10)} value={bookingDate} onChange={(event) => setBookingDate(event.target.value)}/></label><label>{t.chooseTime}<select value={bookingTime} onChange={(event) => setBookingTime(event.target.value)}><option>10:30</option><option>13:00</option><option>15:15</option><option>16:00</option></select></label><button className="member-primary-button" type="submit"><Plus size={15}/>{t.book}</button></form></section>
    </div>
    <div className="member-card session-list-card"><div className="member-card-top"><div><p className="member-card-kicker">{t.upcoming}</p><h2>{t.upcomingMeetings}</h2></div><span className="member-count-badge">{upcomingSessions.length}</span></div>{upcomingSessions.length ? <div className="member-session-list">{upcomingSessions.map((session) => { const available = sessionHasStarted(session, now); return <article className="member-session-list-row" key={session.id}><div className="member-session-date"><b>{new Date(`${session.date}T12:00:00`).getDate()}</b><small>{new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { month: "short" }).format(new Date(`${session.date}T12:00:00`)).toUpperCase()}</small></div><div className="member-session-list-info"><b>{formattedDate(session.date)} · {session.time}</b><span>{t.coach}: {session.coach} · {t.durationSession}</span></div><button type="button" className="meet-link-button" disabled={!available} title={!available ? (language === "fr" ? "Pas encore disponible" : "Not available yet") : undefined} onClick={() => onAttend(session.id)}><Video size={15}/>{available ? t.joinMeet : (language === "fr" ? "Pas encore disponible" : "Not available yet")}<ArrowRight size={14}/></button></article>; })}</div> : <div className="member-empty-state"><CalendarDays size={22}/><p>{t.noUpcoming}</p></div>}</div>
    <section className="member-card recorded-session-library"><div className="member-card-top"><div><p className="member-card-kicker">{language === "fr" ? "À regarder quand vous voulez" : "Watch anytime"}</p><h2>{language === "fr" ? "Séances enregistrées" : "Recorded sessions"}</h2></div><span className="member-count-badge">{recordings.length}</span></div>{recordings.length ? <div className="recorded-session-list">{recordings.map((recording) => <article key={recording.id}><span><Play size={15} fill="currentColor"/></span><div><b>{recording.title}</b><small>{new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { dateStyle: "medium" }).format(new Date(recording.createdAt))} · {Math.max(1, Math.round(recording.durationSeconds / 60))} {language === "fr" ? "min" : "min"}</small></div><button type="button" className="member-primary-button" onClick={() => onPlayRecording(recording)}>{language === "fr" ? "Regarder" : "Watch"}<Play size={13}/></button></article>)}</div> : <p className="recorded-session-empty">{language === "fr" ? "Votre coach ajoutera ici les replays de vos séances." : "Your coach’s saved session replays will appear here."}</p>}</section>
    <details className="member-history-details"><summary>{language === "fr" ? `Voir l’historique des séances (${history.length})` : `View session history (${history.length})`}</summary><div className="member-card session-list-card history-card">{history.length ? <div className="member-session-list">{history.map((session) => <article className="member-session-list-row completed" key={session.id}><div className="member-session-date"><b><Check size={15}/></b><small>{new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { month: "short" }).format(new Date(`${session.date}T12:00:00`)).toUpperCase()}</small></div><div className="member-session-list-info"><b>{formattedDate(session.date)} · {session.time}</b><span>{t.coach}: {session.coach}</span><p>{session.summary || t.noSummary}</p></div><span className="session-completed-pill">{t.completed}</span></article>)}</div> : <div className="member-empty-state"><Clock3 size={22}/><p>{t.noSessions}</p></div>}</div></details>
  </>;
}

function MemberProfileView({ data, t, language, fileInputRef, onProfileChange, onSave, onPhoto, winDraft, setWinDraft, onAddWin, onRemoveWin, onToggleBigWin }: {
  data: MemberData; t: (typeof copy)[Language]; language: Language; fileInputRef: React.RefObject<HTMLInputElement | null>; onProfileChange: (field: keyof MemberProfile, value: string) => void; onSave: (event: React.FormEvent<HTMLFormElement>) => void; onPhoto: (event: React.ChangeEvent<HTMLInputElement>) => void; winDraft: string; setWinDraft: (value: string) => void; onAddWin: (event: React.FormEvent<HTMLFormElement>) => void; onRemoveWin: (id: string) => void; onToggleBigWin: (id: string) => void;
}) {
  return <>
    <MemberSectionHeading eyebrow={t.account} title={t.profileTitle} description={t.profileSubtitle}/>
    <form className="member-card profile-form" onSubmit={onSave}>
      <div className="profile-form-head"><div><MemberAvatar profile={data.profile}/><div><p className="member-card-kicker">{t.photo}</p><h2>{data.profile.firstName} {data.profile.lastName}</h2><span>{t.sampleProfile}</span></div></div><button type="button" className="member-outline-button" onClick={() => fileInputRef.current?.click()}><Camera size={14}/>{t.changePhoto}</button><input ref={fileInputRef} className="visually-hidden" type="file" accept="image/*" onChange={onPhoto}/></div>
      <div className="member-form-grid"><MemberField label={t.firstName} value={data.profile.firstName} onChange={(value) => onProfileChange("firstName", value)}/><MemberField label={t.lastName} value={data.profile.lastName} onChange={(value) => onProfileChange("lastName", value)}/><MemberField label={t.sector} value={data.profile.sector} onChange={(value) => onProfileChange("sector", value)}/><MemberField label={t.region} value={data.profile.region} onChange={(value) => onProfileChange("region", value)}/><MemberField label={t.phone} value={data.profile.phone} onChange={(value) => onProfileChange("phone", value)} type="tel"/><MemberField label={t.email} value={data.profile.email} onChange={(value) => onProfileChange("email", value)} type="email"/><details className="profile-extra-details"><summary>{language === "fr" ? "Présentation et objectif professionnel" : "Professional introduction and goal"}</summary><div className="member-form-grid"><label className="member-field full"><span>{t.bio}</span><textarea rows={3} value={data.profile.bio} onChange={(event) => onProfileChange("bio", event.target.value)}/></label><label className="member-field full"><span>{t.goal}</span><textarea rows={2} value={data.profile.personalGoal} onChange={(event) => onProfileChange("personalGoal", event.target.value)}/></label></div></details></div>
      <div className="profile-form-footer"><span><CheckCircle2 size={14}/>{t.savedLocally}</span><button type="submit" className="member-primary-button">{t.save}<Check size={15}/></button></div>
    </form>

    <section className="member-card wins-card"><div className="member-card-top"><div><p className="member-card-kicker">{t.wins}</p><h2>{language === "fr" ? "Mes réussites" : "My wins"}</h2></div><span className="member-card-icon coral"><Star size={17}/></span></div><form className="add-win-form" onSubmit={onAddWin}><input value={winDraft} onChange={(event) => setWinDraft(event.target.value)} placeholder={t.winPlaceholder} aria-label={t.winPlaceholder}/><button type="submit" aria-label={t.addWin}><Plus size={17}/></button></form><div className="win-list">{data.wins.map((win) => <article key={win.id} className="win-row"><span className={`win-star${win.big ? " big" : ""}`}><Star size={14}/></span><div><b>{win.title}</b><small>{new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { month: "short", day: "numeric" }).format(new Date(`${win.date}T12:00:00`))}{win.big && <strong>{t.bigWin}</strong>}</small></div><button type="button" aria-label={win.big ? t.bigWin : t.remove} onClick={() => onToggleBigWin(win.id)}><Star size={14}/></button><button type="button" aria-label={t.remove} onClick={() => onRemoveWin(win.id)}><Trash2 size={14}/></button></article>)}{data.wins.length === 0 && <p className="member-empty-copy">{t.emptyWin}</p>}</div></section>
  </>;
}

function MemberField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="member-field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)}/></label>;
}

function MemberLearning({ data, t, language, progress, lessonTitle, onOpenLesson }: {
  data: MemberData; t: (typeof copy)[Language]; language: Language; progress: number; lessonTitle: (lesson: MemberLesson) => string; onOpenLesson: (id: string) => void;
}) {
  const groups = [...new Set(data.lessons.map((lesson) => lesson.courseId))].map((id) => ({
    id,
    lessons: data.lessons.filter((lesson) => lesson.courseId === id),
  }));
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const descriptions: Record<string, Record<Language, string>> = {
    leadership: { fr: "Clarifier sa vision et installer de bonnes habitudes.", en: "Clarify your vision and build steady habits." },
    productivity: { fr: "Mieux planifier sa semaine et prot?ger son temps.", en: "Plan your week and protect your focus time." },
    communication: { fr: "?couter activement et mieux communiquer.", en: "Listen actively and communicate with confidence." },
    business: { fr: "Créer une expérience client remarquable.", en: "Create a remarkable client experience." },
  };
  const allComplete = data.lessons.length > 0 && data.lessons.every((lesson) => lesson.progress === 100);

  return <>
    <MemberSectionHeading eyebrow={t.portal} title={t.learningTitle} description={t.learningSubtitle} action={<span className="member-total-pill"><BookOpen size={14}/>{progress}% {t.progress.toLowerCase()}</span>}/>
    <div className="member-learning-intro"><span><BookOpen size={18}/></span><p><b>{groups.length} {language === "fr" ? "formations" : "courses"} · {data.lessons.length} {language === "fr" ? "capsules" : "lessons"}</b>{" "}{allComplete ? (language === "fr" ? "Tout est terminé. Bravo !" : "Everything is complete. Great work!") : (language === "fr" ? "Choisissez une formation pour voir ses capsules." : "Choose a course to see its lessons.")}</p></div>
    <div className="member-course-groups" aria-label={language === "fr" ? "Mes parcours de formation" : "My learning paths"}>
      {groups.map(({ id, lessons }) => {
        const courseProgress = Math.round(lessons.reduce((sum, lesson) => sum + lesson.progress, 0) / lessons.length);
        const completedCount = lessons.filter((lesson) => lesson.progress >= 100).length;
        const title = lessons[0][language === "fr" ? "categoryFr" : "categoryEn"];
        const status = courseProgress === 100 ? "completed" : courseProgress > 0 ? "in-progress" : "not-started";
        const statusLabel = status === "completed" ? (language === "fr" ? "Terminée" : "Completed") : status === "in-progress" ? (language === "fr" ? "En cours" : "In progress") : (language === "fr" ? "À commencer" : "Not started");
        const isOpen = id === expandedCourse;
        return <section className={`member-course-group status-${status}${isOpen ? " is-open" : ""}`} key={id}>
          <button type="button" className="member-course-group-toggle" aria-expanded={isOpen} onClick={() => setExpandedCourse(isOpen ? "" : id)}>
            <span className="course-group-icon"><BookOpen size={19}/></span>
            <span className="course-group-title"><b>{title}</b><small>{descriptions[id]?.[language] ?? (language === "fr" ? "Une formation pour faire avancer vos objectifs." : "A course to help move your goals forward.")}</small></span>
            <span className={`course-status-pill ${status}`}><i/>{statusLabel}</span>
            <ChevronDown size={17}/>
          </button>
          <div className="course-summary-progress"><div><span>{completedCount} {language === "fr" ? `sur ${lessons.length} capsules terminées` : `of ${lessons.length} lessons complete`}</span><b>{courseProgress}%</b></div><i><em style={{ width: `${courseProgress}%` }}/></i></div>
          <button type="button" className="course-expand-action" aria-expanded={isOpen} onClick={() => setExpandedCourse(isOpen ? "" : id)}>{isOpen ? (language === "fr" ? "Masquer les capsules" : "Hide lessons") : (language === "fr" ? "Voir les capsules" : "View lessons")}<ChevronDown size={15}/></button>
          {isOpen && <div className="member-course-lessons">{lessons.map((lesson) => <article key={lesson.id} className="member-course-lesson"><span className={`course-lesson-play ${lesson.progress === 100 ? "completed" : lesson.progress > 0 ? "in-progress" : "not-started"}`}>{lesson.progress === 100 ? <Check size={15}/> : <Play size={14} fill="currentColor"/>}</span><div><b>{lessonTitle(lesson)}</b><small>{lesson.duration} {t.duration} · {lesson.progress === 100 ? (language === "fr" ? "Terminée" : "Completed") : lesson.progress > 0 ? (language === "fr" ? `${lesson.progress}% terminé` : `${lesson.progress}% complete`) : (language === "fr" ? "À commencer" : "Not started")}</small><i><em style={{ width: `${lesson.progress}%` }}/></i></div><button type="button" onClick={() => onOpenLesson(lesson.id)}>{lesson.progress === 100 ? (language === "fr" ? "Revoir" : "Review") : lesson.progress > 0 ? (language === "fr" ? "Reprendre" : "Continue") : (language === "fr" ? "Commencer" : "Start")}<Play size={13}/></button></article>)}</div>}
        </section>;
      })}
    </div>
  </>;
}

function LessonDialog({ lesson, t, language, elapsed, playing, onPlay, onClose, onComplete }: { lesson: MemberLesson; t: (typeof copy)[Language]; language: Language; elapsed: number; playing: boolean; onPlay: () => void; onClose: () => void; onComplete: () => void }) {
  const title = lesson[language === "fr" ? "titleFr" : "titleEn"];
  const visualStep = Math.floor(elapsed / 8) % 4;
  return <div className="member-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="member-lesson-dialog" role="dialog" aria-modal="true" aria-labelledby="lesson-dialog-title"><header><div><p>{t.lessonPlayer} · {lesson[language === "fr" ? "categoryFr" : "categoryEn"]}</p><h2 id="lesson-dialog-title">{title}</h2></div><button type="button" aria-label={t.close} onClick={onClose}><X size={19}/></button></header><div className={`member-player-stage ${lesson.color} step-${visualStep}`}><div className="player-orbit orbit-left"/><div className="player-orbit orbit-right"/><div className="player-title-card"><span>ALL-IN OS · {language === "fr" ? "CAPSULE" : "LESSON"} {String(lesson.id.slice(-1)).padStart(2, "0")}</span><strong>{title}</strong><small>{language === "fr" ? "Apprendre · Appliquer · Progresser" : "Learn · Apply · Grow"}</small></div><button type="button" className="player-big-play" onClick={onPlay} aria-label={playing ? t.pause : t.play}>{playing ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor"/>}</button><span className="player-demo-mark">{t.videoPreview}</span></div><div className="member-player-controls"><button type="button" className="player-control-button" onClick={onPlay}>{playing ? <Pause size={15}/> : <Play size={15}/>} {playing ? t.pause : t.play}</button><span>0:{String(elapsed).padStart(2, "0")} / 1:30</span><div className="player-track"><i style={{ width: `${Math.min(100, elapsed / 90 * 100)}%` }}/></div><span>{lesson.progress}%</span></div><div className="member-player-footer"><p><Sparkles size={14}/>{t.videoDescription}</p><button type="button" className="member-primary-button" onClick={onComplete}>{lesson.progress === 100 ? t.completed : t.markLesson}<Check size={14}/></button></div></section></div>;
}

function SessionWatchDialog({ session, language, elapsed, onClose }: { session: CoachingSession; language: Language; elapsed: number; onClose: () => void }) {
  const fr = language === "fr";
  const progress = Math.min(100, Math.round(elapsed / 15 * 100));
  return <div className="member-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="member-session-watch" role="dialog" aria-modal="true" aria-labelledby="session-watch-title"><header><div><p className="member-live-label"><i/>{fr ? "COACHING EN DIRECT · DÉMO" : "LIVE COACHING · DEMO"}</p><h2 id="session-watch-title">{fr ? "Votre séance de coaching" : "Your coaching session"}</h2></div><button type="button" aria-label={fr ? "Fermer" : "Close"} onClick={onClose}><X size={19}/></button></header><div className="member-session-stage"><span className="session-coach-initials">AM</span><span className="session-stage-spark"><Sparkles size={25}/></span><div><b>{session.coach}</b><small>{fr ? "Coach ALL-IN" : "ALL-IN coach"}</small></div><p>{fr ? "Prenez un instant pour vous concentrer sur vos objectifs." : "Take a moment to focus on your goals."}</p><span className="session-stage-demo">{fr ? "APERÇU DE SÉANCE" : "SESSION PREVIEW"}</span></div><div className="member-session-watch-status"><div><strong>{progress < 100 ? (fr ? "Présence en cours" : "Attendance in progress") : (fr ? "Présence confirmée" : "Attendance confirmed")}</strong><span>{fr ? `${elapsed} sur 15 secondes visionnées` : `${elapsed} of 15 seconds watched`}</span></div><b>{progress}%</b></div><div className="member-session-watch-track"><i style={{ width: `${progress}%` }}/></div><p className="member-session-watch-note"><CheckCircle2 size={15}/>{fr ? "Votre séance sera marquée comme effectuée automatiquement à la fin de cette démo." : "Your session will be marked complete automatically when this demo ends."}</p><button type="button" className="member-watch-close" onClick={onClose}>{fr ? "Quitter la séance" : "Leave session"}</button></section></div>;
}

function RecordedSessionDialog({ recording, url, language, onClose }: { recording: DemoRecording; url: string; language: Language; onClose: () => void }) {
  return <div className="member-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="member-session-watch recorded-session-dialog" role="dialog" aria-modal="true" aria-labelledby="recorded-session-title"><header><div><p className="member-live-label"><i/>{language === "fr" ? "REPLAY ENREGISTRÉ" : "SAVED SESSION REPLAY"}</p><h2 id="recorded-session-title">{recording.title}</h2></div><button type="button" aria-label={language === "fr" ? "Fermer" : "Close"} onClick={onClose}><X size={19}/></button></header><video src={url} controls autoPlay playsInline className="recorded-session-video"/><p className="recorded-session-caption">{language === "fr" ? `Séance enregistrée avec ${recording.memberName}. Vous pouvez la regarder à votre rythme.` : `Session recorded with ${recording.memberName}. Watch it whenever you like.`}</p><button type="button" className="member-watch-close" onClick={onClose}>{language === "fr" ? "Fermer" : "Close"}</button></section></div>;
}

function MemberBilling({ data, t, language, invoicePeriod, setInvoicePeriod, onRequestInvoice, onPaymentDialog, onDownloadInvoice }: { data: MemberData; t: (typeof copy)[Language]; language: Language; invoicePeriod: string; setInvoicePeriod: (period: string) => void; onRequestInvoice: (event: React.FormEvent<HTMLFormElement>) => void; onPaymentDialog: () => void; onDownloadInvoice: (invoice: MemberInvoice) => void }) {
  return <>
    <MemberSectionHeading eyebrow={t.portal} title={t.billingTitle} description={t.billingSubtitle}/>
    <div className="member-billing-grid"><section className="member-card subscription-card"><div className="member-card-top"><div><p className="member-card-kicker">{t.currentPlan}</p><h2>{t.planName}</h2></div><span className="member-card-icon violet"><Sparkles size={17}/></span></div><span className="subscription-status"><i/>{language === "fr" ? "Actif" : "Active"}</span><div className="subscription-price">149,00 $<small> / {language === "fr" ? "mois" : "month"}</small></div><div className="subscription-facts"><div><span>{t.startDate}</span><b>{language === "fr" ? "18 mai 2026" : "May 18, 2026"}</b></div><div><span>{t.renewalDate}</span><b>{language === "fr" ? "18 décembre 2026" : "December 18, 2026"}</b></div><div><span>{t.monthsLeft}</span><b>{t.oneMonth}</b></div></div><p className="billing-demo-note"><i/>{t.subscriptionNote}</p></section>
      <section className="member-card payment-method-card"><div className="member-card-top"><div><p className="member-card-kicker">{t.paymentMethod}</p><h2>{language === "fr" ? "Votre moyen de paiement" : "Your payment method"}</h2></div><span className="member-card-icon coral"><CreditCard size={17}/></span></div><div className="payment-card-preview"><span className="payment-chip"/><span className="payment-network">{data.paymentMethod === "visa" ? "VISA" : "mastercard"}</span><b>•••• &nbsp;•••• &nbsp;•••• &nbsp;{data.paymentMethod === "visa" ? "4242" : "1881"}</b><small>{data.profile.firstName} {data.profile.lastName}</small></div><button type="button" className="member-outline-button" onClick={onPaymentDialog}><CreditCard size={14}/>{t.managePayment}<ArrowRight size={14}/></button></section></div>
    <div className="member-billing-lower"><section className="member-card invoice-history-card"><div className="member-card-top"><div><p className="member-card-kicker">{t.invoiceHistory}</p><h2>{language === "fr" ? "Vos paiements" : "Your payments"}</h2></div><span className="member-card-icon lime"><FileText size={17}/></span></div><div className="member-invoice-list">{data.invoices.map((invoice) => <article key={invoice.id} className="member-invoice-row"><span className="invoice-file-icon"><FileText size={15}/></span><div><b>{invoice.period}</b><small>{invoice.id}</small></div><strong>{invoice.amount}</strong><span className={`invoice-state ${invoice.status}`}>{invoice.status === "paid" ? t.paid : t.requested}</span><button type="button" aria-label={`${t.downloadInvoice}: ${invoice.period}`} onClick={() => onDownloadInvoice(invoice)}><Download size={15}/></button></article>)}</div></section>
      <section className="member-card request-invoice-card"><div className="member-card-top"><div><p className="member-card-kicker">{t.requestInvoice}</p><h2>{language === "fr" ? "Besoin d’un justificatif ?" : "Need an invoice?"}</h2></div><span className="member-card-icon blue"><FileText size={17}/></span></div><p>{t.requestInvoiceCopy}</p><form onSubmit={onRequestInvoice}><label>{t.period}<select value={invoicePeriod} onChange={(event) => setInvoicePeriod(event.target.value)}>{(language === "fr" ? ["Novembre 2026", "Octobre 2026", "Septembre 2026"] : ["November 2026", "October 2026", "September 2026"]).map((period) => <option key={period}>{period}</option>)}</select></label><button type="submit" className="member-primary-button">{t.sendRequest}<ArrowRight size={14}/></button></form><p className="billing-demo-note"><i/>{t.noRealPayment}</p></section></div>
  </>;
}

function PaymentDialog({ selected, t, language, onClose, onSave }: { selected: "visa" | "mastercard"; t: (typeof copy)[Language]; language: Language; onClose: () => void; onSave: (method: "visa" | "mastercard") => void }) {
  const [method, setMethod] = useState(selected);
  return <div className="member-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="payment-dialog" role="dialog" aria-modal="true" aria-labelledby="payment-dialog-title"><header><div><p className="member-card-kicker">{t.paymentMethod}</p><h2 id="payment-dialog-title">{t.choosePayment}</h2></div><button type="button" aria-label={t.close} onClick={onClose}><X size={18}/></button></header><div className="payment-choice-list"><label className={method === "visa" ? "selected" : ""}><input type="radio" name="payment" checked={method === "visa"} onChange={() => setMethod("visa")}/><span className="payment-choice-logo">VISA</span><span>•••• 4242 <small>{language === "fr" ? "Expire 08/28" : "Expires 08/28"}</small></span><Check size={15}/></label><label className={method === "mastercard" ? "selected" : ""}><input type="radio" name="payment" checked={method === "mastercard"} onChange={() => setMethod("mastercard")}/><span className="payment-choice-logo mc">MC</span><span>•••• 1881 <small>{language === "fr" ? "Expire 03/27" : "Expires 03/27"}</small></span><Check size={15}/></label></div><p className="billing-demo-note"><i/>{t.noRealPayment}</p><div className="payment-dialog-actions"><button type="button" className="member-outline-button" onClick={onClose}>{t.close}</button><button type="button" className="member-primary-button" onClick={() => onSave(method)}>{t.save}<Check size={14}/></button></div></section></div>;
}

function CelebrationDialog({ celebration, language, onClose, onNext }: { celebration: Celebration; language: Language; onClose: () => void; onNext: () => void }) {
  const isCourse = celebration.kind === "course";
  const isBooking = celebration.kind === "booking";
  const title = language === "fr"
    ? isCourse ? "Formation terminée !" : isBooking ? "Séance réservée !" : "Séance de coaching terminée !"
    : isCourse ? "Course completed!" : isBooking ? "Session booked!" : "Coaching session complete!";
  const detail = celebration.detail ?? (language === "fr"
    ? isCourse ? `Bravo ! « ${celebration.title} » est maintenant terminée. Votre progression a été mise à jour.` : `Bravo pour votre séance du ${celebration.title}. Votre présence a été enregistrée et votre parcours de coaching est à jour.`
    : isCourse ? `Well done! “${celebration.title}” is complete. Your progress has been updated.` : `Well done on your ${celebration.title} session. Your attendance is recorded and your coaching journey is up to date.`);
  return <div className="member-celebration-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="member-celebration" role="dialog" aria-modal="true" aria-labelledby="celebration-title"><button className="member-celebration-close" type="button" onClick={onClose} aria-label={language === "fr" ? "Fermer" : "Close"}><X size={19}/></button><div className="celebration-confetti" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div><span className="celebration-icon"><PartyPopper size={31}/></span><p className="celebration-eyebrow">{isBooking ? (language === "fr" ? "C’EST CONFIRMÉ DANS VOTRE AGENDA" : "CONFIRMED IN YOUR CALENDAR") : (language === "fr" ? "UNE BELLE ÉTAPE DE FRANCHIE" : "ANOTHER STEP FORWARD")}</p><h2 id="celebration-title">{title}</h2><p className="celebration-detail">{detail}{isBooking && <><br/><strong>{celebration.title}</strong></>}</p><div className="celebration-next"><Sparkles size={17}/><span>{language === "fr" ? "Votre guide IA peut vous aider à choisir la prochaine étape." : "Your AI guide can help you choose what to do next."}</span></div><div className="celebration-actions"><button type="button" className="member-celebration-secondary" onClick={onClose}>{language === "fr" ? "Rester ici" : "Stay here"}</button><button type="button" className="member-primary-button" onClick={onNext}>{isBooking ? (language === "fr" ? "Voir mon calendrier" : "View my calendar") : (language === "fr" ? "Voir la suite" : "See what’s next")}<ArrowRight size={16}/></button></div></section></div>;
}

type AssistantMessage = { role: "assistant" | "member"; text: string; destination?: Section };

function AICompanion({ language, section, data, open, onOpenChange, onNavigate }: { language: Language; section: Section; data: MemberData; open: boolean; onOpenChange: (open: boolean) => void; onNavigate: (section: Section) => void }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFrench = language === "fr";
  const suggestedLesson = data.lessons.find((lesson) => lesson.progress > 0 && lesson.progress < 100) ?? data.lessons.find((lesson) => lesson.progress < 100);
  const currentSession = [...data.sessions].filter((session) => session.status === "upcoming").sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];
  const progress = Math.round(data.lessons.reduce((sum, lesson) => sum + lesson.progress, 0) / Math.max(1, data.lessons.length));
  const context = section === "coaching"
    ? isFrench ? "Je peux vous aider à préparer votre prochaine séance ou à trouver une date pour réserver." : "I can help you prepare for your next session or find a date to book."
    : section === "profile"
      ? isFrench ? "Un petit conseil : notez vos victoires après chaque séance. Elles rendent vos progrès plus visibles." : "A tip: add a win after each session to make your progress easier to see."
      : section === "learning"
        ? isFrench ? `Votre progression de formation est de ${progress} %. Je peux vous aider à choisir une capsule à poursuivre.` : `Your learning progress is ${progress}%. I can help you choose a lesson to continue.`
        : section === "billing"
          ? isFrench ? "Je peux vous aider à retrouver vos factures ou à comprendre les informations de votre abonnement." : "I can help you find invoices or understand your subscription details."
          : isFrench ? "Votre tableau de bord rassemble vos progrès et vos prochaines étapes. Je peux vous guider dans chaque espace." : "Your dashboard brings together your progress and next steps. I can guide you through each area.";
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, open]);

  const answerFor = (question: string): AssistantMessage => {
    const text = question.toLocaleLowerCase(isFrench ? "fr-CA" : "en-US");
    if (/ensuite|prochain|recommand|conseil|quoi faire|next|recommend|suggest|help me|what should/.test(text)) return {
      role: "assistant",
      text: suggestedLesson
        ? (isFrench ? `Je vous conseille de continuer « ${suggestedLesson.titleFr} », puis de noter une victoire dans votre profil. Votre parcours est complété à ${progress} %${currentSession ? ` et votre prochain coaching est le ${currentSession.date}.` : "."}` : `I recommend continuing “${suggestedLesson.titleEn}”, then adding a win to your profile. Your journey is ${progress}% complete${currentSession ? ` and your next coaching session is on ${currentSession.date}.` : "."}`)
        : (isFrench ? "Toutes vos capsules sont terminées. Consultez Mon coaching pour préparer votre prochaine séance, ou ajoutez une réussite à votre profil." : "You’ve completed all your lessons. Visit My Coaching to prepare for your next session, or add a win to your profile."),
      destination: suggestedLesson ? "learning" : "coaching",
    };
    if (/factur|paiement|abonnement|invoice|billing|payment|subscription/.test(text)) return { role: "assistant", text: isFrench ? "Ouvrez Abonnement & facturation pour consulter votre formule, choisir une période et télécharger une facture de démonstration." : "Open Subscription & Billing to review your plan, choose a period, and download a demo invoice.", destination: "billing" };
    if (/profil|objectif|victoire|réussite|profile|goal|win/.test(text)) return { role: "assistant", text: isFrench ? "Dans Mon profil, vous pouvez mettre à jour vos coordonnées, préciser votre objectif et ajouter une réussite ou un Big Win." : "In My Profile, update your details, refine your goal, and add a win or Big Win.", destination: "profile" };
    if (/séance|coaching|réserv|calend|session|book|calendar|coach/.test(text)) return { role: "assistant", text: currentSession ? (isFrench ? `Votre prochain rendez-vous est prévu le ${currentSession.date} à ${currentSession.time}. Dans Mon coaching, vous pouvez ouvrir le lien de rencontre ou réserver un autre créneau.` : `Your next session is scheduled for ${currentSession.date} at ${currentSession.time}. In My Coaching, open the meeting link or book another time.`) : (isFrench ? "Vous n’avez pas de séance à venir. Ouvrez Mon coaching pour choisir une date et réserver." : "You have no upcoming session. Open My Coaching to choose a date and book one."), destination: "coaching" };
    if (/formation|capsule|cours|apprend|course|lesson|learn|progress/.test(text)) return { role: "assistant", text: suggestedLesson ? (isFrench ? `Votre progression est de ${progress} %. Je vous recommande de reprendre « ${suggestedLesson.titleFr} » (${suggestedLesson.progress} % terminée).` : `You’re ${progress}% through your learning plan. I recommend continuing “${suggestedLesson.titleEn}” (${suggestedLesson.progress}% complete).`) : (isFrench ? "Toutes vos capsules sont terminées. Bravo ! Vous pouvez revoir une formation ou demander à votre coach une nouvelle recommandation." : "You’ve completed all your lessons. Great work! Review a course or ask your coach for another recommendation."), destination: "learning" };
    return { role: "assistant", text: isFrench ? `${context} Vous pouvez aussi me demander de vous aider avec vos formations, votre coaching, votre profil ou vos factures.` : `${context} You can also ask for help with learning, coaching, your profile, or invoices.` };
  };
  const send = (question = draft) => {
    const clean = question.trim();
    if (!clean) return;
    setMessages((current) => [...current, { role: "member", text: clean }, answerFor(clean)]);
    setDraft("");
  };
  const quickPrompts = isFrench ? ["Que faire ensuite ?", "Préparer mon coaching", "Reprendre une formation"] : ["What should I do next?", "Prepare for coaching", "Continue a course"];
  return <>
    {open && <section className="member-ai-panel" aria-label={isFrench ? "Assistant IA" : "AI assistant"}>
      <header><span className="member-ai-mark"><Bot size={19}/></span><div><b>{isFrench ? "Coach IA" : "AI Coach"}<small>{isFrench ? "Guide de démonstration" : "Demo guide"}</small></b></div><button type="button" aria-label={isFrench ? "Fermer" : "Close"} onClick={() => onOpenChange(false)}><X size={17}/></button></header>
      <div className="member-ai-context"><Sparkles size={15}/><span>{context}</span></div>
      <div className="member-ai-messages" aria-live="polite">
        {!messages.length && <div className="member-ai-welcome"><span className="member-ai-bubble"><Bot size={15}/></span><p>{isFrench ? `Bonjour ${data.profile.firstName} ! Je peux vous guider dans votre parcours. Que souhaitez-vous faire ?` : `Hi ${data.profile.firstName}! I can help guide your journey. What would you like to do?`}</p><div className="member-ai-prompts">{quickPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => send(prompt)}>{prompt}<ArrowUpRight size={12}/></button>)}</div></div>}
        {messages.map((message, index) => <article className={`member-ai-message ${message.role}`} key={`${index}-${message.role}`}><span className="member-ai-bubble">{message.role === "assistant" ? <Bot size={14}/> : <UserRound size={14}/>}</span><div><p>{message.text}</p>{message.destination && <button type="button" onClick={() => { onNavigate(message.destination!); onOpenChange(false); }}>{isFrench ? "Ouvrir cet espace" : "Open this section"}<ArrowRight size={13}/></button>}</div></article>)}
        <div ref={messagesEndRef}/>
      </div>
      <form className="member-ai-form" onSubmit={(event) => { event.preventDefault(); send(); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={isFrench ? "Posez votre question…" : "Ask a question…"} aria-label={isFrench ? "Votre question" : "Your question"}/><button type="submit" disabled={!draft.trim()} aria-label={isFrench ? "Envoyer" : "Send"}><Send size={16}/></button></form>
      <p className="member-ai-disclaimer">{isFrench ? "Conseils de démonstration basés sur votre progression. Aucun service IA externe n’est connecté." : "Demo guidance based on your progress. No external AI service is connected."}</p>
    </section>}
    <button type="button" className={`member-ai-launcher${open ? " open" : ""}`} onClick={() => onOpenChange(!open)} aria-expanded={open} aria-label={open ? (isFrench ? "Fermer le guide IA" : "Close AI guide") : (isFrench ? "Ouvrir le guide IA" : "Open AI guide")}><span>{open ? <X size={21}/> : <MessageCircle size={21}/>}</span><b>{open ? (isFrench ? "Fermer" : "Close") : (isFrench ? "Besoin d’aide ?" : "Need help?")}</b><i/></button>
  </>;
}

