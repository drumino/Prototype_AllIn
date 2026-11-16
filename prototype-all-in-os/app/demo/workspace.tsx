"use client";

import Link from "next/link";
import {
  Activity, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen,
  CalendarDays, Camera, Check, CheckCheck, ChevronDown, CircleCheck,
  Clock3, CreditCard, Download, FileText, LayoutDashboard, ListChecks,
  Play, Plus, Sparkles, StopCircle, UsersRound, Video,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MemberPortal } from "@/app/demo/member-portal";
import { CoachMonitor } from "@/app/demo/coach-monitor";
import { DemoCoachingSession, DemoRecording, readDemoRecordings, readDemoSessions, saveDemoRecording, writeDemoRecordings, writeDemoSessions } from "@/app/demo/demo-storage";

type Language = "fr" | "en";
type Role = "member" | "coach" | "team";
type View = "overview" | "learning" | "coaching" | "profile" | "members" | "operations" | "billing" | "studio";
type Course = { id: string; title: string; category: string; duration: string; level: string; progress: number; color: string };
type Task = { id: number; title: string; owner: string; due: string; done: boolean };

const initialCourses: Course[] = [
  { id: "foundations", title: "Les fondamentaux du leadership", category: "Leadership", duration: "4 modules · 2 h", level: "Essentiel", progress: 75, color: "sage" },
  { id: "focus", title: "Retrouver son focus", category: "Productivité", duration: "3 modules · 1 h 30", level: "Intermédiaire", progress: 33, color: "sand" },
  { id: "communication", title: "Conversations qui font avancer", category: "Communication", duration: "5 modules · 3 h", level: "Essentiel", progress: 0, color: "lavender" },
  { id: "strategy", title: "De la vision à l’action", category: "Stratégie", duration: "4 modules · 2 h 15", level: "Avancé", progress: 0, color: "blue" },
];

const courseCopy: Record<Language, Record<string, Pick<Course, "title" | "category" | "level">>> = {
  fr: {
    foundations: { title: "Les fondamentaux du leadership", category: "Leadership", level: "Essentiel" },
    focus: { title: "Retrouver son focus", category: "Productivité", level: "Intermédiaire" },
    communication: { title: "Conversations qui font avancer", category: "Communication", level: "Essentiel" },
    strategy: { title: "De la vision à l’action", category: "Stratégie", level: "Avancé" },
  },
  en: {
    foundations: { title: "Leadership foundations", category: "Leadership", level: "Foundational" },
    focus: { title: "Find your focus", category: "Productivity", level: "Intermediate" },
    communication: { title: "Conversations that move work forward", category: "Communication", level: "Foundational" },
    strategy: { title: "From vision to action", category: "Strategy", level: "Advanced" },
  },
};

function localizedCourse(course: Course, language: Language): Course {
  return { ...course, ...courseCopy[language][course.id] };
}

