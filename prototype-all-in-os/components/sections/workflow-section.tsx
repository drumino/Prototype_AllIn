import { ArrowRight, Check, Layers3, Sparkles } from "lucide-react";
import type { SiteLanguage } from "@/components/layout/navbar";

const stepsEn = [
  { number: "01", icon: Layers3, title: "Connect", text: "Members, coaches, and employees access their dedicated workspace." },
  { number: "02", icon: Check, title: "Manage", text: "Coaching, learning, subscriptions, and operations are brought together." },
  { number: "03", icon: Sparkles, title: "Improve", text: "AI assistance and connected workflows can help teams work with greater clarity." },
];

export function WorkflowSection({ language }: { language: SiteLanguage }) {
  const french = language === "fr";
  const steps = french ? [
    { ...stepsEn[0], title: "Connecter", text: "Membres, coachs et équipe accèdent à leur espace dédié." },
    { ...stepsEn[1], title: "Gérer", text: "Coaching, formation, abonnements et opérations sont réunis." },
    { ...stepsEn[2], title: "Progresser", text: "L’assistance IA et les processus connectés peuvent aider chacun à gagner en clarté." },
  ] : stepsEn;
  return <section className="workflow-section section-pad" id="journey"><div className="wrap"><div className="section-intro workflow-intro"><div><p className="section-kicker"><span/> {french ? "UN SOCLE COMMUN" : "A SHARED FOUNDATION"}</p><h2>{french ? "Un parcours connecté." : "One connected journey."}</h2></div><p className="section-lede">{french ? "Chaque interaction contribue à une vision plus claire du travail et des personnes qui le font avancer." : "Every interaction contributes to a clearer picture of the work and the people behind it."}</p></div><div className="workflow-track">{steps.map(({ number, icon: Icon, title, text }, index) => <article className="workflow-step" key={number}><div className="step-top"><span>{number}</span><div className="step-icon"><Icon size={17}/></div>{index < steps.length - 1 && <div className="step-line"><i/></div>}</div><h3>{title}</h3><p>{text}</p></article>)}</div><div className="workflow-note"><span className="tiny-green-dot"/> {french ? "Un écosystème connecté, du premier échange à la prochaine étape" : "One connected ecosystem, from first touchpoint to next step"} <ArrowRight size={14}/></div></div></section>;
}
