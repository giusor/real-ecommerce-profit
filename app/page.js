"use client";

import { useEffect, useState } from "react";
import Calculator from "@/components/Calculator";
import LanguageToggle from "@/components/LanguageToggle";

function getInitialLang() {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem("lang");
  return saved === "it" ? "it" : "en";
}

function isProUnlocked() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("pro_unlocked") === "true";
}

export default function HomePage() {
  const [lang, setLang] = useState("en");
  const [isPro, setIsPro] = useState(false);
  const [wantsPro, setWantsPro] = useState(false);

  useEffect(() => {
    const l = getInitialLang();
    setLang(l);
    setIsPro(isProUnlocked());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("lang", lang);
  }, [lang]);

  const title = lang === "it"
    ? "Calcolatore Profitto Ecommerce — profitto reale e ROAS di pareggio"
    : "Ecommerce Profit Calculator — real profit & break-even ROAS";

  const sub = lang === "it"
    ? "Per Shopify e brand DTC. Include ads, fee, spedizioni e resi."
    : "Built for Shopify & DTC brands. Include ads, fees, shipping & returns.";

  return (
    <>
      <div className="header">
        <div className="header-inner">
          <div className="brand">
            <b>Real Ecommerce Profit</b>
            <span>{lang === "it" ? "Calcola margini e ROAS di pareggio" : "Unit economics, no fluff"}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LanguageToggle lang={lang} setLang={setLang} />
            <a className="btn btnPrimary" href="/pro">
              {lang === "it" ? "Sblocca Pro (€9)" : "Unlock Pro ($9)"}
            </a>
          </div>
        </div>
      </div>

      <h1 className="h1">{title}</h1>
      <p className="sub">{sub}</p>

      <Calculator lang={lang} isPro={isPro} setWantsPro={setWantsPro} />

      <div className="hr" />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{lang === "it" ? "Pro (una tantum)" : "Pro (one-time)"}</h3>
        <p style={{ color: "var(--muted)", marginTop: 6 }}>
          {lang === "it"
            ? "Confronta scenari (A vs B), esporta PDF e rimuovi watermark."
            : "Compare scenarios (A vs B), export a clean PDF, remove watermark."}
        </p>
        <div className="btnRow">
          <a className="btn btnPrimary" href="/pro">{lang === "it" ? "Vai a Pro" : "Go Pro"}</a>
          <button
            className="btn"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.setItem("pro_unlocked", "false");
                setIsPro(false);
              }
            }}
          >
            {lang === "it" ? "Reset Pro (debug)" : "Reset Pro (debug)"}
          </button>
        </div>
      </div>

      <div className="footer">
        <p>
          {lang === "it"
            ? "Disclaimer: questo tool fornisce stime operative. Non è consulenza fiscale o finanziaria."
            : "Disclaimer: this tool provides decision estimates. It is not financial or tax advice."}
        </p>
        <p>
          {lang === "it"
            ? "Support: support@realecommerceprofit.com"
            : "Support: support@realecommerceprofit.com"}
        </p>
      </div>
    </>
  );
}