const translations = {
  fr: {
    product: "Votre espace de travail connecté", overview: "Vue d’ensemble", learning: "Parcours & formations", coaching: "Coaching", members: "Membres", operations: "Tâches d’équipe", billing: "Abonnement", studio: "Studio vidéo", help: "Centre d’aide", roles: { member: "Membre", coach: "Coach", team: "Équipe" },
    welcome: { member: "Bonjour, Jordan", coach: "Bonjour, Alex", team: "Bonjour, équipe" }, subtitle: "Voici les éléments à suivre aujourd’hui.", date: "LUNDI 18 NOVEMBRE", thisMonth: "Ce mois-ci", progress: "Progression du parcours", continue: "Continuer le parcours", nextSession: "Votre prochaine séance", today: "Aujourd’hui", join: "Préparer la séance", aiTitle: "Votre coach IA", aiSubtitle: "Analyse de progression", analyze: "Analyser ma progression", analyzing: "Analyse en cours…", aiLabel: "ASSISTANT DE DÉMONSTRATION", recTitle: "Une prochaine étape pour vous", recBody: "Votre progression montre une belle dynamique. Le module suivant peut vous aider à transformer vos objectifs en habitudes régulières.", recommendation: "Formation recommandée", openCourse: "Voir la formation", yourCourses: "Vos parcours", coursesSubtitle: "Reprenez là où vous en étiez et découvrez la suite.", start: "Commencer", resume: "Reprendre", completed: "Terminé", sessions: "Séances à venir", sessionHistory: "Historique récent", upcoming: "À venir", confirmed: "Confirmée", sessionWith: "Séance avec", memberJourney: "Parcours membres", memberSubtitle: "Suivez les progrès et préparez vos prochains échanges.", progressLabel: "Progression", lastSession: "Dernière séance", followup: "À suivre", summary: "Générer un résumé", summaryReady: "Résumé préparé à partir des notes de démonstration.", tasks: "Suivis opérationnels", tasksSubtitle: "Les prochaines actions de l’équipe.", markDone: "Marquer comme fait", done: "Terminé", activeMembers: "Membres actifs", sessionsMonth: "Séances ce mois", subscriptions: "Abonnements", attention: "À traiter", billingTitle: "Abonnements & facturation", billingSubtitle: "Aperçu de démonstration — aucune transaction réelle.", currentPlan: "Votre formule", renewal: "Prochain renouvellement", invoices: "Factures récentes", paid: "Payée", videoTitle: "Studio vidéo", videoSubtitle: "Enregistrez une séance de démonstration directement depuis votre navigateur.", cameraStop: "Arr\u00eater la cam\u00e9ra", cameraStart: "Activer la caméra", recordingStart: "Démarrer l’enregistrement", recordingStop: "Arrêter et préparer la vidéo", download: "Télécharger la vidéo", cameraHint: "Autorisez l’accès à votre caméra et votre micro pour enregistrer. La vidéo reste dans votre navigateur.", recording: "ENREGISTREMENT EN COURS", ready: "Vidéo prête à télécharger", unsupported: "L’enregistrement vidéo n’est pas pris en charge par ce navigateur.", cameraError: "Accès caméra refusé ou indisponible. Vérifiez les permissions du navigateur.", liveNote: "L’enregistrement est fonctionnel. La diffusion à plusieurs personnes nécessite un service vidéo et une connexion serveur.", sample: "Données d’exemple", localAi: "Analyse locale de démonstration · aucune donnée envoyée", language: "Langue", back: "Retour au site", search: "Rechercher…", viewAll: "Tout voir", goal: "Objectif du mois", goalBody: "Compléter votre module en cours", invite: "Inviter un membre", addTask: "Ajouter un suivi", active: "Actif", followupStatus: "À relancer", doneStatus: "À jour", dueToday: "Aujourd’hui", dueTomorrow: "Demain", recent: "Récent", noAnalysis: "Lancez une analyse pour obtenir un retour personnalisé à partir de votre progression.", readyAnalysis: "Analyse terminée : votre activité est régulière. La formation recommandée ci-dessous correspond à la prochaine étape de votre parcours.", weekly: "Semaine du 18 nov.", plan: "Formule Accompagnement", dateNov: "18 nov. 2026", invoice: "Facture", status: "Statut", amount: "Montant", action: "Action", openWorkspace: "Espace de travail", menu: "Navigation", statNote: "Évolution récente", coachingHint: "Vos séances et vos actions de suivi au même endroit.", taskComplete: "Action terminée", analyzeInsight: "L’analyse s’appuie sur vos modules et votre activité de démonstration.",
  },
  en: {
    product: "Your connected workspace", overview: "Overview", learning: "Learning paths", coaching: "Coaching", members: "Members", operations: "Team tasks", billing: "Subscription", studio: "Video studio", help: "Help center", roles: { member: "Member", coach: "Coach", team: "Team" },
    welcome: { member: "Good morning, Jordan", coach: "Good morning, Alex", team: "Good morning, team" }, subtitle: "Here’s what needs your attention today.", date: "MONDAY, NOVEMBER 18", thisMonth: "This month", progress: "Learning path progress", continue: "Continue learning", nextSession: "Your next session", today: "Today", join: "Prepare session", aiTitle: "Your AI coach", aiSubtitle: "Progress analysis", analyze: "Analyze my progress", analyzing: "Analyzing…", aiLabel: "DEMO ASSISTANT", recTitle: "A next step for you", recBody: "Your progress shows steady momentum. The next module can help turn your goals into consistent habits.", recommendation: "Recommended course", openCourse: "View course", yourCourses: "Your learning paths", coursesSubtitle: "Pick up where you left off and discover what’s next.", start: "Start course", resume: "Continue", completed: "Completed", sessions: "Upcoming sessions", sessionHistory: "Recent history", upcoming: "Upcoming", confirmed: "Confirmed", sessionWith: "Session with", memberJourney: "Member journeys", memberSubtitle: "Follow progress and prepare for your next conversations.", progressLabel: "Progress", lastSession: "Last session", followup: "Follow-up", summary: "Generate summary", summaryReady: "Summary drafted from the sample session notes.", tasks: "Operations follow-ups", tasksSubtitle: "The team’s next actions.", markDone: "Mark complete", done: "Done", activeMembers: "Active members", sessionsMonth: "Sessions this month", subscriptions: "Subscriptions", attention: "Needs attention", billingTitle: "Subscriptions & billing", billingSubtitle: "Illustrative overview — no real transactions.", currentPlan: "Your plan", renewal: "Next renewal", invoices: "Recent invoices", paid: "Paid", videoTitle: "Video studio", videoSubtitle: "Record a demo session directly in your browser.", cameraStop: "Stop camera", cameraStart: "Enable camera", recordingStart: "Start recording", recordingStop: "Stop and prepare video", download: "Download video", cameraHint: "Allow camera and microphone access to record. Your video stays in your browser.", recording: "RECORDING", ready: "Video ready to download", unsupported: "Video recording is not supported by this browser.", cameraError: "Camera access was denied or is unavailable. Check your browser permissions.", liveNote: "Recording works. Broadcasting to multiple people requires a video service and server connection.", sample: "Sample data", localAi: "Local demo analysis · no data is sent", language: "Language", back: "Back to website", search: "Search…", viewAll: "View all", goal: "Monthly goal", goalBody: "Complete your current module", invite: "Invite member", addTask: "Add follow-up", active: "Active", followupStatus: "Follow up", doneStatus: "On track", dueToday: "Today", dueTomorrow: "Tomorrow", recent: "Recent", noAnalysis: "Run an analysis to get feedback based on your learning progress.", readyAnalysis: "Analysis complete: your activity is consistent. The recommended course below fits the next step in your learning path.", weekly: "Week of Nov 18", plan: "Coaching plan", dateNov: "Nov 18, 2026", invoice: "Invoice", status: "Status", amount: "Amount", action: "Action", openWorkspace: "Workspace", menu: "Navigation", statNote: "Recent change", coachingHint: "Sessions and follow-up actions together in one place.", taskComplete: "Task complete", analyzeInsight: "Analysis uses your demo learning modules and activity.",
  },
} as const;

const seedTasks: Task[] = [
  { id: 1, title: "Relire les notes de séance de Jordan", owner: "Alex Martin", due: "dueToday", done: false },
  { id: 2, title: "Préparer le point de renouvellement · Sam", owner: "Nora Ben Ali", due: "dueTomorrow", done: false },
  { id: 3, title: "Partager le parcours Leadership", owner: "Alex Martin", due: "recent", done: true },
];

function taskTitle(task: Task, language: Language) {
  const sampleTitles: Record<number, Record<Language, string>> = {
    1: { fr: "Relire les notes de séance de Jordan", en: "Review Jordan’s session notes" },
    2: { fr: "Préparer le point de renouvellement · Sam", en: "Prepare Sam’s renewal check-in" },
    3: { fr: "Partager le parcours Leadership", en: "Share the Leadership learning path" },
  };
  return sampleTitles[task.id]?.[language] ?? task.title;
}

function progressAnalysis(language: Language, progress: number, course?: Course) {
  const courseName = course ? localizedCourse(course, language).title : language === "fr" ? "aucune formation restante" : "no remaining course";
  return language === "fr"
    ? `Votre progression moyenne est de ${progress} %. Prochaine étape suggérée : ${courseName}.`
    : `Your average learning progress is ${progress}%. Suggested next step: ${courseName}.`;
}

