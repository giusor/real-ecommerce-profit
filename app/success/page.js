"use client";

import { useEffect, useMemo, useState } from "react";

function bumpPdfCredit() {
  try {
    const cur = Number(localStorage.getItem("pdf_credits") || "0");
    const next = (Number.isFinite(cur) ? cur : 0) + 1;
    localStorage.setItem("pdf_credits", String(next));
    return next;
  } catch {
    return null;
  }
}

export default function Success() {
  const [status, setStatus] = useState("verifying");
  const [credits, setCredits] = useState(null);

  const copy = useMemo(() => ({
    en: {
      verifying: "Verifying payment…",
      ok: "Payment confirmed. PDF credit added.",
      no: "Payment not confirmed.",
      back: "Back to calculator"
    },
    it: {
      verifying: "Verifica pagamento in corso…",
      ok: "Pagamento confermato. Credito PDF aggiunto.",
      no: "Pagamento non confermato.",
      back: "Torna al calcolatore"
    }
  }), []);

  // optional lang via localStorage
  const lang = (() => {
    try {
      const v = localStorage.getItem("lang");
      return v === "it" ? "it" : "en";
    } catch {
      return "en";
    }
  })();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get("session_id");

    if (!session_id) {
      setStatus("no");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(session_id)}`);
        const data = await res.json();
        if (data?.paid && data?.purpose === "pdf") {
          const next = bumpPdfCredit();
          setCredits(next);
          setStatus("ok");
          // redirect home after a moment (clean url)
          setTimeout(() => {
            window.location.href = "/";
          }, 1200);
        } else {
          setStatus("no");
        }
      } catch {
        setStatus("no");
      }
    })();
  }, []);

  const t = copy[lang] || copy.en;

  return (
    <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: 560, width: "100%" }}>
        <div className="brand" style={{ marginBottom: 8 }}>Real Ecommerce Profit</div>
        <div className="sub" style={{ marginBottom: 14 }}>
          {status === "verifying" ? t.verifying : status === "ok" ? t.ok : t.no}
        </div>
        {credits != null ? <div className="badge" style={{ marginBottom: 12 }}>PDF credits: {credits}</div> : null}
        <button className="btn" onClick={() => (window.location.href = "/")}>{t.back}</button>
      </div>
    </main>
  );
}
