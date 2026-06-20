import { useState } from "react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl: string;
  avatarLetter?: string;
  streak: number;
  co2Saved: number;
}

const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah Jenkins", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9ba01L6WEkEq7o70vQAV-_qo0vNpffMCNs9wQjOZHo_TZyXwLbKWTcbmkhxZ2rbmgnDpwA_ty7YrA3fTBx3O4I0awTNl6zZk584p3RKwgd0z6VbUrVjQwzD8J2nsewausYnmwAbP-TVwrE9_gqNM0ZsCrshb0QFViwkIoFppWm_p2JbvxjAtko6B92XOLyqGI01Zs8uYJI1SlNJJjoODqI3LaPbT-ptRqfswwKsNZOu865wNWeFELjBV7Ka1WvG7QeH7biMEFwcpa", streak: 42, co2Saved: 340 },
  { rank: 2, name: "Green Team Alpha", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlsDq_OkuKlK3Cj9dlB19vle2Gd-7Z21mvUdyPP50ESRCb_9afpEHVz3Lv3pgXaLOYQJC2eIKqgDT05HgGTTZ1WvQ0uT0orLt7XHMFCjia8CkR9JVpu9xnSDzZOA8jm17FKrIVUrh0JexCORqBN4OkOdfVhLoQRT1UlgHhbwe1Lfn4pDRvW42ZSwKoeJHKnlRah5H0oSVbnpY0j7GKmHyU4oO05EaF9AEqh3IojnM2GfLm3CSPr3hTxB1mSuLsB2EFWY2TVJ6WAbCq", streak: 28, co2Saved: 315 },
  { rank: 3, name: "Marcus Chen", avatarUrl: "", avatarLetter: "M", streak: 14, co2Saved: 290 }
];

const LOCAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Marcus Chen", avatarUrl: "", avatarLetter: "M", streak: 14, co2Saved: 290 },
  { rank: 2, name: "Elena Rostova", avatarUrl: "", avatarLetter: "E", streak: 12, co2Saved: 245 },
  { rank: 3, name: "David Kim", avatarUrl: "", avatarLetter: "D", streak: 9, co2Saved: 180 }
];