export function Workspace() {
  const [language, setLanguage] = useState<Language>("fr");
  const [role, setRole] = useState<Role>("member");
  const [view, setView] = useState<View>("overview");
  const [courses, setCourses] = useState(initialCourses);
  const [tasks, setTasks] = useState(seedTasks);
  const [analysis, setAnalysis] = useState(false);
  const [summary, setSummary] = useState(false);
  const [notice, setNotice] = useState("");
  const [cameraError, setCameraError] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");
  const [coachingSessions, setCoachingSessions] = useState<DemoCoachingSession[]>([]);
  const [savedRecordings, setSavedRecordings] = useState<DemoRecording[]>([]);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [recordingSaving, setRecordingSaving] = useState(false);
  const [recordingPersisted, setRecordingPersisted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingStartedAtRef = useRef(0);
  const t = translations[language];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedLanguage = localStorage.getItem("allin-language");
        if (savedLanguage === "fr" || savedLanguage === "en") setLanguage(savedLanguage);
        const savedCourses = localStorage.getItem("allin-courses");
        const savedTasks = localStorage.getItem("allin-tasks");
        if (savedCourses) setCourses(JSON.parse(savedCourses) as Course[]);
        if (savedTasks) setTasks(JSON.parse(savedTasks) as Task[]);
        setCoachingSessions(readDemoSessions());
        setSavedRecordings(readDemoRecordings());
      } catch { /* Keep the sample workspace when browser storage is unavailable. */ }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("allin-language", language);
    localStorage.setItem("allin-courses", JSON.stringify(courses));
    localStorage.setItem("allin-tasks", JSON.stringify(tasks));
    writeDemoSessions(coachingSessions);
    writeDemoRecordings(savedRecordings);
  }, [language, courses, tasks, coachingSessions, savedRecordings, hydrated]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
  }, [recordedUrl]);

  useEffect(() => {
    const syncSharedDemoData = (event: StorageEvent) => {
      if (event.key === "allin-coaching-sessions") setCoachingSessions(readDemoSessions());
      if (event.key === "allin-recorded-sessions") setSavedRecordings(readDemoRecordings());
    };
    window.addEventListener("storage", syncSharedDemoData);
    return () => window.removeEventListener("storage", syncSharedDemoData);
  }, []);

  const averageProgress = useMemo(() => Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length), [courses]);
  const recommendedCourse = useMemo(() => courses.find((course) => course.progress < 100), [courses]);
  const incompleteTasks = tasks.filter((task) => !task.done).length;

  const changeLanguage = (value: Language) => setLanguage(value);
  const toggleTask = (taskId: number) => setTasks((items) => items.map((task) => task.id === taskId ? { ...task, done: !task.done } : task));
  const updateCourse = (courseId: string) => setCourses((items) => items.map((course) => course.id === courseId ? { ...course, progress: Math.min(100, course.progress + 25) } : course));
  const addCoachingSession = (date: string, time: string) => {
    const account = (() => { try { return JSON.parse(localStorage.getItem("allin-member-portal") || "{}").profile as { firstName?: string; lastName?: string } | undefined; } catch { return undefined; } })();
    const memberName = `${account?.firstName || "Jordan"} ${account?.lastName || "Lee"}`;
    const session: DemoCoachingSession = { id: crypto.randomUUID(), date, time, coach: "Alex Martin", memberName, status: "upcoming", summary: "" };
    const next = [session, ...coachingSessions];
    setCoachingSessions(next);
    writeDemoSessions(next);
    setNotice(language === "fr" ? `Séance ajoutée pour ${memberName}. Elle apparaît maintenant dans son espace membre.` : `Session added for ${memberName}. It now appears in their member portal.`);
  };

  async function enableCamera() {
    setCameraError(false);
    if (!navigator.mediaDevices?.getUserMedia) { setCameraError(true); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch { setCameraError(true); }
  }

  function stopCamera() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setRecording(false);
    setCameraActive(false);
  }

  function startRecording() {
    const stream = streamRef.current;
    if (!stream || typeof MediaRecorder === "undefined") { setCameraError(true); return; }
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
      chunksRef.current = [];
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(URL.createObjectURL(blob));
      setVideoReady(true);
      setRecordingSaving(true);
      try {
        const profile = (() => { try { return JSON.parse(localStorage.getItem("allin-member-portal") || "{}").profile as { firstName?: string; lastName?: string; email?: string } | undefined; } catch { return undefined; } })();
        const metadata: DemoRecording = {
          id: crypto.randomUUID(),
          title: recordingTitle.trim() || (language === "fr" ? "Replay de coaching" : "Coaching session replay"),
          memberEmail: profile?.email || "jordan.lee@example.com",
          memberName: `${profile?.firstName || "Jordan"} ${profile?.lastName || "Lee"}`,
          createdAt: new Date().toISOString(),
          durationSeconds: Math.max(1, Math.round((Date.now() - recordingStartedAtRef.current) / 1000)),
          mimeType: blob.type,
        };
        await saveDemoRecording(metadata.id, blob);
        setSavedRecordings((items) => [metadata, ...items]);
        setRecordingPersisted(true);
        setNotice(language === "fr" ? "Replay enregistré et ajouté à l’espace de coaching du membre." : "Replay saved and added to the member’s coaching space.");
      } catch {
        setRecordingPersisted(false);
        setNotice(language === "fr" ? "La vidéo est prête, mais n’a pas pu être sauvegardée sur cet appareil." : "The video is ready, but could not be saved on this device.");
      } finally {
        setRecordingSaving(false);
      }
    };
    recorder.start();
    recordingStartedAtRef.current = Date.now();
    setRecordingPersisted(false);
    setVideoReady(false);
    setRecording(true);
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setRecording(false);
  }

  function downloadRecording() {
    if (!recordedUrl) return;
    const link = document.createElement("a");
    link.href = recordedUrl;
    link.download = "all-in-os-session.webm";
    link.click();
  }

  const upcomingSessions = coachingSessions.filter((session) => session.status === "upcoming").sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)).map((session) => {
    const name = session.memberName || "Jordan Lee";
    const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
    return { name, topic: "Coaching personnalisé", time: session.time, duration: "45 min", initials, tone: "sage", date: session.date };
  });

  const openView = (target: View) => { if (target !== "studio") stopCamera(); setView(target); setNotice(""); setSummary(false); };
  const dueLabel = (due: Task["due"]) => due === "dueToday" ? t.dueToday : due === "dueTomorrow" ? t.dueTomorrow : t.recent;

  if (role === "member") {
    return <MemberPortal language={language} onLanguageChange={setLanguage} onRoleChange={(nextRole) => { stopCamera(); setCoachingSessions(readDemoSessions()); setSavedRecordings(readDemoRecordings()); setRole(nextRole); setView("overview"); }} />;
  }

  return (
    <main className="workspace-page" lang={language}>
      <aside className="workspace-sidebar">
        <div className="workspace-brand-row"><Link className="workspace-brand" href="/"><span className="wordmark-mark">A</span><span>ALL-IN <i>OS</i></span></Link><span className="workspace-tag">BETA</span></div>
        <p className="workspace-label">{t.openWorkspace}</p>
        <div className="role-switcher" aria-label="Workspace role">
          {(["member", "coach", "team"] as const).map((item) => <button key={item} type="button" className={role === item ? "selected" : ""} onClick={() => { stopCamera(); setRole(item); setView("overview"); }}>{item === "member" ? <CircleCheck size={14}/> : item === "coach" ? <CalendarDays size={14}/> : <UsersRound size={14}/>}<span>{t.roles[item]}</span></button>)}
        </div>
        <p className="workspace-label nav-label">{t.menu}</p>
        <nav className="workspace-nav" aria-label={t.menu}>
          <NavItem icon={<LayoutDashboard size={16}/>} label={t.overview} active={view === "overview"} onClick={() => openView("overview")}/>
          {role === "coach" && <>
            <NavItem icon={<UsersRound size={16}/>} label={t.members} active={view === "members"} onClick={() => openView("members")}/>
            <NavItem icon={<CalendarDays size={16}/>} label={t.coaching} active={view === "coaching"} onClick={() => openView("coaching")}/>
            <NavItem icon={<Video size={16}/>} label={t.studio} active={view === "studio"} onClick={() => openView("studio")}/>
          </>}
          {role === "team" && <>
            <NavItem icon={<UsersRound size={16}/>} label={t.members} active={view === "members"} onClick={() => openView("members")}/>
            <NavItem icon={<ListChecks size={16}/>} label={t.operations} active={view === "operations"} onClick={() => openView("operations")}/>
            <NavItem icon={<CreditCard size={16}/>} label={t.billing} active={view === "billing"} onClick={() => openView("billing")}/>
            <NavItem icon={<Video size={16}/>} label={t.studio} active={view === "studio"} onClick={() => openView("studio")}/>
          </>}
        </nav>
        <div className="workspace-sidebar-bottom"><div className="workspace-help"><span>?</span><div><b>{t.help}</b><small>ALL-IN OS · 0.1</small></div><ArrowUpRight size={14}/></div><Link className="back-to-site" href="/"><ArrowLeft size={14}/>{t.back}</Link></div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-topbar"><div className="topbar-breadcrumb"><span>{t.product}</span><b>/</b><strong>{viewTitle(view, t)}</strong></div><div className="topbar-actions"><span className="sample-data"><i/>{t.sample}</span><div className="language-switch" aria-label={t.language}><button type="button" className={language === "fr" ? "active" : ""} onClick={() => changeLanguage("fr")} aria-pressed={language === "fr"}>FR</button><button type="button" className={language === "en" ? "active" : ""} onClick={() => changeLanguage("en")} aria-pressed={language === "en"}>EN</button></div><button className="profile-button" type="button" aria-label="AM profile">AM<ChevronDown size={12}/></button></div></header>
        <div className="workspace-content">
          {view === "overview" && <OverviewView role={role} t={t} language={language} averageProgress={averageProgress} recommendedCourse={recommendedCourse} courses={courses} tasks={tasks} upcomingSessions={upcomingSessions} incompleteTasks={incompleteTasks} analysis={analysis} setAnalysis={setAnalysis} dueLabel={dueLabel} onCourse={() => openView("learning")} onTasks={() => openView("operations")} onSession={() => openView("coaching")} notice={notice}/>}
          {view === "learning" && <LearningView t={t} language={language} courses={courses} averageProgress={averageProgress} recommendedCourse={recommendedCourse} onUpdate={updateCourse} onAnalyze={() => setAnalysis(true)} analysis={analysis}/>}
          {view === "coaching" && <CoachingView t={t} language={language} sessions={coachingSessions} onAddSession={addCoachingSession} notice={notice} role={role}/>}
          {view === "members" && <MembersView t={t} language={language} summary={summary} setSummary={setSummary} role={role}/>}
          {view === "operations" && <OperationsView t={t} language={language} tasks={tasks} dueLabel={dueLabel} onToggle={toggleTask} onAdd={() => { const newTask: Task = { id: Date.now(), title: language === "fr" ? "Nouveau suivi membre" : "New member follow-up", owner: language === "fr" ? "Vous" : "You", due: "dueToday", done: false }; setTasks((items) => [newTask, ...items]); }}/>}
          {view === "billing" && <BillingView t={t} language={language}/>}
          {view === "studio" && <StudioView t={t} language={language} videoRef={videoRef} cameraActive={cameraActive} recording={recording} videoReady={videoReady} recordedUrl={recordedUrl} cameraError={cameraError} recordingTitle={recordingTitle} onTitleChange={setRecordingTitle} savedRecordings={savedRecordings} saving={recordingSaving} persisted={recordingPersisted} onEnableCamera={enableCamera} onStopCamera={stopCamera} onStart={startRecording} onStop={stopRecording} onDownload={downloadRecording}/>}
        </div>
      </section>
    </main>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button type="button" className={`workspace-nav-item${active ? " active" : ""}`} onClick={onClick}>{icon}<span>{label}</span>{active && <i/>}</button>;
}

