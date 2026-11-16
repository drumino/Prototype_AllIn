import { ArrowRight, CalendarDays, Check, ListTodo, UsersRound } from "lucide-react";
import { CoachPreview, MemberPreview, TeamPreview } from "@/components/ui/dashboard-previews";
import type { SiteLanguage } from "@/components/layout/navbar";

const experiencesEn = [
  { id: "members", index: "01", name: "MEMBER PORTAL", icon: UsersRound, title: "Your professional journey, connected.", description: "Everything members need to manage their coaching, track their progress, access training, and stay on top of their subscriptions.", features: ["Personal dashboard", "Coaching sessions", "Professional development", "Training library", "Subscription management"], preview: MemberPreview },
  { id: "coaches", index: "02", name: "COACH WORKSPACE", icon: CalendarDays, title: "Better coaching. Smarter workflows.", description: "A dedicated workspace that helps coaches organize sessions, follow their members, and turn conversations into actionable insights.", features: ["Coaching calendar", "Member management", "Coaching history", "AI-generated summaries", "Follow-up actions"], preview: CoachPreview },
  { id: "team", index: "03", name: "TEAM ALL IN WORKSPACE", icon: ListTodo, title: "Complete operational visibility.", description: "A centralized environment for employees to manage members, monitor operations, coordinate tasks, and oversee subscriptions.", features: ["Operations dashboard", "Member management", "Coaching oversight", "Subscription and billing", "Internal tasks and follow-ups"], preview: TeamPreview },
];

export function ExperiencesSection({ language }: { language: SiteLanguage }) {
  const french = language === "fr";
  const experiences = french ? [
    { ...experiencesEn[0], name: "ESPACE MEMBRE", title: "Votre parcours professionnel, en un seul lieu.", description: "Tout ce qu’il faut aux membres pour suivre leur coaching, mesurer leurs progrès, accéder aux formations et gérer leur abonnement.", features: ["Tableau de bord personnel", "Séances de coaching", "Développement professionnel", "Catalogue de formations", "Gestion de l’abonnement"] },
    { ...experiencesEn[1], name: "ESPACE COACH", title: "Un coaching plus précis. Des suivis plus simples.", description: "Un espace dédié pour organiser les séances, accompagner les membres et transformer les échanges en actions concrètes.", features: ["Calendrier de coaching", "Suivi des membres", "Historique des séances", "Résumés assistés par IA", "Actions de suivi"] },
    { ...experiencesEn[2], name: "ESPACE TEAM ALL IN", title: "Une vision claire des opérations.", description: "Un environnement centralisé pour gérer les membres, suivre l’activité, coordonner les tâches et superviser les abonnements.", features: ["Vue des opérations", "Gestion des membres", "Suivi du coaching", "Abonnements et facturation", "Tâches et relances"] },
  ] : experiencesEn;
  return (
    <section className="experiences-section section-pad" id="experiences">
      <div className="wrap">
        <div className="section-intro experiences-intro"><div><p className="section-kicker"><span/> {french ? "TROIS ESPACES DÉDIÉS" : "THREE DEDICATED WORKSPACES"}</p><h2>{french ? <>Trois expériences.<br/><span>Un écosystème.</span></> : <>Three experiences.<br/><span>One ecosystem.</span></>}</h2></div><p className="section-lede">{french ? "Une base commune, pensée autour des besoins de chaque personne et de chaque rôle." : "One connected foundation, shaped around what each person needs to move their work forward."}</p></div>
        <div className="experience-stack">{experiences.map(({ id, index, name, icon: Icon, title, description, features, preview: Preview }) => <article className="experience-card" id={id} key={id}><div className="experience-info"><div className="experience-label"><span>{index}</span><i/><Icon size={14}/>{name}</div><h3>{title}</h3><p>{description}</p><div className="feature-list">{features.map((feature) => <span key={feature}><Check size={13}/>{feature}</span>)}</div><a href="#journey" className="experience-link">{french ? "Voir comment tout se connecte" : "See how it connects"} <ArrowRight size={14}/></a></div><div className="experience-art"><div className={`preview-glow glow-${id}`}/><Preview language={language}/></div></article>)}</div>
      </div>
    </section>
  );
}
