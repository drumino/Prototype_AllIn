import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALL-IN OS — Une plateforme intelligente",
  description: "Un écosystème connecté pour les membres, les coachs et l’équipe Team ALL IN.",
  applicationName: "ALL-IN OS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