function viewTitle(view: View, t: (typeof translations)[Language]) {
  const titles: Record<View, string> = { overview: t.overview, learning: t.learning, coaching: t.coaching, profile: t.members, members: t.members, operations: t.operations, billing: t.billing, studio: t.studio };
  return titles[view];
}

function OverviewView({ role, t, language, averageProgress, recommendedCourse, courses, tasks, upcomingSessions, incompleteTasks, analysis, setAnalysis, dueLabel, onCourse, onTasks, onSession, notice }: {
  role: Role; t: (typeof translations)[Language]; language: Language; averageProgress: number; recommendedCourse?: Course; courses: Course[]; tasks: Task[]; upcomingSessions: { name: string; topic: string; time: string; duration: string; initials: string; tone: string; date: string }[]; incompleteTasks: number; analysis: boolean; setAnalysis: (value: boolean) => void; dueLabel: (due: Task["due"]) => string; onCourse: () => void; onTasks: () => void; onSession: () => void; notice: string;
}) {
  const welcome = t.welcome[role];
  return <>
    <div className="workspace-page-heading"><div><p className="workspace-date">{t.date}</p><h1>{welcome}<span>✳</span></h1><p>{t.subtitle}</p></div><button className="outline-button" type="button" onClick={onSession}><Plus size={15}/>{language === "fr" ? "Planifier" : "Schedule"}</button></div>
    {notice && <div className="workspace-inline-notice"><CircleCheck size={15}/>{notice}</div>}
    <div className="workspace-stat-grid">
      <StatCard icon={<UsersRound size={15}/>} label={t.activeMembers} value="248" note="+8,2 %" tone="green"/>
      <StatCard icon={<CalendarDays size={15}/>} label={t.sessionsMonth} value="86" note="+12,4 %" tone="orange"/>
      <StatCard icon={<Activity size={15}/>} label={role === "member" ? t.progress : t.subscriptions} value={role === "member" ? `${averageProgress}%` : "92 %"} note={role === "member" ? t.thisMonth : t.doneStatus} tone="blue"/>
      <StatCard icon={<ListChecks size={15}/>} label={t.attention} value={String(incompleteTasks).padStart(2, "0")} note={`${incompleteTasks} ${t.dueToday}`} tone="violet"/>
    </div>
    <div className="workspace-overview-grid">
      <section className="workspace-card course-progress-card"><CardHeading kicker={t.goal} title={t.progress}/><div className="learning-progress-hero"><div className="progress-ring" style={{ "--progress": `${averageProgress}%` } as React.CSSProperties}><span>{averageProgress}<small>%</small></span></div><div><b>{t.goalBody}</b><p>{language === "fr" ? "Votre parcours évolue à votre rythme." : "Your learning path is moving at your pace."}</p><button className="text-action" type="button" onClick={onCourse}>{t.continue}<ArrowRight size={14}/></button></div></div><div className="course-progress-list">{courses.slice(0, 3).map((course) => <div className="course-progress-row" key={course.id}><span className={`course-dot ${course.color}`}/><span>{localizedCourse(course, language).title}</span><b>{course.progress}%</b><div className="thin-progress"><i style={{ width: `${course.progress}%` }}/></div></div>)}</div></section>
      <section className="workspace-card ai-coach-card"><div className="ai-card-heading"><span><Sparkles size={15}/></span><div><p>{t.aiLabel}</p><h2>{t.aiTitle}</h2></div><span className="ai-card-status"><i/> {t.aiSubtitle}</span></div>{analysis ? <div className="analysis-result"><div className="analysis-result-icon"><Check size={15}/></div><div><b>{progressAnalysis(language, averageProgress, recommendedCourse)}</b><p>{t.analyzeInsight}</p></div></div> : <div className="ai-recommendation"><span className="recommendation-icon"><BookOpen size={15}/></span><div><small>{t.recommendation}</small><b>{recommendedCourse ? localizedCourse(recommendedCourse, language).title : t.completed}</b><p>{t.recBody}</p></div></div>}<button className="ai-analyze-button" type="button" onClick={() => analysis ? onCourse() : setAnalysis(true)}><Sparkles size={14}/>{analysis ? t.openCourse : t.analyze}<ArrowRight size={14}/></button><p className="local-ai-note"><i/>{t.localAi}</p></section>
    </div>
    <div className="workspace-lower-grid"><section className="workspace-card sessions-card"><CardHeading kicker={t.thisMonth} title={t.sessions}/><div className="session-list">{upcomingSessions.slice(0, 2).map((session) => <div className="workspace-session" key={session.name + session.date}><div className="session-time-block"><b>{session.time}</b><span>{new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { month: "short", day: "numeric" }).format(new Date(session.date + "T12:00:00"))}</span></div><span className={`workspace-avatar ${session.tone}`}>{session.initials}</span><div className="workspace-session-info"><b>{t.sessionWith} {session.name}</b><span>{language === "fr" ? session.topic : "One-to-one coaching"}</span></div><span className="session-state">{t.upcoming}</span></div>)}</div>{upcomingSessions.length === 0 && <p className="coach-schedule-empty">{language === "fr" ? "Aucune séance à venir." : "No upcoming sessions."}</p>}<button className="card-footer-link" type="button" onClick={onSession}>{t.coaching}<ArrowRight size={14}/></button></section><section className="workspace-card tasks-card"><CardHeading kicker={t.attention} title={t.tasks}/><div className="compact-task-list">{tasks.filter((task) => !task.done).slice(0, 3).map((task) => <div className="compact-task" key={task.id}><span className="task-priority"/><div><b>{taskTitle(task, language)}</b><small>{task.owner} · {dueLabel(task.due)}</small></div><ArrowUpRight size={14}/></div>)}</div><button className="card-footer-link" type="button" onClick={onTasks}>{t.viewAll}<ArrowRight size={14}/></button></section></div>
  </>;
}

