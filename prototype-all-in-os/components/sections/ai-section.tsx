import { Activity, ArrowRight, BrainCircuit, ListChecks, Sparkles } from "lucide-react";
import { AiPreview } from "@/components/ui/dashboard-previews";
import type { SiteLanguage } from "@/components/layout/navbar";

const capabilitiesEn = [
  { icon: BrainCircuit, title: "Coaching intelligence", text: "Shape conversations into structured summaries and useful coaching insights." },
  { icon: ListChecks, title: "Smart follow-ups", text: "Surface next steps and keep thoughtful follow-through in view." },
  { icon: Activity, title: "Workflow automation", text: "Reduce repeat administrative work with assistance built into the flow." },
  { icon: Sparkles, title: "Business insights", text: "Bring operational information together to make patterns easier to see." },
];

export function AiSection({ language }: { language: SiteLanguage }) {
  const french = language === "fr";
  const capabilities = french ? [
    { icon: BrainCircuit, title: "Intelligence de coaching", text: "Structurez les échanges en résumés utiles et en pistes de progression." },
    { icon: ListChecks, title: "Suivis suggérés", text: "Faites ressortir les prochaines étapes et gardez les relances en vue." },
    { icon: Activity, title: "Automatisation des tâches", text: "Réduisez les tâches administratives répétitives au fil du travail." },
    { icon: Sparkles, title: "Indicateurs d’activité", text: "Rassemblez les données opérationnelles pour mieux repérer les tendances." },
  ] : capabilitiesEn;
  return (
    <section className="ai-section section-pad" id="intelligence">
      <div className="ai-grid-bg" aria-hidden="true"/>
      <div className="wrap ai-layout">
        <div className="ai-copy"><p className="section-kicker light-kicker"><span/> {french ? "L’INTELLIGENCE AU CŒUR DU TRAVAIL" : "INTELLIGENCE IN THE WORKFLOW"}</p><h2>{french ? <>Plus qu’un outil de gestion.<br/><span>L’intelligence intégrée.</span></> : <>More than management.<br/><span>Intelligence built in.</span></>}</h2><p className="ai-lede">{french ? "L’IA peut rendre les opérations quotidiennes plus fluides et plus pertinentes — pour permettre aux équipes de se concentrer sur l’essentiel." : "AI can transform everyday operations into smarter, more efficient workflows — helping teams focus on what matters most."}</p><div className="ai-capabilities">{capabilities.map(({ icon: Icon, title, text }, index) => <article className="ai-capability" key={title}><span className="ai-cap-icon"><Icon size={16}/></span><div><h3>{title}</h3><p>{text}</p></div><span className="ai-cap-index">0{index + 1}</span></article>)}</div><p className="ai-footnote"><span/> {french ? "Fonctions envisagées · Concept de prototype, IA non connectée" : "Proposed capabilities · Prototype concept, not a live AI service"}</p></div>
        <div className="ai-visual"><div className="ai-visual-orbit orbit-a"/><div className="ai-visual-orbit orbit-b"/><AiPreview language={language}/><div className="ai-visual-caption"><Sparkles size={14}/> {french ? "Une couche d’intelligence au service de tout l’écosystème" : "A considered layer of intelligence across the ecosystem"} <ArrowRight size={14}/></div></div>
      </div>
    </section>
  );
}
