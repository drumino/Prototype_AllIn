"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DEMO_PATH, NAV_ITEMS } from "@/lib/constants";

export type SiteLanguage = "fr" | "en";

type ActiveAccount = { firstName?: string; lastName?: string; email?: string };
type MemberProfilePhoto = { profile?: { photo?: string } };

function readActiveAccount() {
  try {
    const session = localStorage.getItem("allin-demo-session");
    const account = localStorage.getItem("allin-demo-account");
    if (!session || !account) return null;
    const parsedSession = JSON.parse(session) as { email?: string };
    const parsedAccount = JSON.parse(account) as ActiveAccount;
    if (!parsedSession.email || parsedSession.email !== parsedAccount.email) return null;
    let photo: string | null = null;
    const portal = localStorage.getItem("allin-member-portal");
    if (portal) photo = (JSON.parse(portal) as MemberProfilePhoto).profile?.photo || null;
    return { account: parsedAccount, photo };
  } catch {
    return null;
  }
}

function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="ALL-IN OS home">
      <span className="wordmark-mark" aria-hidden="true">A</span>
      <span>ALL-IN <i>OS</i></span>
    </Link>
  );
}

export function Navbar({ language, onLanguageChange }: { language: SiteLanguage; onLanguageChange: (language: SiteLanguage) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState<ReturnType<typeof readActiveAccount>>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    const updateAccount = () => setActiveAccount(readActiveAccount());
    updateAccount();
    window.addEventListener("storage", updateAccount);
    window.addEventListener("allin-account-change", updateAccount);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("storage", updateAccount);
      window.removeEventListener("allin-account-change", updateAccount);
    };
  }, []);

  const accountName = [activeAccount?.account.firstName, activeAccount?.account.lastName].filter(Boolean).join(" ");
  const initials = [activeAccount?.account.firstName?.[0], activeAccount?.account.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "M";

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <nav className="nav-shell" aria-label="Main navigation">
        <Wordmark />
        <div className="nav-links">
          {NAV_ITEMS.map((item) => <a key={item.href} href={item.href}>{navLabel(item.label, language)}</a>)}
        </div>
        <div className="nav-actions"><div className="site-language-switch" aria-label="Language"><button type="button" className={language === "fr" ? "active" : ""} aria-pressed={language === "fr"} onClick={() => onLanguageChange("fr")}>FR</button><button type="button" className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => onLanguageChange("en")}>EN</button></div>{activeAccount ? <Link className="nav-profile-link" href="/demo?section=profile" aria-label={language === "fr" ? `Ouvrir le profil de ${accountName || "membre"}` : `Open ${accountName || "member"} profile`} title={accountName || (language === "fr" ? "Mon profil" : "My profile")}>{activeAccount.photo ? <Image src={activeAccount.photo} alt="" width={42} height={42} unoptimized /> : <span aria-hidden="true">{initials}</span>}</Link> : <Link className="nav-login" href="/auth">{language === "fr" ? "Se connecter" : "Sign in"}</Link>}<Link className="nav-cta" href={DEMO_PATH}>{language === "fr" ? "Explorer la plateforme" : "Explore the platform"} <ArrowUpRight size={15} /></Link></div>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >{open ? <X size={20} /> : <Menu size={20} />}</button>
      </nav>
      <div id="mobile-navigation" className={`mobile-navigation${open ? " is-open" : ""}`}>
        <div className="mobile-language-switch" aria-label="Language"><button type="button" className={language === "fr" ? "active" : ""} onClick={() => onLanguageChange("fr")}>Français</button><button type="button" className={language === "en" ? "active" : ""} onClick={() => onLanguageChange("en")}>English</button></div>
        {NAV_ITEMS.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{navLabel(item.label, language)}</a>)}
        <Link className="mobile-login-link" href="/auth" onClick={() => setOpen(false)}>{language === "fr" ? "Se connecter" : "Sign in"}</Link>
        <Link href={DEMO_PATH} onClick={() => setOpen(false)}>{language === "fr" ? "Explorer la plateforme" : "Explore the platform"} <ArrowUpRight size={15} /></Link>
      </div>
    </header>
  );
}

function navLabel(label: string, language: SiteLanguage) {
  if (language === "en") return label;
  const labels: Record<string, string> = { Platform: "Plateforme", Experiences: "Espaces", AI: "IA", About: "À propos" };
  return labels[label] ?? label;
}

export { Wordmark };
