import { ArrowUpRight, Boxes, Network, Sparkles } from "lucide-react";
import type { SiteLanguage } from "@/components/layout/navbar";

export function AboutSection({ language }: { language: SiteLanguage }) {
  const french = language === "fr";
  const benefits = french ? [
    { number: "01", icon: Boxes, title: "Opérations unifiées", text: "Réunissez membres, coaching, abonnements et processus internes dans une vue d’ensemble claire." },
    { number: "02", icon: Network, title: "Expériences connectées", text: "Offrez aux membres, aux coachs et à l’équipe des espaces dédiés qui restent reliés au même écosystème." },
    { number: "03", icon: Sparkles, title: "Parcours intelligents", text: "Réduisez les tâches répétitives et faites émerger le bon contexte pour les décisions du quotidien." },
  ] : [
    { number: "01", icon: Boxes, title: "Unified operations", text: "Bring members, coaching, subscriptions, and internal workflows together in one clear operating picture." },
    { number: "02", icon: Network, title: "Connected experiences", text: "Give members, coaches, and employees dedicated spaces that stay connected to the same ecosystem." },
    { number: "03", icon: Sparkles, title: "Intelligent workflows", text: "Use proposed AI assistance to reduce repetitive work and bring useful context into everyday decisions." },
  ];
  return (
    <section className="about-section section-pad" id="about">
      <div className="wrap">
        <div className="section-intro about-intro"><div><p className="section-kicker"><span/> {french ? "UN SYSTÈME D’EXPLOITATION CONNECTÉ" : "A CONNECTED OPERATING SYSTEM"}</p><h2>{french ? <>Tout est connecté.<br/><span>Tout est maîtrisé.</span></> : <>Everything connected.<br/><span>Everything under control.</span></>}</h2></div><p className="section-lede">{french ? "ALL-IN OS réunit les outils essentiels à la gestion d’une activité de coaching moderne. De l’expérience membre aux opérations internes, chaque espace travaille avec les autres." : "ALL-IN OS brings together the essential tools needed to manage a modern coaching business. From member experiences to internal operations, every part of the ecosystem works together."}</p></div>
        <div className="benefit-grid">{benefits.map(({ number, icon: Icon, title, text }) => <article className="benefit-card" key={number}><div className="benefit-top"><span>{number}</span><Icon size={19}/></div><h3>{title}</h3><p>{text}</p><a href="#experiences" aria-label={`Explore ${title}`}><ArrowUpRight size={16}/></a></article>)}</div>
      </div>
    </section>
  );
}
