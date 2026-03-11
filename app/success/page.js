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
        <h1 className="h1">Processing payment...</h1>
        <p className="sub">Please wait while we confirm your transaction.</p>
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
