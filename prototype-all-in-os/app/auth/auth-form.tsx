"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, LogIn, Mail, Sparkles, UserPlus, UserRound } from "lucide-react";

type Language = "fr" | "en";
type DemoAccount = { firstName: string; lastName: string; email: string; passwordSalt: string; passwordHash: string };

function createSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 120_000, hash: "SHA-256" }, key, 256);
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function AuthForm() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("fr");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"error" | "success">("error");
  const [busy, setBusy] = useState(false);
  const fr = language === "fr";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("allin-language");
      if (saved === "fr" || saved === "en") setLanguage(saved);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    if (password.trim().length < 8) {
      setNoticeKind("error");
      setNotice(fr ? "Utilisez au moins 8 caractères pour ce mot de passe de démonstration." : "Use at least 8 characters for this demo password.");
      return;
    }
    setBusy(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const savedAccount = localStorage.getItem("allin-demo-account");
      const account = savedAccount ? JSON.parse(savedAccount) as DemoAccount : null;
      let member: DemoAccount;

      if (mode === "signup") {
        if (password !== confirmPassword) throw new Error(fr ? "Les mots de passe ne correspondent pas." : "The passwords do not match.");
        const passwordSalt = createSalt();
        const passwordHash = await hashPassword(password, passwordSalt);
        member = { firstName: firstName.trim(), lastName: lastName.trim(), email: normalizedEmail, passwordSalt, passwordHash };
        localStorage.setItem("allin-demo-account", JSON.stringify(member));
        const savedPortal = localStorage.getItem("allin-member-portal");
        if (savedPortal) {
          try {
            const portal = JSON.parse(savedPortal);
            portal.profile = { ...portal.profile, firstName: member.firstName, lastName: member.lastName, email: member.email };
            localStorage.setItem("allin-member-portal", JSON.stringify(portal));
          } catch { /* A fresh demo profile will use the account details on the next sign-in. */ }
        }
      } else {
        if (!account || account.email.toLowerCase() !== normalizedEmail) throw new Error(fr ? "Aucun compte de démonstration ne correspond à cette adresse. Créez un compte pour commencer." : "No demo account matches this email. Create an account to get started.");
        if (!account.passwordSalt || !account.passwordHash || await hashPassword(password, account.passwordSalt) !== account.passwordHash) throw new Error(fr ? "Le mot de passe ne correspond pas à ce compte." : "That password does not match this account.");
        member = account;
      }

      localStorage.setItem("allin-demo-session", JSON.stringify({ email: member.email, signedInAt: new Date().toISOString() }));
      localStorage.setItem("allin-language", language);
      setNoticeKind("success");
      setNotice(fr ? "C’est prêt ! Votre espace membre s’ouvre…" : "You’re all set! Opening your member space…");
      window.setTimeout(() => router.push("/demo"), 450);
    } catch (error) {
      setNoticeKind("error");
      setNotice(error instanceof Error ? error.message : (fr ? "Une erreur est survenue. Réessayez." : "Something went wrong. Please try again."));
      setBusy(false);
    }
  };

  const enterDemoAccount = async () => {
    if (mode === "signin") {
      setBusy(true);
      try {
        const password = "allin-demo-2026";
        const passwordSalt = "allinos-demo-jordan-2026";
        const account: DemoAccount = { firstName: "Jordan", lastName: "Lee", email: "jordan.lee@example.com", passwordSalt, passwordHash: await hashPassword(password, passwordSalt) };
        localStorage.setItem("allin-demo-account", JSON.stringify(account));
        localStorage.setItem("allin-demo-session", JSON.stringify({ email: account.email, signedInAt: new Date().toISOString() }));
        localStorage.setItem("allin-language", language);
        setEmail(account.email);
        setPassword(password);
        setNoticeKind("success");
        setNotice(fr ? "Ouverture de l’espace membre de démonstration…" : "Opening the demo member space…");
        window.setTimeout(() => router.push("/demo"), 350);
      } catch {
        setBusy(false);
        setNoticeKind("error");
        setNotice(fr ? "La connexion de démonstration n’est pas disponible dans ce navigateur." : "Demo sign-in is unavailable in this browser.");
      }
      return;
    }
    setFirstName("Jordan");
    setLastName("Lee");
    setEmail("jordan.lee@example.com");
    setPassword("allin-demo-2026");
    if (mode === "signup") setConfirmPassword("allin-demo-2026");
  };

  const changeMode = (next: "signin" | "signup") => { setMode(next); setNotice(""); };

  return <main className="auth-page" lang={language}>
    <section className="auth-showcase">
      <Link href="/" className="auth-brand"><span>A</span> ALL-IN <i>OS</i></Link>
      <div className="auth-showcase-copy"><span className="auth-kicker"><Sparkles size={15}/>{fr ? "VOTRE PARCOURS, EN MOUVEMENT" : "YOUR JOURNEY, IN MOTION"}</span><h1>{fr ? <>Chaque progrès<br/>commence <em>ici.</em></> : <>Every bit of progress<br/>starts <em>here.</em></>}</h1><p>{fr ? "Retrouvez votre coaching, vos formations et vos prochaines étapes dans un seul espace." : "Find your coaching, learning, and next steps in one friendly space."}</p><div className="auth-showcase-points"><span><i>✓</i>{fr ? "Vos progrès au même endroit" : "Your progress in one place"}</span><span><i>✓</i>{fr ? "Un guide pour chaque prochaine étape" : "A guide for every next step"}</span></div></div>
      <span className="auth-showcase-foot">ALL-IN OS <i>·</i> {fr ? "UN ESPACE POUR AVANCER" : "A SPACE TO MOVE FORWARD"}</span>
    </section>
    <section className="auth-main"><div className="auth-top-actions"><Link href="/" className="auth-back"><ArrowLeft size={15}/>{fr ? "Retour au site" : "Back to website"}</Link><div className="auth-language"><button type="button" className={fr ? "active" : ""} aria-pressed={fr} onClick={() => setLanguage("fr")}>FR</button><button type="button" className={!fr ? "active" : ""} aria-pressed={!fr} onClick={() => setLanguage("en")}>EN</button></div></div>
      <div className="auth-card"><div className="auth-card-heading"><span className="auth-card-icon"><UserRound size={19}/></span><p>{fr ? "VOTRE ESPACE PERSONNEL" : "YOUR PERSONAL SPACE"}</p><h2>{mode === "signin" ? (fr ? "Bon retour !" : "Welcome back!") : (fr ? "On commence ?" : "Let’s get started")}</h2><span>{mode === "signin" ? (fr ? "Connectez-vous pour retrouver votre parcours." : "Sign in to pick up where you left off.") : (fr ? "Créez votre compte membre en quelques étapes." : "Create your member account in a few quick steps.")}</span></div>
        <div className="auth-tabs" role="group" aria-label={fr ? "Choisir une action" : "Choose an action"}><button type="button" aria-pressed={mode === "signin"} className={mode === "signin" ? "active" : ""} onClick={() => changeMode("signin")}><LogIn size={16}/>{fr ? "Se connecter" : "Sign in"}</button><button type="button" aria-pressed={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => changeMode("signup")}><UserPlus size={16}/>{fr ? "Créer un compte" : "Create account"}</button></div>
        <form className="auth-form" onSubmit={submit}>
          {mode === "signup" && <div className="auth-name-fields"><label><span>{fr ? "Prénom" : "First name"}</span><input autoComplete="given-name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder={fr ? "Votre prénom" : "Your first name"}/></label><label><span>{fr ? "Nom" : "Last name"}</span><input autoComplete="family-name" required value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder={fr ? "Votre nom" : "Your last name"}/></label></div>}
          <label className="auth-field"><span>{fr ? "Adresse courriel" : "Email address"}</span><div><Mail size={17}/><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com"/></div></label>
          <label className="auth-field"><span>{fr ? "Mot de passe de démonstration" : "Demo password"}</span><div><LockKeyhole size={17}/><input type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder={fr ? "8 caractères minimum" : "At least 8 characters"}/><button type="button" className="auth-show-password" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? (fr ? "Masquer le mot de passe" : "Hide password") : (fr ? "Afficher le mot de passe" : "Show password")}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
          {mode === "signup" && <label className="auth-field"><span>{fr ? "Confirmer le mot de passe" : "Confirm password"}</span><div><LockKeyhole size={17}/><input type={showPassword ? "text" : "password"} autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder={fr ? "Saisissez-le à nouveau" : "Enter it again"}/></div></label>}
          {notice && <p className={`auth-notice ${noticeKind}`} role={noticeKind === "error" ? "alert" : "status"}>{notice}</p>}
          <button className="auth-submit" type="submit" disabled={busy}>{busy ? (fr ? "Un instant…" : "One moment…") : mode === "signin" ? (fr ? "Entrer dans mon espace" : "Go to my space") : (fr ? "Créer mon compte membre" : "Create my member account")}<ArrowRight size={17}/></button>
        </form>
        <button className="auth-demo-button" type="button" onClick={() => { void enterDemoAccount(); }}><Sparkles size={15}/>{mode === "signin" ? (fr ? "Entrer avec le compte démo Jordan" : "Continue with Jordan’s demo account") : (fr ? "Remplir le formulaire de démonstration" : "Fill in the demo sign-up form")}</button>
        <p className="auth-demo-note">{fr ? "Prototype : votre compte et une empreinte du mot de passe restent sur cet appareil. Aucune donnée n’est envoyée à un serveur; cette connexion n’offre pas la sécurité d’une authentification réelle." : "Prototype: your account and a password hash stay on this device. Nothing is sent to a server; this sign-in does not provide real authentication security."}</p>
      </div><p className="auth-main-foot">{fr ? "Une petite étape aujourd’hui. Un grand élan demain." : "A small step today. Real momentum tomorrow."}</p>
    </section>
  </main>;
}