export function CommunityPage() {
  const [scope, setScope] = useState<"global" | "local">("local");

  const leaderboard = scope === "global" ? GLOBAL_LEADERBOARD : LOCAL_LEADERBOARD;

  return (
    <div className="page-container flex flex-col gap-12">
      {/* Header Section */}
      <section className="flex justify-between items-end gap-6" style={{ borderBottom: "1px solid var(--outline-variant)", paddingBottom: 32, flexWrap: "wrap" }}>
        <div>
          <h1 className="font-display-lg" style={{ margin: "0 0 8px" }}>Community Insights</h1>
          <p className="font-body-lg text-muted" style={{ maxWidth: 640 }}>
            See how you stack up against the national average and get inspired by top Eco-Champions.
          </p>
        </div>
        <div className="flex items-center gap-4" style={{ background: "var(--primary-container)", color: "var(--on-primary-container)", padding: "16px 24px", borderRadius: "var(--radius-xl)", boxShadow: "0 4px 20px rgba(16,185,129,0.15)" }}>
          <span className="material-symbols-outlined icon-lg" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
          <div>
            <p className="font-label-sm" style={{ textTransform: "uppercase", opacity: 0.8, margin: 0 }}>Total CO2 Saved Globally</p>
            <p className="font-headline-md" style={{ fontWeight: "700", margin: 0 }}>1,452,890 kg</p>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="bento-grid">
        {/* Footprint Comparison Chart */}
        <div className="bento-8 card flex flex-col" style={{ padding: 32 }}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline-md" style={{ margin: 0 }}>Your Footprint vs. Others</h2>
            <div className="flex items-center gap-2" style={{ background: "var(--surface-container-low)", padding: "4px 12px", borderRadius: "var(--radius-full)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)" }}></span>
              <span className="font-label-sm text-muted">Monthly Avg</span>
            </div>
          </div>
          {/* Custom comparison chart */}
          <div className="comparison-chart" style={{ flexGrow: 1, borderBottom: "1px solid var(--outline)" }}>
            {/* Grid lines */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none", opacity: 0.2 }}>
              <div style={{ borderBottom: "1px solid var(--outline-variant)", width: "100%" }}></div>
              <div style={{ borderBottom: "1px solid var(--outline-variant)", width: "100%" }}></div>
              <div style={{ borderBottom: "1px solid var(--outline-variant)", width: "100%" }}></div>
              <div style={{ borderBottom: "1px solid var(--outline-variant)", width: "100%" }}></div>
            </div>
            
            {/* Bars */}
            <div className="comparison-bar">
              <div className="comparison-bar-inner" style={{ height: 128, background: "var(--primary-fixed-dim)" }}>
                <span className="font-label-sm" style={{ color: "var(--on-primary-fixed-variant)" }}>1.2t</span>
              </div>
              <span className="font-label-sm text-muted">You</span>
            </div>

            <div className="comparison-bar">
              <div className="comparison-bar-inner" style={{ height: 192, background: "var(--tertiary-fixed-dim)" }}>
                <span className="font-label-sm" style={{ color: "var(--on-tertiary-fixed-variant)" }}>1.8t</span>
              </div>
              <span className="font-label-sm text-muted">National Avg</span>
            </div>

            <div className="comparison-bar">
              <div className="comparison-bar-inner" style={{ height: 64, background: "var(--primary)" }}>
                <span className="font-label-sm" style={{ color: "var(--on-primary)" }}>0.6t</span>
              </div>
              <span className="font-label-sm text-muted">Eco-Champion</span>
            </div>
          </div>
        </div>

        {/* Join Local Group Card */}
        <div className="bento-4 card flex flex-col justify-between" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
          {/* Subtle background image */}
          <div 
            style={{ 
              position: "absolute", inset: 0, opacity: 0.1, 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDcgFb1IHhDQCcwun1Tb7kRGBp_TuDld0BNiClKJApZK6M2LAwYZn-BueUeTJx9ZT9yLU2fhkaW8w5V_2WXsfcQzzMP8ue5aT21wQPP_SrJeW3VcA9Ba1mGFd1Ljiu8RsFaVLWn5kpvPhZknTlRc2_bNcbu0nSjB5u2TK1rONY-vXNCfdihHSYISVmDnweLBLRAIwObN2_SmPS2ZpS6tQyc907FagxTVAmH8agbSqtzhdP_mH-QKKvujxTJN9x6HVybHZ0h7-nHqZfx')",
              backgroundSize: "cover", backgroundPosition: "center"
            }} 
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: 36 }}>diversity_3</span>
            <h3 className="font-headline-md" style={{ margin: "0 0 8px" }}>Join a Local Group</h3>
            <p className="font-body-md text-muted" style={{ margin: 0 }}>
              Connect with nearby environmental initiatives and amplify your impact together.
            </p>
          </div>
          <button className="btn" style={{ position: "relative", zIndex: 1, marginTop: 24, boxShadow: "0 4px 14px rgba(16,185,129,0.2)" }}>
            Find Groups Near Me
          </button>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="leaderboard card" style={{ padding: 0 }}>
        <div className="leaderboard-header">
          <div>
            <h2 className="font-headline-md" style={{ margin: 0 }}>Top Eco-Champions</h2>
            <p className="font-body-md text-muted" style={{ margin: "4px 0 0" }}>This month's highest impact reducers.</p>
          </div>
          <div className="leaderboard-filters">
            <button className={`filter-btn ${scope === "global" ? "active" : ""}`} onClick={() => setScope("global")}>Global</button>
            <button className={`filter-btn ${scope === "local" ? "active" : ""}`} onClick={() => setScope("local")}>Local</button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="history">
            <thead>
              <tr>
                <th style={{ width: 100, paddingLeft: 32 }}>Rank</th>
                <th>Champion</th>
                <th>Current Streak</th>
                <th style={{ textAlign: "right", paddingRight: 32 }}>Total Impact (CO2 Saved)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((champion) => (
                <tr key={champion.rank}>
                  <td className="font-headline-md text-primary" style={{ fontWeight: "bold", paddingLeft: 32 }}>{champion.rank}</td>
                  <td>
                    <div className="flex items-center" style={{ gap: 16 }}>
                      <div className="champion-avatar">
                        {champion.avatarUrl ? (
                          <img src={champion.avatarUrl} alt={champion.name} />
                        ) : (
                          champion.avatarLetter
                        )}
                      </div>
                      <span className="font-body-md" style={{ fontWeight: 600 }}>{champion.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                      <span className="font-body-md text-muted">{champion.streak} Days</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, paddingRight: 32 }}>{champion.co2Saved} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
