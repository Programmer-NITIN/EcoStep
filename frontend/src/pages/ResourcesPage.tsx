export function ResourcesPage() {
  return (
    <div className="page-container flex flex-col gap-12">
      {/* Hero */}
      <section className="text-center flex flex-col" style={{ alignItems: "center", gap: 24 }}>
        <h1 className="font-display-lg" style={{ margin: 0 }}>Knowledge is Power</h1>
        <p className="font-body-lg text-muted" style={{ maxWidth: 640 }}>
          Explore our curated collection of guides, deep-dives, and insights to empower your sustainable journey. Small steps lead to global impact.
        </p>
      </section>

      {/* Featured Insights */}
      <section className="flex flex-col gap-4">
        <h2 className="font-headline-md" style={{ borderBottom: "1px solid var(--surface-dim)", paddingBottom: 8, margin: 0 }}>Featured Insights</h2>
        <div className="bento-grid">
          {/* Main Card */}
          <div className="bento-8 featured-card-large">
            <div 
              className="featured-bg" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFo8G6QnFq2FjJ935qVw87hV-1LidqZ-w7dYhZApz-n0e7bH8d_Q7x_p0g6d4n9c3a3f_r9m-KxS5Ld_uNq4R2FvK0s5l6wA')" }} 
            />
            <div className="featured-overlay" />
            <div className="featured-content">
              <div className="flex justify-between items-start w-full">
                <span className="featured-tag">Expert Deep-Dive</span>
                <button className="bookmark-btn" aria-label="Bookmark article">
                  <span className="material-symbols-outlined" style={{ color: "#fff" }}>bookmark</span>
                </button>
              </div>
              <h3 className="font-display-lg" style={{ fontSize: 32, lineHeight: "40px", color: "#fff", margin: "16px 0 8px" }}>
                5 Ways to Decarbonize Your Home
              </h3>
              <p className="font-body-md" style={{ color: "rgba(255,255,255,0.9)", margin: "0 0 16px" }}>
                Practical, high-impact strategies to reduce your household's carbon footprint, from smart thermostats to passive cooling techniques.
              </p>
              <span className="font-label-sm" style={{ opacity: 0.8 }}>12 min read</span>
            </div>
          </div>

          {/* Side Card */}
          <div className="bento-4 card flex flex-col justify-between" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlsDq_OkuKlK3Cj9dlB19vle2Gd-7Z21mvUdyPP50ESRCb_9afpEHVz3Lv3pgXaLOYQJC2eIKqgDT05HgGTTZ1WvQ0uT0orLt7XHMFCjia8CkR9JVpu9xnSDzZOA8jm17FKrIVUrh0JexCORqBN4OkOdfVhLoQRT1UlgHhbwe1Lfn4pDRvW42ZSwKoeJHKnlRah5H0oSVbnpY0j7GKmHyU4oO05EaF9AEqh3IojnM2GfLm3CSPr3hTxB1mSuLsB2EFWY2TVJ6WAbCq" 
                alt="Stack of folded fabrics in neutral colors"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: 24, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span className="font-label-sm text-primary" style={{ display: "block", marginBottom: 8, textTransform: "uppercase" }}>Beginner Guides</span>
                <h3 className="font-headline-md" style={{ fontSize: 18, lineHeight: "24px", margin: "0 0 8px" }}>
                  The True Cost of Fast Fashion
                </h3>
                <p className="font-body-md text-muted" style={{ fontSize: 14, margin: 0 }}>
                  Unpacking the environmental and social impacts of disposable clothing, and how to build a mindful wardrobe.
                </p>
              </div>
              <div className="flex justify-between items-center" style={{ marginTop: 24 }}>
                <span className="font-label-sm text-muted">8 min read</span>
                <button className="bookmark-btn" aria-label="Bookmark article" style={{ padding: 4 }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--on-surface-variant)" }}>bookmark</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="flex flex-col gap-4">
        <h2 className="font-headline-md" style={{ borderBottom: "1px solid var(--surface-dim)", paddingBottom: 8, margin: 0 }}>Browse by Category</h2>
        <div className="bento-grid">
          <div className="bento-4 category-card">
            <div className="category-icon" style={{ background: "rgba(0,108,73,0.1)", color: "var(--primary)" }}>
              <span className="material-symbols-outlined">eco</span>
            </div>
            <h3 className="font-headline-md" style={{ fontSize: 20, margin: "0 0 8px" }}>Beginner Guides</h3>
            <p className="font-body-md text-muted" style={{ fontSize: 14, margin: "0 0 24px" }}>
              Start your journey here. Simple, actionable steps to understand and reduce your daily impact.
            </p>
            <a href="#root" className="category-link">
              Explore Guides
              <span className="material-symbols-outlined icon-sm">arrow_forward</span>
            </a>
          </div>

          <div className="bento-4 category-card">
            <div className="category-icon" style={{ background: "rgba(164,48,115,0.1)", color: "var(--secondary)" }}>
              <span className="material-symbols-outlined">experiment</span>
            </div>
            <h3 className="font-headline-md" style={{ fontSize: 20, margin: "0 0 8px" }}>Expert Deep-Dives</h3>
            <p className="font-body-md text-muted" style={{ fontSize: 14, margin: "0 0 24px" }}>
              Data-driven analysis and comprehensive reports on complex environmental topics.
            </p>
            <a href="#root" className="category-link" style={{ color: "var(--secondary)" }}>
              Read Analysis
              <span className="material-symbols-outlined icon-sm">arrow_forward</span>
            </a>
          </div>

          <div className="bento-4 category-card">
            <div className="category-icon" style={{ background: "rgba(81,95,116,0.1)", color: "var(--tertiary)" }}>
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <h3 className="font-headline-md" style={{ fontSize: 20, margin: "0 0 8px" }}>Sustainable Reviews</h3>
            <p className="font-body-md text-muted" style={{ fontSize: 14, margin: "0 0 24px" }}>
              Honest, rigorous evaluations of eco-friendly products and services to help you choose wisely.
            </p>
            <a href="#root" className="category-link" style={{ color: "var(--tertiary)" }}>
              View Reviews
              <span className="material-symbols-outlined icon-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