function StatCard({ icon, label, value, note, tone }: { icon: React.ReactNode; label: string; value: string; note: string; tone: string }) {
  return <article className="workspace-stat-card"><span className={`stat-icon ${tone}`}>{icon}</span><span className="stat-label">{label}</span><strong>{value}</strong><small><ArrowUpRight size={12}/>{note}</small><div className={`stat-spark ${tone}`}><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article>;
}

function CardHeading({ kicker, title }: { kicker: string; title: string }) {
  return <div className="workspace-card-heading"><div><p>{kicker}</p><h2>{title}</h2></div><span className="card-heading-decoration" aria-hidden="true"><ChevronDown size={15}/></span></div>;
}

function LearningView({ t, language, courses, averageProgress, recommendedCourse, onUpdate, onAnalyze, analysis }: { t: (typeof translations)[Language]; language: Language; courses: Course[]; averageProgress: number; recommendedCourse?: Course; onUpdate: (id: string) => void; onAnalyze: () => void; analysis: boolean }) {
  return <>
    <div className="workspace-page-heading"><div><p className="workspace-date">{t.learning.toUpperCase()}</p><h1>{t.yourCourses}</h1><p>{t.coursesSubtitle}</p></div><button type="button" className="outline-button" onClick={onAnalyze}><Sparkles size={14}/>{t.analyze}</button></div>
    <div className="learning-summary-banner"><div className="summary-banner-icon"><Activity size={18}/></div><div><small>{t.progress}</small><b>{averageProgress}%</b></div><div className="summary-banner-track"><i style={{ width: `${averageProgress}%` }}/></div><span>{analysis ? progressAnalysis(language, averageProgress, recommendedCourse) : t.noAnalysis}</span></div>
    <div className="course-catalog-grid">{courses.map((course, index) => { const displayCourse = localizedCourse(course, t === translations.fr ? "fr" : "en"); return <article className="catalog-course-card" key={course.id}><div className={`catalog-course-art ${course.color}`}><span className="course-number">0{index + 1}</span><span className="catalog-course-symbol">{index === 0 ? <Activity size={25}/> : index === 1 ? <Clock3 size={25}/> : index === 2 ? <UsersRound size={25}/> : <ArrowUpRight size={25}/>}</span><span className="catalog-category">{displayCourse.category}</span></div><div className="catalog-course-content"><div className="course-meta"><span>{displayCourse.level}</span><span>{course.duration}</span></div><h2>{displayCourse.title}</h2><div className="catalog-progress-label"><span>{t.progressLabel}</span><b>{course.progress}%</b></div><div className="catalog-progress"><i style={{ width: `${course.progress}%` }}/></div><button type="button" className="catalog-course-action" onClick={() => onUpdate(course.id)} disabled={course.progress === 100}>{course.progress === 100 ? t.completed : course.progress > 0 ? t.resume : t.start}{course.progress === 100 ? <Check size={14}/> : <ArrowRight size={14}/>}</button></div></article>; })}</div>
    <p className="workspace-footnote"><Sparkles size={13}/>{t.localAi} · {t.analyzeInsight}</p>
  </>;
}

