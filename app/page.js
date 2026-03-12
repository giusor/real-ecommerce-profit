"use client";

import { useEffect, useState } from "react";
import Calculator from "@/components/Calculator";
import LanguageToggle from "@/components/LanguageToggle";

export default function HomePage() {
  const [lang, setLang] = useState("it");
  const [isPro, setIsPro] = useState(false);
  const [wantsPro, setWantsPro] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "en" || savedLang === "it") setLang(savedLang);
    setIsPro(localStorage.getItem("pro_unlocked") === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const copy = {
    it: {
      ctaPro: isPro ? "Pro attivo" : "Sblocca Pro (€1)",
      proTitle: "Pro (una tantum)",
      proDesc:
        "Sblocca export PDF professionale e funzioni avanzate.",
      proBtn: "Sblocca ora per 1€",
    },
    en: {
      ctaPro: isPro ? "Pro active" : "Unlock Pro (€1)",
      proTitle: "Pro (one-time)",
      proDesc:
        "Unlock professional PDF export and advanced features.",
      proBtn: "Unlock now for €1",
    },
  };

  const t = copy[lang];

  return (
    <>
      <header className="header">
        <div className="brand">
          <div className="brandTitle">Real Ecommerce Profit</div>
          <div className="brandSub">
            {lang === "it"
              ? "Calcola margini e pareggio ads."
              : "Calculate margins and ad break-even."}
          </div>
        </div>

        <div className="headerRight">
          <LanguageToggle lang={lang} setLang={setLang} />
          <a className="btn btnPrimary" href="/pro">
            {t.ctaPro}
          </a>
        </div>
      </header>

      <main style={{ marginTop: 20 }}>
        <Calculator
          lang={lang}
          isPro={isPro}
          setWantsPro={setWantsPro}
        />

        <section className="card" style={{ marginTop: 20 }}>
          <div className="cardTitle">{t.proTitle}</div>
          <p className="muted" style={{ marginTop: 8 }}>
            {t.proDesc}
          </p>
          <div style={{ marginTop: 12 }}>
            <a className="btn btnPrimary" href="/pro">
              {t.proBtn}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
