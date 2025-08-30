// src/App.tsx
import { useMemo } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { todayKey, addDaysKey, yesterdayKey } from "./utils/date";

type Section = "Al despertar" | "Durante el día" | "Al acostarse";

interface Habit {
  id: string;
  title: string;
  section: Section;
}

const HABITS: Habit[] = [
  { id: "h1", title: "Respiraciones conscientes al despertar", section: "Al despertar" },
  { id: "h2", title: "Lista de 3 prioridades del día", section: "Al despertar" },
  { id: "h3", title: "Pausa de mindfulness (5 min)", section: "Durante el día" },
  { id: "h4", title: "Caminar 10 minutos al aire libre", section: "Durante el día" },
  { id: "h5", title: "Bloquear doomscrolling", section: "Durante el día" },
  { id: "h6", title: "Micro-siesta (10–20 min)", section: "Durante el día" },
  { id: "h7", title: "Ducha consciente", section: "Durante el día" },
  { id: "h8", title: "30 min antes sin pantallas", section: "Al acostarse" },
  { id: "h9", title: "Escribir en diario nocturno", section: "Al acostarse" },
];

const SECTIONS: Section[] = ["Al despertar", "Durante el día", "Al acostarse"];

// logs: { "YYYY-MM-DD": ["h1","h3", ...] }
type Logs = Record<string, string[]>;

const DAILY_TARGET = 6; // objetivo de día OK: ≥6/9 hábitos

export default function App() {
  const today = todayKey();
  const [logs, setLogs] = useLocalStorage<Logs>("logs", {});

  // Conjunto de hábitos completados HOY
  const completedToday = useMemo(() => new Set(logs[today] || []), [logs, today]);
  const completedCount = completedToday.size;
  const pointsToday = completedCount * 10;
  const todayIsSuccess = completedCount >= DAILY_TARGET;

  // Alterna un hábito hoy
  function toggleHabit(id: string) {
    setLogs((prev) => {
      const set = new Set(prev[today] || []);
      set.has(id) ? set.delete(id) : set.add(id);
      return { ...prev, [today]: Array.from(set) };
    });
  }

  // --- Cálculo de racha real (días consecutivos con >= DAILY_TARGET) ---
  const streak = useMemo(() => {
    let count = 0;
    let day = today;

    // Si hoy es exitoso, contamos hoy y seguimos hacia atrás
    if ((logs[day]?.length || 0) >= DAILY_TARGET) {
      count++;
      // retrocede mientras “ayer”, “antes de ayer”, etc. también sean >= objetivo
      for (;;) {
        day = yesterdayKey(day);
        const done = logs[day]?.length || 0;
        if (done >= DAILY_TARGET) count++;
        else break;
      }
    } else {
      // hoy no es exitoso: no contamos hoy, mirar si ayer empezaba una racha (para mostrar info)
      // (opcional, pero dejamos la racha en 0 si hoy no llega al objetivo)
      count = 0;
    }
    return count;
  }, [logs, today]);

  // Insignias (solo ejemplo visual para HOY)
  const badgesToday = useMemo(() => {
    const out: string[] = [];
    if (completedToday.has("h1")) out.push("Zen Starter");
    if (completedToday.has("h8")) out.push("Sueño Limpio");
    if (completedToday.has("h9")) out.push("Escritor Constante");
    if (streak >= 7) out.push("🔥 Racha 7 días");
    return out;
  }, [completedToday, streak]);

  // Mensaje de ayuda según progreso de hoy
  const helperText = todayIsSuccess
    ? "✅ Día conseguido (≥6/9). ¡Suma a tu racha!"
    : `Te faltan ${Math.max(0, DAILY_TARGET - completedCount)} para lograr el objetivo de hoy (≥${DAILY_TARGET}/9).`;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 bg-white border-b p-4">
        <h1 className="text-xl font-bold">🌱 Ritual Bienestar Mental · Nivel 1</h1>
        <p className="text-sm text-gray-600">Persistencia por días + racha real</p>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-8">
        {/* Resumen del día */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border">
          <div>
            <p className="text-sm">Puntos de hoy</p>
            <p className="text-2xl font-bold">{pointsToday}</p>
          </div>
          <div>
            <p className="text-sm">Completados</p>
            <p className="text-2xl font-bold">{completedCount}/9</p>
          </div>
          <div>
            <p className="text-sm">Racha</p>
            <p className="text-2xl font-bold">{streak} 🔥</p>
          </div>
          <div className="basis-full text-sm text-gray-700">{helperText}</div>
          <div className="basis-full">
            <div className="text-sm">Insignias</div>
            <div className="flex gap-2 mt-1 flex-wrap">
              {badgesToday.length ? (
                badgesToday.map((b) => (
                  <span key={b} className="px-2 py-1 rounded-full bg-green-100 text-xs">
                    {b}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Ninguna aún</span>
              )}
            </div>
          </div>
        </div>

        {/* Listado por secciones */}
        {SECTIONS.map((sec) => (
          <div key={sec} className="space-y-3">
            <h2 className="text-lg font-semibold">{sec}</h2>
            <div className="space-y-2">
              {HABITS.filter((h) => h.section === sec).map((habit) => (
                <label
                  key={habit.id}
                  className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={completedToday.has(habit.id)}
                    onChange={() => toggleHabit(habit.id)}
                    aria-label={habit.title}
                  />
                  <span>{habit.title}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Compartir */}
        <div className="p-4 rounded-xl border text-center">
          <p className="text-sm text-gray-600">Compartir</p>
          <button
            className="mt-2 px-4 py-2 rounded-xl border hover:bg-gray-50"
            onClick={() => {
              const msg = todayIsSuccess
                ? `Hoy completé ${completedCount}/9 hábitos 🌱 (${pointsToday}/90 pts) y mi racha va en ${streak} 🔥`
                : `Hoy llevo ${completedCount}/9 hábitos (${pointsToday}/90 pts). Me faltan ${Math.max(
                    0,
                    DAILY_TARGET - completedCount
                  )} para lograr el objetivo de hoy.`;
              if (navigator.share) navigator.share({ text: msg });
              else {
                navigator.clipboard.writeText(msg);
                alert("Copiado ✅");
              }
            }}
          >
            📤 Compartir
          </button>
        </div>

        {/* Debug opcional */}
        <div className="p-4 rounded-xl border mt-2 text-xs text-gray-600">
          <div className="font-semibold mb-1">Debug (sólo para ti)</div>
          <div>Hoy: <code>{today}</code></div>
          <div>Logs: <code>{JSON.stringify(logs)}</code></div>
          <div>Ayer: <code>{yesterdayKey()}</code></div>
          <div>Mañana (test): <code>{addDaysKey(today, 1)}</code></div>
        </div>
      </main>
    </div>
  );
}