function CoachingView({ t, language, sessions, onAddSession, notice, role }: { t: (typeof translations)[Language]; language: Language; sessions: DemoCoachingSession[]; onAddSession: (date: string, time: string) => void; notice: string; role: Role }) {
  const [formOpen, setFormOpen] = useState(false);
  const [date, setDate] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    return next.getFullYear() + "-" + String(next.getMonth() + 1).padStart(2, "0") + "-" + String(next.getDate()).padStart(2, "0");
  });
  const [time, setTime] = useState("10:30");
  const upcoming = sessions.filter((session) => session.status === "upcoming").sort((a, b) => (a.date + " " + a.time).localeCompare(b.date + " " + b.time));
  const history = sessions.filter((session) => session.status === "completed").sort((a, b) => (b.date + " " + b.time).localeCompare(a.date + " " + a.time));
  const dateLabel = (value: string) => new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { weekday: "long", month: "short", day: "numeric" }).format(new Date(value + "T12:00:00"));
  return <>
    <div className="workspace-page-heading"><div><p className="workspace-date">{t.coaching.toUpperCase()}</p><h1>{t.coaching}</h1><p>{t.coachingHint}</p></div><button type="button" className="outline-button" onClick={() => setFormOpen((open) => !open)}><Plus size={15}/>{language === "fr" ? "Ajouter une séance" : "Add a session"}</button></div>
    {notice && <div className="workspace-inline-notice" role="status"><CircleCheck size={15}/>{notice}</div>}
    {formOpen && <form className="workspace-card coach-session-form" onSubmit={(event) => { event.preventDefault(); onAddSession(date, time); setFormOpen(false); }}><div><p className="section-kicker">{language === "fr" ? "NOUVEAU RENDEZ-VOUS" : "NEW APPOINTMENT"}</p><h2>{language === "fr" ? "Planifier pour le membre actif" : "Schedule for the active member"}</h2></div><label>{language === "fr" ? "Date" : "Date"}<input type="date" min={new Date().toISOString().slice(0, 10)} required value={date} onChange={(event) => setDate(event.target.value)}/></label><label>{language === "fr" ? "Heure" : "Time"}<select value={time} onChange={(event) => setTime(event.target.value)}><option>09:00</option><option>10:30</option><option>13:00</option><option>15:15</option><option>16:00</option></select></label><button type="submit" className="button-primary"><CalendarDays size={15}/>{language === "fr" ? "Confirmer" : "Confirm"}</button></form>}
    <section className="workspace-card coach-schedule-card"><CardHeading kicker={language === "fr" ? "AGENDA PARTAGÉ" : "SHARED CALENDAR"} title={language === "fr" ? "Prochaines séances" : "Upcoming sessions"}/>{upcoming.length ? <div className="coach-schedule-list">{upcoming.map((session) => { const name = session.memberName || "Jordan Lee"; const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join(""); return <article key={session.id}><span className="coach-schedule-date"><CalendarDays size={16}/>{dateLabel(session.date)} · {session.time}</span><span className="coach-schedule-person"><i>{initials}</i><b>{name}<small>{language === "fr" ? "Coaching individuel · 45 min" : "One-to-one coaching · 45 min"}</small></b></span><span className="coach-schedule-coach">Coach: {session.coach}</span><span className="coach-schedule-status"><i/>{language === "fr" ? "Planifiée" : "Scheduled"}</span></article>; })}</div> : <p className="coach-schedule-empty">{language === "fr" ? "Aucune séance planifiée. Ajoutez un rendez-vous pour le membre." : "No sessions scheduled. Add an appointment for the member."}</p>}</section>
    <details className="coach-session-history"><summary>{language === "fr" ? "Voir l’historique (" + history.length + ")" : "View history (" + history.length + ")"}</summary><div className="workspace-card coach-schedule-card"><div className="coach-schedule-list">{history.map((session) => { const name = session.memberName || "Jordan Lee"; const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join(""); return <article key={session.id}><span className="coach-schedule-date"><Check size={15}/>{dateLabel(session.date)} · {session.time}</span><span className="coach-schedule-person"><i>{initials}</i><b>{name}<small>{session.summary || t.summaryReady}</small></b></span><span className="coach-schedule-coach">{session.coach}</span><span className="coach-schedule-status completed"><i/>{language === "fr" ? "Effectuée" : "Completed"}</span></article>; })}</div></div></details>
    <p className="workspace-footnote"><span className="tiny-green-dot"/>{role === "coach" ? (language === "fr" ? "Les séances planifiées apparaissent aussi dans le portail du membre." : "Scheduled sessions also appear in the member portal.") : t.sample}</p>
  </>;
}

