"use client";

import { useEffect, useState } from "react";
import { Navbar, type SiteLanguage } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AboutSection } from "@/components/sections/about-section";
import { AiSection } from "@/components/sections/ai-section";
import { CtaSection } from "@/components/sections/cta-section";
import { ExperiencesSection } from "@/components/sections/experiences-section";
import { HeroSection } from "@/components/sections/hero-section";
import { WorkflowSection } from "@/components/sections/workflow-section";

export default function Home() {
  const [language, setLanguage] = useState<SiteLanguage>("fr");
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedLanguage = localStorage.getItem("allin-language");
      if (savedLanguage === "fr" || savedLanguage === "en") setLanguage(savedLanguage);
      setLanguageReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    if (languageReady) localStorage.setItem("allin-language", language);
  }, [language, languageReady]);

  return <><Navbar language={language} onLanguageChange={setLanguage}/><main><HeroSection language={language}/><AboutSection language={language}/><ExperiencesSection language={language}/><AiSection language={language}/><WorkflowSection language={language}/><CtaSection language={language}/></main><Footer language={language}/></>;
}
