"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    async function run() {
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId || "")}`);
        const data = await res.json();
        if (data?.paid) {
          window.localStorage.setItem("pro_unlocked", "true");
          setStatus("ok");
        } else {
          setStatus("no");
        }
      } catch {
        setStatus("no");
      }
    }

    if (sessionId) run();
    else setStatus("no");
  }, []);

  if (status === "verifying") {
    return (
      <div style={{ paddingTop: 80 }}>
       <div style={{ paddingTop: 40, paddingBottom: 20 }}>
  <h1 className="h1" style={{ maxWidth: 900 }}>
    Know your <span style={{ color: "var(--accent)" }}>real profit</span> per order — 
    before scaling ads.
  </h1>

  <p className="sub" style={{ fontSize: 18, marginTop: 12 }}>
    A fast unit economics simulator for Shopify & DTC brands.  
    Include COGS, shipping, fees, returns and ad spend.  
    Instantly see your break-even ROAS and CPA.
  </p>

  <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
    <a href="#calculator" className="btn btnPrimary">
      Calculate my profit
    </a>
    <a href="/pro" className="btn">
      Unlock Pro — $9 one-time
    </a>
  </div>

  <div className="small" style={{ marginTop: 14 }}>
    Free • No signup • Built for founders & media buyers
  </div>
</div>
    );
  }

  if (status === "ok") {
    return (
      <div style={{ paddingTop: 80, maxWidth: 700 }}>
        <h1 className="h1">🎉 Pro Unlocked</h1>
        <p className="sub">
          You now have full access to:
        </p>

        <ul style={{ lineHeight: 1.8, marginTop: 20 }}>
          <li>✔ Scenario comparison (A vs B)</li>
          <li>✔ Clean PDF export</li>
          <li>✔ No watermark</li>
        </ul>

        <div style={{ marginTop: 30 }}>
          <a className="btn btnPrimary" href="/">
            Go back to calculator
          </a>
        </div>

        <p className="small" style={{ marginTop: 20 }}>
          Pro access is enabled on this device.  
          If you change device, contact support.
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 80 }}>
      <h1 className="h1">Something went wrong</h1>
      <p className="sub">
        We couldn’t verify your payment. If you believe this is an error, contact support.
      </p>
      <a className="btn" href="/pro">Back to Pro</a>
    </div>
  );
}
