// src/App.tsx
import { useMemo, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { todayKey, addDaysKey, yesterdayKey } from "./utils/date";

type Section = "Al despertar" | "Durante el día" | "Al acostarse";

interface Habit {
  id: string;
  title: string;
  section: Section;
}

const HABITS: Habit[] = [
  { id: "h1", title: "3 a 5 respiraciones conscientes seguidas", section: "Al despertar" },
  { id: "h2", title: "Escribe 3 objetivos para tu día", section: "Al despertar" },
  { id: "h3", title: "Pausa de mindfulness (5 min)", section: "Durante el día" },
  { id: "h4", title: "Caminar 10 minutos al aire libre", section: "Durante el día" },
  { id: "h5", title: "Bloquear doomscrolling", section: "Durante el día" },
  { id: "h6", title: "Micro-siesta (10–20 min)", section: "Durante el día" },
  { id: "h7", title: "Ducha consciente", section: "Durante el día" },
  { id: "h8", title: "30 min antes sin pantallas", section: "Al acostarse" },
  { id: "h9", title: "Escribe en tu diario", section: "Al acostarse" },
];

// Detalles por hábito (no cambiamos HABITS)
const HABIT_DETAILS: Record<
  string,
  {
    consists: string;
    benefits: string[];
    resources: { label: string; url: string }[];
    hint?: string;
  }
> = {
  h1: {
    consists:
      "Haz de 3 a 5 respiraciones profundas. Si no las has hecho al despertar, hazlas en cualquier momento del día.",
    benefits: [
      "Activa el sistema nervioso parasimpático (relajación).",
      "Reduce la ansiedad matutina y la sensación de “correr desde que abres los ojos”.",
      "Te centra en el presente antes de exponerte al móvil o las prisas.",
    ],
    resources: [
      { label: "Artículo: Respirar más despacio (BBC)", url: "https://www.bbc.com/mundo/vert-cap-54464360" },
      { label: "App: Atmosphere (sonidos relajantes)", url: "https://play.google.com/store/apps/details?id=com.peakpocketstudios.atmosphere&hl=es" },
    ],
    hint: "¿Eres capaz de parar 1 minuto?",
  },
  h2: {
    consists:
      "Dedica 2–3 minutos a escribir tus 3 hábitos o tareas más importantes para el día. No una lista interminable, solo lo esencial.",
    benefits: [
      "Da claridad y dirección desde el inicio.",
      "Previene dispersión y procrastinación.",
      "Aumenta la probabilidad de cumplir lo importante antes que lo urgente.",
    ],
    resources: [
      { label: "App: Mi diario personal", url: "https://play.google.com/store/apps/details?id=mydiary.journal.diary.diarywithlock.diaryjournal.secretdiary&hl=es_419" },
    ],
    hint: "3 prioridades, no más",
  },
  h3: {
    consists:
      "Busca un lugar tranquilo, siéntate y dedica 5 minutos a observar tu respiración o tus sensaciones. Si tu mente se dispersa, vuelve suavemente al presente.",
    benefits: [
      "Reset mental en mitad de la jornada.",
      "Reduce el estrés acumulado.",
      "Mejora la concentración y regula emociones.",
    ],
    resources: [
      { label: "Cómo meditar en 5 minutos (Mindful.org)", url: "https://www.mindful.org/meditation/mindfulness-getting-started/" },
      { label: "App: Insight Timer", url: "https://insighttimer.com/" },
    ],
    hint: "Un temporizador y listo",
  },
  h4: {
    consists:
      "Sal a dar un paseo sin auriculares ni móvil, prestando atención al entorno, a la respiración y al movimiento del cuerpo.",
    benefits: [
      "Mejora el estado de ánimo con luz natural.",
      "Incrementa creatividad y reduce fatiga mental.",
      "Refuerza salud cardiovascular e inmune.",
    ],
    resources: [
      { label: "Beneficios de caminar (Harvard)", url: "https://www.health.harvard.edu/staying-healthy/5-surprising-benefits-of-walking" },
      { label: "App: Google Fit", url: "https://www.google.com/fit/" },
    ],
    hint: "Salir ya, 10’ marcan el día",
  },
  h5: {
    consists:
      "Instala bloqueadores o fija límites claros para evitar el uso compulsivo de redes y noticias negativas.",
    benefits: [
      "Protege tu salud mental de la sobrecarga de información y la ansiedad.",
      "Recupera horas de productividad y descanso.",
      "Favorece actividades más nutritivas (lectura, hobbies, relaciones).",
    ],
    resources: [
      { label: "App: Freedom", url: "https://freedom.to/" },
      { label: "App: AppBlock / Digital Wellbeing", url: "https://wellbeing.google/" },
      { label: "Qué es el doomscrolling (Psychology Today)", url: "https://www.psychologytoday.com/us/basics/doomscrolling" },
    ],
    hint: "Bloquea 2–3 franjas críticas",
  },
  h6: {
    consists:
      "Descansa entre 10 y 20 minutos tras el almuerzo o cuando sientas fatiga. Evita pasar de 30’ para no tener inercia del sueño.",
    benefits: [
      "Mejora memoria y concentración.",
      "Aumenta alerta y reduce fatiga.",
      "Favorece el estado de ánimo y la regulación emocional.",
    ],
    resources: [
      { label: "Siestas: guía Mayo Clinic", url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/napping/art-20048319" },
      { label: "Inemuri (siesta breve consciente)", url: "https://en.wikipedia.org/wiki/Inemuri" },
    ],
    hint: "Pon alarma suave de 15’",
  },
  h7: {
    consists:
      "Durante la ducha, enfoca tu atención en temperatura, presión del agua y sensaciones corporales. Si tu mente se va, vuelve al presente.",
    benefits: [
      "Convierte un hábito rutinario en práctica de mindfulness.",
      "Ayuda a desconectar del piloto automático.",
      "Refuerza la conexión con el cuerpo.",
    ],
    resources: [
      { label: "Mindful shower (Mindful.org)", url: "https://www.mindful.org/mindful-showers-an-easy-way-to-practice-mindfulness/" },
      { label: "Libro: Mindfulness para principiantes (Kabat-Zinn)", url: "https://www.amazon.es/dp/8499881718" },
    ],
    hint: "Atiende a las sensaciones",
  },
  h8: {
    consists:
      "Apaga móvil, ordenador y tele 30 minutos antes de dormir. Sustituir por lectura, música tranquila o escritura ligera.",
    benefits: [
      "Mejora la calidad del sueño al reducir luz azul.",
      "Permite al cerebro entrar en calma antes de dormir.",
      "Crea un ritual nocturno reparador.",
    ],
    resources: [
      { label: "Sleep Foundation – Higiene del sueño", url: "https://www.sleepfoundation.org/sleep-hygiene" },
      { label: "App: f.lux / Night Shift", url: "https://justgetflux.com/" },
    ],
    hint: "Deja el cargador fuera del dormitorio",
  },
  h9: {
    consists:
      "Antes de dormir, escribe brevemente: cómo me siento, qué agradezco hoy, cómo he tratado mis objetivos y qué he aprendido para mañana.",
    benefits: [
      "Favorece autorreflexión y autocompasión.",
      "Refuerza aprendizaje diario y gratitud.",
      "Mejora el descanso mental al “vaciar la cabeza”.",
    ],
    resources: [
      { label: "Evening Journal (Tim Ferriss)", url: "https://tim.blog/2015/01/15/productivity-hacks-for-the-motivationally-challenged/" },
      { label: "App: Daylio", url: "https://daylio.net/" },
    ],
    hint: "3–5 líneas, máximo 5 minutos",
  },
};

const SECTIONS: Section[] = ["Al despertar", "Durante el día", "Al acostarse"];

// logs: { "YYYY-MM-DD": ["h1","h3", ...] }
type Logs = Record<string, string[]>;

const DAILY_TARGET = 6; // objetivo de día OK: ≥6/9 hábitos

function ProgressBar({ value }: { value: number }) {
  // value: 0..1
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-black transition-all"
        style={{ width: `${Math.round(pct * 100)}%` }}
      />
    </div>
  );
}

export default function App() {
  const today = todayKey();
  const [logs, setLogs] = useLocalStorage<Logs>("logs", {});
  const [open, setOpen] = useState<Set<string>>(new Set());

  function toggleOpen(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }


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
        <h1 className="text-xl font-bold">🌱 Mentally</h1>
        <p className="text-sm text-gray-600">Mejora tus hábitos manetales</p>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-8">
        {/* Resumen del día */}
        <div className="p-4 rounded-xl border space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
          </div>

          {/* Barra de progreso */}
          <ProgressBar value={pointsToday / 90} />

          {/* Mensaje de estado */}
          {completedCount === 0 ? (
            <p className="text-sm text-gray-700">
              👋 Empieza por <strong>“Respiraciones”</strong> o por <strong>“3 prioridades”</strong>. Un minuto y ya notas efecto.
            </p>
          ) : todayIsSuccess ? (
            <p className="text-sm text-green-700">✅ Objetivo del día logrado (≥6/9). ¡Estás sumando a tu racha!</p>
          ) : (
            <p className="text-sm text-gray-700">
              Te faltan <strong>{Math.max(0, DAILY_TARGET - completedCount)}</strong> para lograr el objetivo de hoy (≥{DAILY_TARGET}/9).
            </p>
          )}

          {/* Insignias (hoy) */}
          <div>
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
            {HABITS.filter((h) => h.section === sec).map((habit) => {
              const isOpen = open.has(habit.id);
              const checked = completedToday.has(habit.id);
              const d = HABIT_DETAILS[habit.id];
              return (
                <div key={habit.id} className="border rounded-xl" role="group" aria-label={habit.title}>
                  {/* Cabecera clicable (abre/cierra) */}
                  <button
                    className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-gray-50 rounded-t-xl"
                    onClick={() => toggleOpen(habit.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox: SOLO marca/desmarca; no abre/cierra */}
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={checked}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleHabit(habit.id)}
                        aria-label={`Marcar ${habit.title}`}
                        title={checked ? "Marcado" : "+10 puntos al marcar"}
                      />
                      <div>
                        <div className="font-medium">{habit.title}</div>
                        {d?.hint && <div className="text-xs text-gray-500">{d.hint}</div>}
                      </div>
                    </div>
                    <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {/* Panel expandible */}
                  {isOpen && d && (
                    <div className="px-4 pb-4 pt-1 space-y-3">
                      <div>
                        <div className="text-sm font-semibold">En qué consiste</div>
                        <p className="text-sm text-gray-700 mt-1">{d.consists}</p>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Por qué es útil</div>
                        <ul className="list-disc pl-5 text-sm text-gray-700 mt-1 space-y-1">
                          {d.benefits.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Recursos</div>
                        <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                          {d.resources.map((r) => (
                            <li key={r.url}>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-gray-800"
                              >
                                {r.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
