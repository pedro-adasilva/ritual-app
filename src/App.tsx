import React, { useState } from "react";

const HABITS = [
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

const SECTIONS = ["Al despertar", "Durante el día", "Al acostarse"];

export default function App() {
  const [progress, setProgress] = useState({});
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);

  const toggleHabit = (id) => {
    setProgress((prev) => {
      const done = { ...prev, [id]: !prev[id] };
      const completed = Object.values(done).filter(Boolean).length;
      setPoints(completed * 10);
      checkBadges(done);
      return done;
    });
  };

  const checkBadges = (done) => {
    const newBadges = [...badges];
    if (done["h1"] && !newBadges.includes("Zen Starter")) newBadges.push("Zen Starter");
    if (done["h9"] && !newBadges.includes("Escritor Constante")) newBadges.push("Escritor Constante");
    if (done["h8"] && !newBadges.includes("Sueño Limpio")) newBadges.push("Sueño Limpio");
    setBadges(newBadges);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", paddingBottom: 40 }}>
      <header style={{ position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee", padding: 16 }}>
        <h1 style={{ margin: 0 }}>🌱 Ritual Bienestar Mental · Nivel 1</h1>
        <p style={{ margin: 0, color: "#555" }}>MVP con 9 hábitos diarios, puntos e insignias</p>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <div style={{ display: "flex", gap: 16, justifyContent: "space-between", border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "#555" }}>Puntos de hoy</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{points}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#555" }}>Racha</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{streak} 🔥</div>
          </div>
          <div style={{ minWidth: 160 }}>
            <div style={{ fontSize: 12, color: "#555" }}>Insignias</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              {badges.map((b, i) => (
                <span key={i} style={{ padding: "2px 8px", borderRadius: 999, background: "#e8f5e9", fontSize: 12 }}>{b}</span>
              ))}
              {!badges.length && <span style={{ fontSize: 12, color: "#999" }}>Ninguna aún</span>}
            </div>
          </div>
        </div>

        {SECTIONS.map((sec) => (
          <div key={sec} style={{ marginTop: 24 }}>
            <h2 style={{ margin: "8px 0" }}>{sec}</h2>
            <div style={{ display: "grid", gap: 8 }}>
              {HABITS.filter((h) => h.section === sec).map((habit) => (
                <label key={habit.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, border: "1px solid #eee", borderRadius: 12, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={!!progress[habit.id]}
                    onChange={() => toggleHabit(habit.id)}
                    style={{ width: 20, height: 20 }}
                  />
                  <span>{habit.title}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div style={{ border: "1px solid #eee", borderRadius: 12, textAlign: "center", padding: 16, marginTop: 24 }}>
          <div style={{ fontSize: 12, color: "#555" }}>Comparte tu progreso:</div>
          <button
            style={{ marginTop: 8, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 12 }}
            onClick={() => {
              const completed = Object.values(progress).filter(Boolean).length;
              const msg = `Hoy completé ${completed}/9 hábitos 🌱, llevo ${streak} días de racha 🔥.`;
              if (navigator.share) navigator.share({ text: msg });
              else { navigator.clipboard.writeText(msg); alert("Copiado ✅"); }
            }}
          >
            📤 Compartir
          </button>
        </div>
      </main>
    </div>
  );
}
