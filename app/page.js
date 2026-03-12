"use client";

import { useEffect, useState } from "react";
import Calculator from "@/components/Calculator";
import LanguageToggle from "@/components/LanguageToggle";

export default function HomePage() {
  const [lang, setLang] = useState("it");
  const [isPro, setIsPro] = useState(false);
  const [wantsPro, setWantsPro] = useState(false);

  // Load saved settings
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("lang");
      if (savedLang === "en" || savedLang === "it") setLang(savedLang);

      const pro = localStorage.getItem("pro_unlocked") === "true";
      setIsPro(pro);
    } catch {
      // ignore
    }
  }, []);

  // Persist language
  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const copy = {
    it: {
      brandSub: "Calcola margini e pareggio ads, includendo costi reali.",
      title: "Calcolatore Profitto Ecommerce",
      subtitle:
        "Inserisci i costi principali e scopri profitto netto, margine e punto di pareggio. Include spedizioni, commissioni e resi.",
      ctaPro: isPro ? "Pro attivo" : "Sblocca Pro (€9)",
      howTitle: "Come usarlo (in 30 secondi)",
      howBullets: [
        "Compila i campi a sinistra (prezzo, costi, commissioni, resi).",
        "Scegli come misuri le ads (ROAS o costo per acquisto) e inserisci il valore.",
        "Leggi i risultati a destra: profitto netto, margine e pareggio.",
        "Usa le simulazioni per vedere come cambiano i numeri con sconto, resi o ads più care.",
      ],
      proTitle: "Pro (una tantum)",
      proDesc:
        "Con Pro puoi confrontare scenari (A vs B), esportare un report PDF pulito e rimuovere watermark.",
      proBtn: "Vai a Pro",
      proNote:
        "Lo sblocco Pro è legato a questo dispositivo (non a un account).",
      footer:
        "Nota: stime operative. Non è consulenza fiscale/finanziaria.",
    },
    en: {
      brandSub: "Calculate margins and ad break-even with real costs.",
      title: "Ecommerce Profit Calculator",
      subtitle:
        "Fill in your main costs and get net profit, margin, and break-even. Includes shipping, fees, and returns.",
      ctaPro: isPro ? "Pro active" : "Unlock Pro (€9)",
      howTitle: "How to use (30 seconds)",
      howBullets: [
        "Fill the fields on the left (price, costs, fees, returns).",
        "Pick how you track ads (ROAS or cost per purchase) and enter the value.",
        "Read the results on the right: net profit, margin, and break-even.",
        "Use simulations to see the impact of discounts, returns, or higher ad costs.",
      ],
      proTitle: "Pro (one-time)",
      proDesc:
        "With Pro you can compare scenarios (A vs B), export a clean PDF report, and remove watermark.",
      proBtn: "Go to Pro",
      proNote: "Pro unlock is device-based (not account-based).",
      footer: "Disclaimer: estimates only. Not financial/tax advice.",
    },
  };

  const t = copy[lang];

  return (
    <>
      <header className="header">
        <div className="brand">
          <div className="brandTitle">Real Ecommerce Profit</div>
          <div className="brandSub">{t.brandSub}</div>
        </div>

        <div className="headerRight">
          <LanguageToggle lang={lang} setLang={setLang} />
          <a className="btn btnPrimary" href="/pro">
            {t.ctaPro}
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1 className="h1">{t.title}</h1>
          <p className="sub">{t.subtitle}</p>

          <div className="card" style={{ marginTop: 14 }}>
            <div className="cardTitle">{t.howTitle}</div>
            <ul className="list">
              {t.howBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
          <Calculator lang={lang} isPro={isPro} setWantsPro={setWantsPro} />
        </section>

        <section className="card" style={{ marginTop: 18 }}>
          <div className="cardTitle">{t.proTitle}</div>
          <p className="muted" style={{ marginTop: 6 }}>
            {t.proDesc}
          </p>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
            <a className="btn btnPrimary" href="/pro">
              {t.proBtn}
            </a>
            <span className="muted">{t.proNote}</span>
          </div>
        </section>

        {wantsPro && (
          <div className="card" style={{ marginTop: 14 }}>
            <div className="cardTitle">{lang === "it" ? "Pro" : "Pro"}</div>
            <p className="muted" style={{ marginTop: 6 }}>
              {lang === "it"
                ? "Per sbloccare Pro vai alla pagina di checkout."
                : "To unlock Pro, go to the checkout page."}
            </p>
            <div style={{ marginTop: 10 }}>
              <a className="btn btnPrimary" href="/pro">
                {lang === "it" ? "Apri checkout" : "Open checkout"}
              </a>
              <button
                className="btn"
                style={{ marginLeft: 10 }}
                onClick={() => setWantsPro(false)}
              >
                {lang === "it" ? "Non ora" : "Not now"}
              </button>
            </div>
          </div>
        )}

        <footer className="footer" style={{ marginTop: 18 }}>
          {t.footer}
        </footer>
      </main>
    </>
  );
}
