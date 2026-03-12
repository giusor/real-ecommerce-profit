"use client";

import { useMemo, useState } from "react";
import { compute } from "@/lib/calc";

export default function Calculator({ lang, isPro, setWantsPro }) {

  const t = lang === "it"
    ? {
        exportPdf: "Esporta PDF",
        pdfLoading: "Generazione PDF...",
        pdfError: "Errore nella generazione PDF",
      }
    : {
        exportPdf: "Export PDF",
        pdfLoading: "Generating PDF...",
        pdfError: "PDF generation error",
      };

  const [loadingPdf, setLoadingPdf] = useState(false);

  async function handleExportPdf() {
    try {
      setLoadingPdf(true);

      // Per ora simuliamo (vera logica nel prossimo step)
      await new Promise((r) => setTimeout(r, 800));

      alert("PDF export sarà implementato nel prossimo step.");
    } catch (e) {
      alert(t.pdfError);
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <div>

      {/* QUI resta tutto il tuo layout attuale */}

      {isPro && (
        <div style={{ marginTop: 20 }}>
          <button
            className="btn btnPrimary"
            onClick={handleExportPdf}
            disabled={loadingPdf}
          >
            {loadingPdf ? t.pdfLoading : t.exportPdf}
          </button>
        </div>
      )}

    </div>
  );
}
