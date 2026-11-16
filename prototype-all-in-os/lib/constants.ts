export const DEMO_PATH = process.env.NEXT_PUBLIC_PLATFORM_DEMO_PATH || "/demo";

export const NAV_ITEMS = [
  { label: "Platform", href: "#platform" },
  { label: "Experiences", href: "#experiences" },
  { label: "AI", href: "#intelligence" },
  { label: "About", href: "#about" },
] as const;

export const SAMPLE_NOTICE = "Illustrative preview · Sample content";
