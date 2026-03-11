"use client";

import { useEffect, useState } from "react";

export default function ProPage() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("lang");
    setLang(saved === "it" ? "it" : "en");
  }, []);

  const title = lang === "it" ? "Sblocca Pro" : "Unlock Pro";
  const price = lang === "it" ? "€9" : "$9";

  async function startCheckout() {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang })
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else alert("Checkout error. Please try again.");
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <h1 className="h1">{title}</h1>
      <p className="sub">
        {lang === "it"
          ? "Pagamento una tantum. Niente abbonamento. Sblocca confronto scenari e export PDF."
          : "One-time payment. No subscription. Unlock scenario compare and PDF export."}
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Pro — {price} {lang === "it" ? "una tantum" : "one-time"}</h3>
        <ul style={{ color: "var(--text)", lineHeight: 1.8 }}>
          <li>{lang === "it" ? "Confronto scenari A vs B" : "Compare scenarios A vs B"}</li>
          <li>{lang === "it" ? "Export PDF pulito" : "Clean PDF export"}</li>
          <li>{lang === "it" ? "Rimuovi watermark" : "Remove watermark"}</li>
        </ul>

        <div className="btnRow">
          <button className="btn btnPrimary" onClick={startCheckout}>
            {lang === "it" ? "Vai al pagamento" : "Checkout"}
          </button>
          <a className="btn" href="/">{lang === "it" ? "Torna al calcolatore" : "Back to calculator"}</a>
        </div>

        <div className="small" style={{ marginTop: 10 }}>
          {lang === "it"
            ? "Dopo il pagamento tornerai qui con Pro attivo sul dispositivo."
            : "After payment you’ll come back with Pro enabled on this device."}
        </div>
      </div>
    </div>
  );
}
