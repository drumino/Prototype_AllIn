"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowRight, BookOpen, CalendarCheck, Sparkles, UsersRound } from "lucide-react";

type Language = "fr" | "en";
type Report = { name: string; overall: number; completedLessons: number; lessonCount: number; completedSessions: number; upcomingSessions: number; recommendedLesson: string; recommendation: string };

export function CoachMonitor({ language }: { language: Language }) {
  const [report, setReport] = useState<Report | null>(null);
  const [expanded, setExpanded] = useState(false);
  const fr = language === "fr";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem("allin-member-portal");
        if (!raw) {
          setReport({ name: "Jordan Lee", overall: 68, completedLessons: 2, lessonCount: 8, completedSessions: 4, upcomingSessions: 2, recommendedLesson: fr ? "Transformer ses objectifs en habitudes" : "Turn goals into habits", recommendation: fr ? "Reprendre une capsule ensemble et définir le prochain objectif de coaching." : "Review a lesson together and set the next coaching goal." });
          return;
        }
        const saved = JSON.parse(raw) as { profile?: { firstName?: string; lastName?: string }; lessons?: { titleFr: string; titleEn: string; progress: number }[]; sessions?: { status: string }[] };
        const lessons = saved.lessons ?? [];
        const sessions = saved.sessions ?? [];
        const average = Math.round(lessons.reduce((sum, lesson) => sum + lesson.progress, 0) / Math.max(1, lessons.length));
        const nextLesson = lessons.find((lesson) => lesson.progress > 0 && lesson.progress < 100) ?? lessons.find((lesson) => lesson.progress < 100);
        const name = `${saved.profile?.firstName || "Jordan"} ${saved.profile?.lastName || "Lee"}`;
        setReport({
          name,
          overall: average,
          completedLessons: lessons.filter((lesson) => lesson.progress >= 100).length,
          lessonCount: lessons.length,
          completedSessions: sessions.filter((session) => session.status === "completed").length,
          upcomingSessions: sessions.filter((session) => session.status === "upcoming").length,
          recommendedLesson: nextLesson ? (fr ? nextLesson.titleFr : nextLesson.titleEn) : (fr ? "Revoir une formation au choix" : "Review a course of their choice"),
          recommendation: average < 45
            ? (fr ? "Planifier un bref coaching et reprendre une capsule ensemble pour relancer le parcours." : "Schedule a short coaching check-in and review a lesson together to restart momentum.")
            : (fr ? "Féliciter le membre pour ses progrès et fixer ensemble le prochain objectif." : "Recognize this member’s progress and agree on the next goal together."),
        });
      } catch { /* Keep the monitor available with a friendly empty state. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fr]);

  if (!report) return <section className="coach-monitor-card loading"><Sparkles size={18}/><span>{fr ? "Préparation du suivi membre…" : "Loading member progress…"}</span></section>;
  return <section className="coach-monitor-card">
    <div className="coach-monitor-heading"><span className="coach-monitor-icon"><Activity size={19}/></span><div><p>{fr ? "COACH IA · SUIVI DES MEMBRES" : "AI COACH · MEMBER MONITOR"}</p><h2>{fr ? "Un regard clair sur sa progression" : "A clear view of member progress"}</h2></div><span className="coach-monitor-demo">{fr ? "DÉMO LOCALE" : "LOCAL DEMO"}</span></div>
    <div className="coach-monitor-stats"><div><UsersRound size={16}/><span>{fr ? "Membre suivi" : "Monitored member"}</span><b>{report.name}</b></div><div><Activity size={16}/><span>{fr ? "Progression formation" : "Learning progress"}</span><b>{report.overall}%</b></div><div><CalendarCheck size={16}/><span>{fr ? "Séances effectuées" : "Sessions attended"}</span><b>{report.completedSessions}</b></div></div>
    <div className="coach-monitor-recommendation"><span><Sparkles size={17}/></span><div><b>{fr ? "Prochaine action conseillée" : "Suggested next step"}</b><p>{report.recommendation}</p><small><BookOpen size={13}/>{report.recommendedLesson}</small></div></div>
    {expanded && <div className="coach-monitor-report" role="status"><div><b>{fr ? "Bilan de parcours" : "Journey summary"}</b><span>{fr ? `${report.completedLessons} formation(s) terminée(s) sur ${report.lessonCount}.` : `${report.completedLessons} of ${report.lessonCount} lessons completed.`}</span></div><div><b>{fr ? "Coaching" : "Coaching"}</b><span>{fr ? `${report.upcomingSessions} séance(s) à venir · ${report.completedSessions} effectuée(s).` : `${report.upcomingSessions} upcoming · ${report.completedSessions} attended.`}</span></div><div className="coach-monitor-progress"><i style={{ width: `${report.overall}%` }}/></div></div>}
    <button type="button" className="coach-monitor-button" onClick={() => setExpanded(!expanded)}><Sparkles size={15}/>{expanded ? (fr ? "Masquer le bilan" : "Hide progress report") : (fr ? "Voir le bilan du membre" : "View member progress report")}<ArrowRight size={15}/></button>
    <small className="coach-monitor-note">{fr ? "L’analyse lit le profil et l’activité locale du membre. Les données de démonstration restent dans ce navigateur." : "Analysis reads this member’s local profile and activity. Demo data stays in this browser."}</small>
  </section>;
}
