import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Layers3, Sparkles } from "lucide-react";
import { DEMO_PATH, SAMPLE_NOTICE } from "@/lib/constants";
import { HeroDashboard } from "@/components/ui/dashboard-previews";
import type { SiteLanguage } from "@/components/layout/navbar";

export function HeroSection({ language }: { language: SiteLanguage }) {
  const french = language === "fr";
  return (
    <section className="hero-section" id="platform">
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="hero-copy wrap">
        <div className="hero-eyebrow"><span className="eyebrow-icon"><Layers3 size={13}/></span> {french ? "LE SYSTÈME D’EXPLOITATION DU COACHING" : "THE OPERATING SYSTEM FOR COACHING"}</div>
        <h1>{french ? <>Un écosystème.<br/><span>Une plateforme</span><br/>intelligente.</> : <>One ecosystem.<br/><span>One intelligent</span><br/>platform.</>}</h1>
        <p className="hero-description">{french ? "Tout ce dont Team ALL IN a besoin pour gérer ses membres, le coaching, la formation et ses opérations — réunis dans un écosystème intelligent." : "Everything Team ALL IN needs to manage members, coaching, learning, and business operations — connected in one intelligent ecosystem."}</p>
        <div className="hero-actions"><Link className="button-primary" href={DEMO_PATH}>{french ? "Explorer la plateforme" : "Explore the platform"} <ArrowRight size={16}/></Link><a className="button-text" href="#about">{french ? "Découvrir l’écosystème" : "Discover the ecosystem"} <ArrowDown size={15}/></a></div>
        <div className="hero-meta"><span><i/> {french ? "Un écosystème connecté" : "One connected ecosystem"}</span><span><Sparkles size={13}/> {french ? "L’intelligence intégrée" : "Intelligence, built in"}</span></div>
      </div>
      <div className="hero-visual wrap"><HeroDashboard language={language}/><span className="hero-visual-caption">{french ? "Aperçu illustratif · Contenu fictif" : SAMPLE_NOTICE}</span></div>
      <div className="hero-bottom-line wrap"><span>{french ? "MEMBRES" : "MEMBERS"}</span><i/><span>COACHING</span><i/><span>{french ? "FORMATION" : "LEARNING"}</span><i/><span>{french ? "OPÉRATIONS" : "OPERATIONS"}</span><span className="hero-bottom-note">{french ? "Pensé autour du fonctionnement de Team ALL IN" : "Built around the way Team ALL IN works"} <ArrowUpRight size={13}/></span></div>
    </section>
  );
}
