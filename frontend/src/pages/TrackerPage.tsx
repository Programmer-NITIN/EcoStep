import { useState } from "react";

interface Action {
  id: string;
  title: string;
  description: string;
  co2_kg: number;
  category: "low-effort" | "high-impact" | "habit" | "one-time";
  icon: string;
  completed: boolean;
}

const INITIAL_ACTIONS: Action[] = [
  { id: "1", title: "No Plastic Day", description: "Avoid all single-use plastics today. Bring your own bags, bottles, and containers.", co2_kg: 5, category: "low-effort", icon: "eco", completed: false },
  { id: "2", title: "Public Transit Only", description: "Commute entirely via public transportation or bicycle for the whole day.", co2_kg: 15, category: "high-impact", icon: "directions_bus", completed: true },
  { id: "3", title: "Meatless Monday", description: "Commit to eating entirely plant-based meals for one day this week.", co2_kg: 8, category: "habit", icon: "restaurant", completed: false },
  { id: "4", title: "Energy Audit", description: "Turn off all standby devices and switch to energy-saving mode for 24 hours.", co2_kg: 3, category: "low-effort", icon: "bolt", completed: false },
  { id: "5", title: "Local Market Run", description: "Buy all groceries from local farmers markets to reduce transport emissions.", co2_kg: 12, category: "one-time", icon: "storefront", completed: false },
  { id: "6", title: "Carpool Week", description: "Share rides with colleagues or friends for the entire work week.", co2_kg: 20, category: "high-impact", icon: "groups", completed: false },
];

const FILTERS = ["All Actions", "Low Effort", "High Impact", "One-time", "Habit"];

const LABEL_MAP: Record<string, string> = {
  "low-effort": "Low Effort",
  "high-impact": "High Impact",
  habit: "Habit",
  "one-time": "One-time",
};

export function TrackerPage() {
  const [actions, setActions] = useState<Action[]>(INITIAL_ACTIONS);
  const [activeFilter, setActiveFilter] = useState("All Actions");

  const completedCO2 = actions.filter((a) => a.completed).reduce((sum, a) => sum + a.co2_kg, 0);
  const targetCO2 = 75;

  const completeAction = (id: string) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, completed: true } : a)));
  };

  const filtered = activeFilter === "All Actions"
    ? actions
    : actions.filter((a) => LABEL_MAP[a.category] === activeFilter);

  return (
    <div className="page-container flex flex-col gap-12">
      {/* Hero */}
      <section className="text-center flex flex-col" style={{ alignItems: "center", gap: 24 }}>
        <h1 className="font-display-lg">Every Action Counts.</h1>
        <p className="font-body-lg text-muted" style={{ maxWidth: 640 }}>
          Track your daily and weekly challenges. See your immediate environmental impact grow with every small step.
        </p>
      </section>

      {/* Reward Meter */}
      <section className="glass-card flex" style={{ flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
        <div>
          <h2 className="font-headline-md" style={{ margin: 0 }}>Total CO2 Saved this Week</h2>
          <p className="font-body-md text-muted" style={{ marginTop: 4 }}>You're making a real difference. Keep going!</p>
        </div>
        <div className="flex flex-col" style={{ alignItems: "flex-end", gap: 8, flex: "1 1 300px" }}>
          <div>
            <span className="font-display-lg text-primary">{completedCO2}</span>
            <span className="font-body-lg text-muted" style={{ marginLeft: 4 }}>kg</span>
          </div>
          <div className="progress-track progress-track-lg w-full">
            <div className="progress-fill" style={{ width: `${Math.min(100, (completedCO2 / targetCO2) * 100)}%` }} />
          </div>
          <span className="font-label-sm text-muted">Target: {targetCO2}kg</span>
        </div>
      </section>

      {/* Filters */}
      <section className="flex" style={{ flexWrap: "wrap", gap: 12 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`chip ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </section>

      {/* Action Cards */}
      <section className="action-grid">
        {filtered.map((action) => (
          <div key={action.id} className="glass-card action-card">
            <div className="flex justify-between" style={{ alignItems: "flex-start" }}>
              <div className={`action-label ${action.category}`}>
                <span className="material-symbols-outlined icon-sm">{action.icon}</span>
                {LABEL_MAP[action.category]}
              </div>
              <span className="text-primary" style={{ fontWeight: 700 }}>+{action.co2_kg}kg CO2</span>
            </div>
            <h3 className="font-headline-md" style={{ fontSize: 20, lineHeight: "28px", margin: 0 }}>{action.title}</h3>
            <p className="font-body-md text-muted" style={{ fontSize: 14, flexGrow: 1 }}>{action.description}</p>
            <div className="flex flex-col" style={{ gap: 8, marginTop: 16 }}>
              <div className="progress-track" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: action.completed ? "100%" : "0%" }} />
              </div>
              <button
                className={`action-complete-btn ${action.completed ? "completed" : ""}`}
                disabled={action.completed}
                onClick={() => completeAction(action.id)}
              >
                {action.completed ? "Completed" : "Complete Action"}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
