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

  return (
    <div style={{ paddingTop: 20 }}>
      <h1 className="h1">Success</h1>
      {status === "verifying" && <p className="sub">Verifying your payment…</p>}
      {status === "ok" && (
        <>
          <p className="sub">Pro unlocked on this device ✅</p>
          <a className="btn btnPrimary" href="/">Go to calculator</a>
        </>
      )}
      {status === "no" && (
        <>
          <p className="sub">Couldn’t verify payment. If you believe this is an error, contact support.</p>
          <a className="btn" href="/pro">Back to Pro</a>
        </>
      )}
    </div>
  );
}
