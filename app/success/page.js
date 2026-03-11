// app/page.js
import Calculator from "@/components/Calculator";

export const metadata = {
  title: "Ecommerce Profit Calculator — real profit & break-even ROAS",
  description:
    "A fast unit economics calculator for Shopify & DTC brands. Include COGS, shipping, payment fees, returns and ad spend. Get net profit per order and break-even ROAS/CPA.",
};

export default function HomePage() {
  return (
    <main>
      {/* TOP BAR */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(10px)",
          background: "rgba(10, 18, 24, 0.75)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background:
                  "linear-gradient(135deg, rgba(60,200,255,0.9), rgba(60,255,180,0.8))",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            />
            <span style={{ color: "white", fontWeight: 700 }}>
              Real Ecommerce Profit
            </span>
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a className="btn" href="#calculator">
              Calculator
            </a>
            <a className="btn btnPrimary" href="/pro">
              Unlock Pro — $9 one-time
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "56px 16px 18px",
        }}
      >
        <h1 className="h1" style={{ maxWidth: 900 }}>
          Know your <span style={{ color: "var(--accent)" }}>real profit</span>{" "}
          per order — before scaling ads.
        </h1>

        <p className="sub" style={{ fontSize: 18, marginTop: 12, maxWidth: 900 }}>
          A fast unit economics simulator for Shopify & DTC brands. Include COGS,
          shipping, fees, returns and ad spend. Instantly see your break-even ROAS
          and CPA.
        </p>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <a href="#calculator" className="btn btnPrimary">
            Calculate my profit
          </a>
          <a href="/pro" className="btn">
            See Pro features
          </a>
          <span className="small" style={{ opacity: 0.9 }}>
            Free • No signup • Built for founders & media buyers
          </span>
        </div>

        {/* BENEFITS */}
        <div style={{ marginTop: 38 }} className="row">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Net profit clarity</h3>
            <p className="small" style={{ marginTop: 8 }}>
              See your true profit per order after ads, fees, shipping and returns.
            </p>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Break-even targets</h3>
            <p className="small" style={{ marginTop: 8 }}>
              Know exactly what CPA or ROAS you can afford before losing money.
            </p>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Scenario simulation</h3>
            <p className="small" style={{ marginTop: 8 }}>
              Test discounts, higher ad costs or return-rate changes instantly.
            </p>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.08)",
            marginTop: 24,
            marginBottom: 24,
          }}
        />
      </div>

      {/* CALCULATOR */}
      <section
        id="calculator"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 16px 10px",
        }}
      >
        <Calculator />
      </section>

      {/* PRO SECTION */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "22px 16px 70px",
        }}
      >
        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ marginTop: 0 }}>Upgrade to Pro</h2>
          <p className="sub">
            Designed for operators who test pricing, ads and margin assumptions daily.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
              marginTop: 14,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontWeight: 700 }}>Free</div>
              <ul style={{ lineHeight: 1.9, marginTop: 8, paddingLeft: 18 }}>
                <li>Calculator</li>
                <li>Break-even ROAS/CPA</li>
                <li>Instant insights</li>
              </ul>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 14,
                border: "1px solid rgba(60,255,180,0.25)",
                background:
                  "linear-gradient(135deg, rgba(60,200,255,0.10), rgba(60,255,180,0.08))",
              }}
            >
              <div style={{ fontWeight: 700 }}>
                Pro <span style={{ opacity: 0.8 }}>(one-time)</span>
              </div>
              <ul style={{ lineHeight: 1.9, marginTop: 8, paddingLeft: 18 }}>
                <li>Scenario comparison (A vs B)</li>
                <li>Clean PDF export</li>
                <li>No watermark</li>
              </ul>

              <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a className="btn btnPrimary" href="/pro">
                  Unlock Pro — $9 one-time
                </a>
                <a className="btn" href="/pro">
                  View details
                </a>
              </div>

              <div className="small" style={{ marginTop: 10, opacity: 0.9 }}>
                No subscription. Pay once, use anytime.
              </div>
            </div>
          </div>

          {/* FAQ mini */}
          <div style={{ marginTop: 18 }}>
            <h3 style={{ marginBottom: 6 }}>FAQ</h3>
            <div className="small" style={{ lineHeight: 1.8, opacity: 0.95 }}>
              <div>
                <strong>Do you store my numbers?</strong> No — calculations run in your browser.
              </div>
              <div>
                <strong>Is this “exact”?</strong> It’s a fast estimator. Accuracy depends on your inputs.
              </div>
              <div>
                <strong>Does it replace Shopify analytics?</strong> No — it’s for quick unit economics decisions.
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ marginTop: 18, opacity: 0.9 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
            className="small"
          >
            <span>© {new Date().getFullYear()} Real Ecommerce Profit</span>
            <span style={{ display: "flex", gap: 14 }}>
              <a href="/privacy" className="small">
                Privacy
              </a>
              <a href="/terms" className="small">
                Terms
              </a>
              <a href="/pro" className="small">
                Pro
              </a>
            </span>
          </div>
        </footer>
      </section>
    </main>
  );
}
