"use client";

import { useEffect, useMemo, useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import Calculator from "@/components/Calculator";

function getLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [lang, setLang] = useState("en");
  const [pdfCredits, setPdfCredits] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const saved = getLS("lang", "en");
    setLang(saved === "it" ? "it" : "en");

    const credits = Number(getLS("pdf_credits", "0"));
    setPdfCredits(Number.isFinite(credits) ? credits : 0);

    const params = new URLSearchParams(window.location.search);
    if (params.get("canceled") === "1") {
      setToast(lang === "it" ? "Pagamento annullato." : "Payment canceled.");
      // clean url
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("lang", lang); } catch {}
  }, [lang]);

  // keep credits in sync if /success updated them
  useEffect(() => {
    const onFocus = () => {
      const credits = Number(getLS("pdf_credits", "0"));
      setPdfCredits(Number.isFinite(credits) ? credits : 0);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const copy = useMemo(() => ({
    en: {
      subtitle: "Free profit calculator. PDF export costs €1 per export.",
      credits: (n) => `PDF credits: ${n}`,
      footer: "Estimates only — not financial or tax advice."
    },
    it: {
      subtitle: "Calcolatore gratuito. Export PDF: 1€ per export.",
      credits: (n) => `Crediti PDF: ${n}`,
      footer: "Stime indicative — non consulenza finanziaria o fiscale."
    }
  })[lang], [lang]);

  return (
    <>
      <header className="header">
        <div className="headerRow">
          <div>
            <div className="brand">Real Ecommerce Profit</div>
            <div className="sub">{copy.subtitle}</div>
          </div>
          <div className="row">
            <span className="badge">{copy.credits(pdfCredits)}</span>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      <div className="section">
        <Calculator lang={lang} onCreditsChange={setPdfCredits} />
        <div className="section note">{copy.footer}</div>
        {toast ? <div className="toast">{toast}</div> : null}
      </div>
    </>
  );
}
