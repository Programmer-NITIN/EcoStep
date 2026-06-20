import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CalculatorForm } from "../components/CalculatorForm";
import { ResultBreakdown } from "../components/ResultBreakdown";
import { InsightsPanel } from "../components/InsightsPanel";
import { HistoryPanel } from "../components/HistoryPanel";
import { useFootprint } from "../hooks/useFootprint";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartColors = ["#10b981", "#95a4bb", "#fc79bd", "#e0e3e5"];

export function DashboardPage() {
  const { result, insights, entries, loading, saving, error, status, calculate, save } =
    useFootprint();
  const [showCalc, setShowCalc] = useState(false);

  const chartData = result
    ? {
        labels: Object.keys(result.breakdown_kg).map(
          (k) => k.charAt(0).toUpperCase() + k.slice(1)
        ),
        datasets: [
          {
            data: Object.values(result.breakdown_kg),
            backgroundColor: chartColors.slice(0, Object.keys(result.breakdown_kg).length),
            borderWidth: 2,
            borderColor: "#ffffff",
            hoverOffset: 4,
          },
        ],
      }
    : null;

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: "'Inter', sans-serif", size: 14 },
          color: "#3c4a42",
        },
      },
      tooltip: {
        backgroundColor: "rgba(25,28,30,0.9)",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const trendPct = entries.length >= 2
    ? ((entries[0].result.total_annual_tonnes - entries[1].result.total_annual_tonnes) /
        entries[1].result.total_annual_tonnes) * 100
    : null;

  return (
    <div className="page-container">
      <div className="bento-grid" style={{ alignItems: "start" }}>
        {/* Main Column */}
        <div className="bento-8 flex flex-col gap-12">
          {/* Hero / Annual Footprint */}
          <section className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
            <div className="flex" style={{ gap: 32, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: "1 1 280px" }}>
                <h1 className="font-headline-md" style={{ margin: 0 }}>Annual Footprint</h1>
                <p className="font-body-lg text-muted" style={{ marginTop: 8 }}>
                  Your estimated CO2e emissions for the year.
                </p>
                {result && (
                  <div style={{ marginTop: 16 }}>
                    <span className="font-display-lg text-primary">{result.total_annual_tonnes.toFixed(1)}</span>
                    <span className="font-body-lg text-muted" style={{ marginLeft: 8 }}>tons</span>
                  </div>
                )}
                {!result && (
                  <div style={{ marginTop: 16 }}>
                    <span className="font-display-lg text-muted" style={{ opacity: 0.4 }}>—</span>
                    <span className="font-body-lg text-muted" style={{ marginLeft: 8 }}>tons</span>
                  </div>
                )}
                <button
                  className="btn btn-pill"
                  style={{ marginTop: 24 }}
                  onClick={() => setShowCalc(!showCalc)}
                >
                  {showCalc ? "Hide Calculator" : "Log Today's Actions"}
                </button>
              </div>
              {result && chartData && (
                <div style={{ flex: "1 1 240px", height: 256, position: "relative" }}>
                  <Doughnut data={chartData} options={chartOpts} />
                  <div
                    style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span className="font-headline-md">{result.total_annual_tonnes.toFixed(1)}t</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Calculator (expandable) */}
          {showCalc && (
            <div>
              <CalculatorForm onSubmit={calculate} loading={loading} />
              <div role="alert" aria-live="assertive">
                {error && <p className="error">{error}</p>}
              </div>
              <p role="status" className="visually-hidden">{status}</p>
              {result && (
                <>
                  <ResultBreakdown result={result} />
                  {insights && <InsightsPanel insights={insights} />}
                  <div className="card" style={{ marginTop: 16 }}>
                    <button className="btn secondary" onClick={save} disabled={saving} aria-busy={saving}>
                      {saving ? "Saving…" : "Save this entry to my history"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Stats Row */}
          <div className="bento-grid">
            <div className="bento-6 card" style={{ padding: 24 }}>
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md" style={{ fontSize: 18, margin: 0 }}>Monthly Trend</h3>
                <span className="material-symbols-outlined text-primary">trending_down</span>
              </div>
              <div className="flex items-center" style={{ gap: 8, marginTop: 16 }}>
                <span className="stat-value" style={{ color: "var(--primary-container)" }}>
                  {trendPct !== null ? `${trendPct > 0 ? "+" : ""}${trendPct.toFixed(0)}%` : "-12%"}
                </span>
                <span className="font-body-md text-muted">vs last month</span>
              </div>
              <div className="progress-track" style={{ marginTop: 12 }}>
                <div className="progress-fill" style={{ width: "88%", background: "var(--primary-container)" }} />
              </div>
              <p className="font-label-sm text-muted" style={{ marginTop: 8 }}>
                Great progress reducing transport emissions!
              </p>
            </div>

            <div className="bento-6 card" style={{ padding: 24 }}>
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md" style={{ fontSize: 18, margin: 0 }}>Trees Saved Eq.</h3>
                <span className="material-symbols-outlined" style={{ color: "var(--tertiary)" }}>nature</span>
              </div>
              <div className="flex items-center" style={{ gap: 8, marginTop: 16 }}>
                <span className="stat-value" style={{ color: "var(--tertiary)" }}>42</span>
                <span className="font-body-md text-muted">mature trees</span>
              </div>
              <div className="flex" style={{ gap: 4, marginTop: "auto", paddingTop: 16 }}>
                {[1,2,3].map(i => (
                  <span key={i} className="material-symbols-outlined" style={{ color: "var(--primary-container)", fontVariationSettings: "'FILL' 1" }}>eco</span>
                ))}
                {[4,5].map(i => (
                  <span key={i} className="material-symbols-outlined" style={{ color: "var(--outline-variant)" }}>eco</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="bento-4 flex flex-col gap-8">
          {/* Sapling Level */}
          <div className="level-badge">
            <div className="glow" />
            <span className="material-symbols-outlined icon-xl" style={{ fontVariationSettings: "'FILL' 1", marginBottom: 16 }}>psychiatry</span>
            <h2 className="font-headline-md" style={{ margin: "0 0 4px" }}>Sapling Level</h2>
            <p className="font-body-md" style={{ opacity: 0.9, marginBottom: 24 }}>You're growing! 400 pts to Young Oak.</p>
            <div className="level-progress">
              <div className="level-progress-fill" style={{ width: "60%" }} />
            </div>
            <div className="flex justify-between w-full" style={{ marginTop: 8 }}>
              <span className="font-label-sm" style={{ opacity: 0.8 }}>Sapling</span>
              <span className="font-label-sm" style={{ opacity: 0.8 }}>Young Oak</span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="flex flex-col gap-4">
            <h3 className="font-headline-md" style={{ borderBottom: "1px solid var(--surface-dim)", paddingBottom: 8 }}>
              Recommended for You
            </h3>
            <div className="rec-card">
              <div className="rec-icon">
                <span className="material-symbols-outlined" style={{ color: "var(--tertiary)" }}>lightbulb</span>
              </div>
              <div>
                <h4 className="font-body-lg" style={{ fontWeight: 600, margin: 0 }}>Switch to LEDs</h4>
                <p className="font-body-md text-muted" style={{ fontSize: 14, marginTop: 4 }}>Reduce home energy use by up to 15%.</p>
                <span className="rec-tag">-120kg CO2e/yr</span>
              </div>
            </div>
            <div className="rec-card">
              <div className="rec-icon">
                <span className="material-symbols-outlined" style={{ color: "var(--tertiary)" }}>restaurant</span>
              </div>
              <div>
                <h4 className="font-body-lg" style={{ fontWeight: 600, margin: 0 }}>Plant-based Monday</h4>
                <p className="font-body-md text-muted" style={{ fontSize: 14, marginTop: 4 }}>Try one meatless day a week.</p>
                <span className="rec-tag">-80kg CO2e/yr</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* History */}
      <div style={{ marginTop: 48 }}>
        <HistoryPanel entries={entries} />
      </div>
    </div>
  );
}