function MembersView({ t, language, summary, setSummary, role }: { t: (typeof translations)[Language]; language: Language; summary: boolean; setSummary: (value: boolean) => void; role: Role }) {
  const [inviteAdded, setInviteAdded] = useState(false);
  const [people, setPeople] = useState([{ initials: "JL", name: "Jordan Lee", track: language === "fr" ? "Leadership · Parcours actif" : "Leadership · Active path", progress: 75, tone: "sage", last: language === "fr" ? "Aujourd’hui" : "Today" }, { initials: "SC", name: "Sam Carter", track: language === "fr" ? "Développement · En progression" : "Development · In progress", progress: 52, tone: "sand", last: language === "fr" ? "Hier" : "Yesterday" }, { initials: "MR", name: "Morgan Reed", track: language === "fr" ? "Carrière · Nouveau membre" : "Career · New member", progress: 28, tone: "blue", last: language === "fr" ? "Il y a 3 jours" : "3 days ago" }]);
  const addSampleMember = () => { const number = people.length + 1; setPeople((items) => [...items, { initials: "TK", name: `Taylor Kim ${number}`, track: language === "fr" ? "Nouveau membre \u00b7 \u00c0 d\u00e9marrer" : "New member - Getting started", progress: 0, tone: "blue", last: language === "fr" ? "Aujourd\u2019hui" : "Just now" }]); setInviteAdded(true); };
  return <><div className="workspace-page-heading"><div><p className="workspace-date">{t.members.toUpperCase()}</p><h1>{t.memberJourney}</h1><p>{t.memberSubtitle}</p></div><button type="button" className="outline-button" onClick={addSampleMember}><Plus size={15}/>{t.invite}</button></div>{inviteAdded && <div className="workspace-inline-notice"><CircleCheck size={15}/>{language === "fr" ? "Membre ajout\u00e9." : "Sample member added."}</div>}<CoachMonitor language={language}/><div className="member-overview-cards"><StatCard icon={<UsersRound size={15}/>} label={t.activeMembers} value={String(248 + people.length - 3)} note="+8,2 %" tone="green"/><StatCard icon={<Activity size={15}/>} label={t.progress} value="68 %" note={t.statNote} tone="blue"/><StatCard icon={<ListChecks size={15}/>} label={t.followup} value="12" note={t.attention} tone="orange"/></div><section className="workspace-card members-table-card"><CardHeading kicker={t.sample} title={t.members}/><div className="members-table"><div className="members-table-header"><span>{language === "fr" ? "MEMBRE" : "MEMBER"}</span><span>{t.progressLabel.toUpperCase()}</span><span>{t.lastSession.toUpperCase()}</span><span>{t.status.toUpperCase()}</span><span/></div>{people.map((person) => <div className="members-table-row" key={person.name}><span className="table-member-name"><i className={`workspace-avatar ${person.tone}`}>{person.initials}</i><b>{person.name}<small>{person.track}</small></b></span><span className="table-member-progress"><b>{person.progress}%</b><i><em style={{ width: `${person.progress}%` }}/></i></span><span className="table-last-session">{person.last}</span><span className="table-state"><i/>{person.progress > 40 ? t.active : t.followupStatus}</span><button type="button" aria-label={`${t.summary} ${person.name}`} onClick={() => setSummary(true)}><ArrowUpRight size={15}/></button></div>)}</div></section>{summary && role === "coach" && <div className="workspace-inline-notice"><Sparkles size={15}/>{t.summaryReady}</div>}</>;
}

function OperationsView({ t, language, tasks, dueLabel, onToggle, onAdd }: { t: (typeof translations)[Language]; language: Language; tasks: Task[]; dueLabel: (due: Task["due"]) => string; onToggle: (id: number) => void; onAdd: () => void }) {
  return <><div className="workspace-page-heading"><div><p className="workspace-date">{t.operations.toUpperCase()}</p><h1>{t.tasks}</h1><p>{t.tasksSubtitle}</p></div><button type="button" className="outline-button" onClick={onAdd}><Plus size={15}/>{t.addTask}</button></div><div className="operations-summary"><div><span className="summary-count open">{tasks.filter((task) => !task.done).length}</span><span>{t.attention}</span></div><div><span className="summary-count closed">{tasks.filter((task) => task.done).length}</span><span>{t.done}</span></div><div className="summary-progress"><span>{t.goal}</span><i><em style={{ width: `${Math.round(tasks.filter((task) => task.done).length / tasks.length * 100)}%` }}/></i></div></div><section className="workspace-card task-board"><CardHeading kicker={t.thisMonth} title={t.operations}/><div className="task-board-list">{tasks.map((task) => <div className={`task-board-row${task.done ? " is-done" : ""}`} key={task.id}><button type="button" className="task-check" onClick={() => onToggle(task.id)} aria-label={task.done ? t.markDone : t.markDone}>{task.done && <Check size={14}/>}</button><div className="task-board-title"><b>{taskTitle(task, language)}</b><small>{task.owner} · {dueLabel(task.due)}</small></div><span className={`task-board-status${task.done ? " done" : ""}`}>{task.done ? t.done : t.attention}</span><button className="task-more" type="button" onClick={() => onToggle(task.id)}>{task.done ? <CheckCheck size={16}/> : <ArrowUpRight size={16}/>}</button></div>)}</div></section><p className="workspace-footnote"><ListChecks size={13}/>{t.taskComplete} · {t.sample}</p></>;
}

