export type DemoCoachingSession = {
  id: string;
  date: string;
  time: string;
  coach: string;
  memberName?: string;
  status: "upcoming" | "completed";
  summary: string;
};

export type DemoRecording = {
  id: string;
  title: string;
  memberEmail: string;
  memberName: string;
  createdAt: string;
  durationSeconds: number;
  mimeType: string;
};

export const DEMO_SESSIONS_KEY = "allin-coaching-sessions";
export const DEMO_RECORDINGS_KEY = "allin-recorded-sessions";

export const initialDemoSessions: DemoCoachingSession[] = [
  { id: "s-1", date: "2026-11-18", time: "10:30", coach: "Alex Martin", memberName: "Jordan Lee", status: "upcoming", summary: "" },
  { id: "s-2", date: "2026-11-25", time: "13:00", coach: "Alex Martin", memberName: "Jordan Lee", status: "upcoming", summary: "" },
  { id: "s-3", date: "2026-11-11", time: "10:30", coach: "Alex Martin", memberName: "Jordan Lee", status: "completed", summary: "Jordan a clarifié ses priorités et mis en place un nouveau rituel de planification hebdomadaire." },
  { id: "s-4", date: "2026-11-04", time: "13:00", coach: "Alex Martin", memberName: "Jordan Lee", status: "completed", summary: "La prospection devient plus régulière. Prochaine étape : protéger deux plages de concentration." },
  { id: "s-5", date: "2026-10-28", time: "10:30", coach: "Alex Martin", memberName: "Jordan Lee", status: "completed", summary: "Jordan a identifié les activités qui créent le plus de valeur dans son quotidien." },
  { id: "s-6", date: "2026-10-21", time: "13:00", coach: "Alex Martin", memberName: "Jordan Lee", status: "completed", summary: "Les objectifs du mois ont été définis autour du suivi client et du développement." },
];

export function readDemoSessions(): DemoCoachingSession[] {
  try {
    const saved = localStorage.getItem(DEMO_SESSIONS_KEY);
    if (saved) return JSON.parse(saved) as DemoCoachingSession[];
    localStorage.setItem(DEMO_SESSIONS_KEY, JSON.stringify(initialDemoSessions));
  } catch { /* Use the sample schedule when storage is unavailable. */ }
  return initialDemoSessions;
}

export function writeDemoSessions(sessions: DemoCoachingSession[]) {
  try { localStorage.setItem(DEMO_SESSIONS_KEY, JSON.stringify(sessions)); } catch { /* Keep current view usable when storage is full. */ }
}

export function readDemoRecordings(): DemoRecording[] {
  try { return JSON.parse(localStorage.getItem(DEMO_RECORDINGS_KEY) || "[]") as DemoRecording[]; }
  catch { return []; }
}

export function writeDemoRecordings(recordings: DemoRecording[]) {
  try { localStorage.setItem(DEMO_RECORDINGS_KEY, JSON.stringify(recordings)); } catch { /* Keep current view usable when storage is full. */ }
}

function openRecordingDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("all-in-os-demo-media", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("recordings");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDemoRecording(id: string, blob: Blob) {
  const database = await openRecordingDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = database.transaction("recordings", "readwrite").objectStore("recordings").put(blob, id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  database.close();
}

export async function getDemoRecording(id: string) {
  const database = await openRecordingDatabase();
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    const request = database.transaction("recordings", "readonly").objectStore("recordings").get(id);
    request.onsuccess = () => resolve(request.result as Blob | undefined);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return blob;
}
