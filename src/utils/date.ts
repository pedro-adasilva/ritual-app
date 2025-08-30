// src/utils/date.ts
function pad(n: number) {
    return n < 10 ? `0${n}` : String(n);
  }
  
  // Fecha local en formato YYYY-MM-DD
  export function todayKey(): string {
    const d = new Date(); // hora local
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    return `${y}-${m}-${day}`;
  }
  
  // src/utils/date.ts (añadir debajo de todayKey)

export function addDaysKey(yyyy_mm_dd: string, delta: number): string {
    const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
    const date = new Date(y, (m - 1), d);
    date.setDate(date.getDate() + delta);
    const y2 = date.getFullYear();
    const m2 = String(date.getMonth() + 1).padStart(2, "0");
    const d2 = String(date.getDate()).padStart(2, "0");
    return `${y2}-${m2}-${d2}`;
  }
  
  export function yesterdayKey(ofDay?: string): string {
    const base = ofDay ?? todayKey();
    return addDaysKey(base, -1);
  }
  