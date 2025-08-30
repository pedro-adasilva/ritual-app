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
  