function downloadSampleInvoice(invoice: { id: string; date: string; amount: string }, language: Language) {
  const title = language === "fr" ? "Facture de demonstration" : "Sample invoice";
  const text = `ALL-IN OS\n${title}\n${invoice.id}\n${invoice.date}\n${invoice.amount}\n${language === "fr" ? "Document de demonstration - aucune transaction reelle." : "Demo document - no real transaction."}`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${invoice.id}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function BillingView({ t, language }: { t: (typeof translations)[Language]; language: Language }) {
  const invoices = [{ id: "INV-2026-018", date: "01 nov. 2026", amount: "149,00 €" }, { id: "INV-2026-017", date: "01 oct. 2026", amount: "149,00 €" }, { id: "INV-2026-016", date: "01 sept. 2026", amount: "149,00 €" }];
  return <><div className="workspace-page-heading"><div><p className="workspace-date">{t.billing.toUpperCase()}</p><h1>{t.billingTitle}</h1><p>{t.billingSubtitle}</p></div><span className="sample-tag">{t.sample}</span></div><div className="billing-layout"><section className="workspace-card current-plan-card"><span className="plan-icon"><CreditCard size={18}/></span><p>{t.currentPlan}</p><h2>{t.plan}</h2><strong>{language === "fr" ? "149 €" : "€149"}<small> / {language === "fr" ? "mois" : "month"}</small></strong><div className="plan-divider"/><span>{t.renewal}</span><b>{t.dateNov}</b><button type="button" className="outline-button" onClick={() => document.getElementById("invoices")?.scrollIntoView({ behavior: "smooth" })}>{language === "fr" ? "Gérer la formule" : "Manage plan"}<ArrowUpRight size={14}/></button></section><section id="invoices" className="workspace-card invoice-card"><CardHeading kicker={t.sample} title={t.invoices}/><div className="invoice-table"><div className="invoice-table-row head"><span>{t.invoice}</span><span>{t.dateNov.split(" ").slice(-1)}</span><span>{t.amount}</span><span>{t.status}</span><span/></div>{invoices.map((invoice) => <div className="invoice-table-row" key={invoice.id}><span><FileText size={14}/>{invoice.id}</span><span>{invoice.date}</span><b>{invoice.amount}</b><span className="paid-status"><CircleCheck size={12}/>{t.paid}</span><button type="button" aria-label={language === "fr" ? "Télécharger la facture de démonstration" : "Download sample invoice"} onClick={() => downloadSampleInvoice(invoice, language)}><Download size={14}/></button></div>)}</div></section></div><p className="workspace-footnote"><CreditCard size={13}/>{t.billingSubtitle}</p></>;
}

function StudioView({ t, language, videoRef, cameraActive, recording, videoReady, recordedUrl, cameraError, recordingTitle, onTitleChange, savedRecordings, saving, persisted, onEnableCamera, onStopCamera, onStart, onStop, onDownload }: { t: (typeof translations)[Language]; language: Language; videoRef: React.RefObject<HTMLVideoElement | null>; cameraActive: boolean; recording: boolean; videoReady: boolean; recordedUrl: string; cameraError: boolean; recordingTitle: string; onTitleChange: (title: string) => void; savedRecordings: DemoRecording[]; saving: boolean; persisted: boolean; onEnableCamera: () => void; onStopCamera: () => void; onStart: () => void; onStop: () => void; onDownload: () => void }) {
  return <>
    <div className="workspace-page-heading"><div><p className="workspace-date">ALL-IN OS · STUDIO</p><h1>{t.videoTitle}</h1><p>{t.videoSubtitle}</p></div><span className="sample-tag"><span className="tiny-green-dot"/> {t.sample}</span></div>
    <div className="studio-layout">
      <section className="studio-video-card">
        <label className="studio-recording-title">{language === "fr" ? "Nom de la séance enregistrée" : "Saved session name"}<input value={recordingTitle} onChange={(event) => onTitleChange(event.target.value)} placeholder={language === "fr" ? "Ex. Bilan de progression" : "e.g. Progress check-in"} maxLength={70}/></label>
        <div className="studio-video-frame">{recordedUrl && videoReady ? <video src={recordedUrl} controls playsInline className="studio-video"/> : <video ref={videoRef} autoPlay muted playsInline className={"studio-video" + (cameraActive ? " has-camera" : "")}/>} {!cameraActive && !videoReady && <div className="studio-placeholder"><span><Camera size={25}/></span><b>{t.videoTitle}</b><small>{t.cameraHint}</small></div>}{recording && <div className="recording-indicator"><i/>{t.recording}</div>}<span className="studio-time">{recording ? "● REC" : "LOCAL PREVIEW"}</span></div>
        <div className="studio-controls">{!cameraActive && <button type="button" className="button-primary" onClick={onEnableCamera}><Camera size={15}/>{t.cameraStart}</button>}{cameraActive && !recording && <><button type="button" className="button-primary record-button" onClick={onStart}><Play size={15}/>{t.recordingStart}</button><button type="button" className="outline-button" onClick={onStopCamera}>{t.cameraStop}</button></>}{recording && <button type="button" className="button-primary stop-button" onClick={onStop}><StopCircle size={15}/>{t.recordingStop}</button>}{videoReady && <button type="button" className="outline-button" onClick={onDownload}><Download size={15}/>{t.download}</button>}</div>
        {cameraError && <p role="alert" className="studio-error">{typeof MediaRecorder === "undefined" ? t.unsupported : t.cameraError}</p>}{saving && <p className="studio-ready"><CircleCheck size={14}/>{language === "fr" ? "Sauvegarde du replay…" : "Saving replay…"}</p>}{videoReady && !saving && persisted && <p className="studio-ready"><CircleCheck size={14}/>{language === "fr" ? "Replay enregistré dans la bibliothèque du membre." : "Replay saved to the member’s library."}</p>}{videoReady && !saving && !persisted && <p className="studio-error">{language === "fr" ? "Vidéo prête à télécharger. Elle n’est pas encore disponible pour le membre." : "Video ready to download. It is not available to the member yet."}</p>}
      </section>
      <aside className="workspace-card studio-details"><span className="studio-detail-icon"><Video size={16}/></span><p className="section-kicker">{t.studio}</p><h2>{language === "fr" ? "Replays disponibles" : "Saved replays"}</h2><p>{language === "fr" ? "Après l’enregistrement, le replay reste disponible dans Mon coaching." : "After recording, the replay stays available in My Coaching."}</p>{savedRecordings.length ? <div className="studio-saved-list">{savedRecordings.slice(0, 5).map((item) => <article key={item.id}><span><Play size={13}/></span><div><b>{item.title}</b><small>{item.memberName} · {new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { month: "short", day: "numeric" }).format(new Date(item.createdAt))}</small></div></article>)}</div> : <div className="studio-empty-recordings"><Sparkles size={16}/>{language === "fr" ? "Vos enregistrements apparaîtront ici." : "Your saved recordings will appear here."}</div>}<div className="studio-info-note"><Sparkles size={14}/><span>{language === "fr" ? "Les vidéos et les rendez-vous sont sauvegardés sur cet appareil et partagés avec le membre." : "Videos and appointments are saved on this device and shared with the member."}</span></div></aside>
    </div>
  </>;
}
