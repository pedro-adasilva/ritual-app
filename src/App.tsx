// src/App.tsx
import { useState } from "react";

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

type Progress = Record<string, boolean>;

export default function MentalHabitsMVP() {
  const [progress, setProgress] = useState<Progress>({});
  const [streak, setStreak] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [badges, setBadges] = useState<string[]>([]);

  const toggleHabit = (id: string) => {
    setProgress((prev) => {
      const next: Progress = { ...prev, [id]: !prev[id] };
      const completed = Object.values(next).filter(Boolean).length;

      // puntos
      setPoints(completed * 10);

      // racha (simplificada para MVP: si hoy >=6, cuenta como día “ok”)
      setStreak((prevStreak) => (completed >= 6 ? Math.max(prevStreak, 1) : prevStreak));

      // insignias
      checkBadges(next);
      return next;
    });
  };

  const checkBadges = (done: Progress) => {
    setBadges((prev) => {
      const out = new Set(prev);
      if (done["h1"]) out.add("Zen Starter");
      if (done["h9"]) out.add("Escritor Constante");
      if (done["h8"]) out.add("Sueño Limpio");
      return Array.from(out);
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 bg-white border-b p-4">
        <h1 className="text-xl font-bold">🌱 Ritual Bienestar Mental · Nivel 1</h1>
        <p className="text-sm text-gray-600">MVP con 9 hábitos diarios, puntos e insignias</p>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between p-4 rounded-xl border">
          <div>
            <p className="text-sm">Puntos de hoy</p>
            <p className="text-2xl font-bold">{points}</p>
          </div>
          <div>
            <p className="text-sm">Racha</p>
            <p className="text-2xl font-bold">{streak} 🔥</p>
          </div>
          <div>
            <p className="text-sm">Insignias</p>
            <div className="flex gap-2 mt-1">
              {badges.length ? (
                badges.map((b) => (
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
                    checked={!!progress[habit.id]}
                    onChange={() => toggleHabit(habit.id)}
                    className="w-5 h-5"
                  />
                  <span>{habit.title}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="p-4 rounded-xl border text-center">
          <p className="text-sm text-gray-600">Comparte tu progreso:</p>
          <button
            className="mt-2 px-4 py-2 rounded-xl border hover:bg-gray-50"
            onClick={() => {
              const completed = Object.values(progress).filter(Boolean).length;
              const msg = `Hoy completé ${completed}/9 hábitos 🌱, llevo ${streak} días de racha 🔥.`;
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
      </main>
    </div>
  );
}
