import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DEMO_PATH } from "@/lib/constants";
import { Wordmark, type SiteLanguage } from "@/components/layout/navbar";

const footerLinks = [
  { title: "Platform", items: [{ label: "Overview", href: "#platform" }, { label: "How it works", href: "#journey" }, { label: "AI experience", href: "#intelligence" }] },
  { title: "Experiences", items: [{ label: "Member Portal", href: "#members" }, { label: "Coach Workspace", href: "#coaches" }, { label: "Team Workspace", href: "#team" }] },
];

export function Footer({ language }: { language: SiteLanguage }) {
  const french = language === "fr";
  return (
    <footer className="site-footer">
      <div className="footer-main wrap">
        <div className="footer-brand">
          <Wordmark />
          <p>{french ? "Un système connecté pour les personnes et les activités qui font vivre le coaching." : "A connected operating system for the people and work behind modern coaching."}</p>
          <Link href={DEMO_PATH} className="footer-demo">{french ? "Explorer la plateforme" : "Explore the platform"} <ArrowUpRight size={15} /></Link>
        </div>
        {footerLinks.map((group) => (
          <div className="footer-column" key={group.title}>
            <p className="footer-label">{french ? (group.title === "Platform" ? "Plateforme" : "Espaces") : group.title}</p>
            {group.items.map((item) => <a href={item.href} key={item.label}>{french ? ({ Overview: "Vue d’ensemble", "How it works": "Comment ça marche", "AI experience": "Expérience IA", "Member Portal": "Espace membre", "Coach Workspace": "Espace coach", "Team Workspace": "Espace équipe" } as Record<string, string>)[item.label] : item.label}</a>)}
          </div>
        ))}
      </div>
      <div className="footer-bottom wrap">
        <span>© ALL-IN OS</span>
        <span>{french ? "Pensé pour un écosystème de coaching plus connecté." : "Built for a more connected coaching ecosystem."}</span>
      </div>
    </footer>
  );
}
