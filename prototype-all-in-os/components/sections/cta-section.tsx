import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { DEMO_PATH } from "@/lib/constants";
import type { SiteLanguage } from "@/components/layout/navbar";

export function CtaSection({ language }: { language: SiteLanguage }) {
  const french = language === "fr";
  return <section className="cta-section"><div className="cta-glow" aria-hidden="true"/><div className="wrap cta-content"><p className="cta-kicker"><Sparkles size={14}/> {french ? "PENSÉ POUR TOUT L’ÉCOSYSTÈME" : "BUILT FOR THE WHOLE ECOSYSTEM"}</p><h2>{french ? <>Tout ce qu’il faut à votre écosystème de coaching.<br/><span>Une plateforme intelligente.</span></> : <>Everything your coaching ecosystem needs.<br/><span>One intelligent platform.</span></>}</h2><p>{french ? "Découvrez comment ALL-IN OS réunit les personnes, les processus et l’intelligence." : "Discover how ALL-IN OS brings people, processes, and intelligence together."}</p><Link className="button-primary cta-button" href={DEMO_PATH}>{french ? "Explorer la plateforme" : "Explore the platform"} <ArrowRight size={16}/></Link><span className="cta-note">{french ? "Une expérience connectée pour Team ALL IN" : "A connected product experience for Team ALL IN"} <ArrowUpRight size={13}/></span></div></section>;
}
