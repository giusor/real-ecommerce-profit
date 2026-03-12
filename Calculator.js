"use client";

import { useEffect, useMemo, useState } from "react";
import { compute, insight, parseNum, formatMoney, formatPct } from "@/lib/calc";
import { jsPDF } from "jspdf";

function getCurrency(lang) {
  return lang === "it" ? { symbol: "€", code: "EUR" } : { symbol: "$", code: "USD" };
}

function getDefaultState(lang) {
  // keep strings so users can type commas
  if (lang === "it") {
    return {
      price: "49,90",
      cogs: "14,00",
      shipCost: "5,00",
      packCost: "1,00",
      shipCharged: "0,00",
      payFeePct: "0,029",
      payFeeFixed: "0,30",
      platformFeePct: "0,02",
      adMode: "cpa",
      cpa: "18,00",
      roas: "2,5",
      returnRate: "0,08"
    };
  }
  return {
    price: "49.90",
    cogs: "14.00",
    shipCost: "5.00",
    packCost: "1.00",
    shipCharged: "0.00",
    payFeePct: "0.029",
    payFeeFixed: "0.30",
    platformFeePct: "0.02",
    adMode: "cpa",
    cpa: "18.00",
    roas: "2.5",
    returnRate: "0.08"
  };
}

function readCredits() {
  try {
    const cur = Number(localStorage.getItem("pdf_credits") || "0");
    return Number.isFinite(cur) ? cur : 0;
  } catch {
    return 0;
  }
}

function writeCredits(n) {
  try {
    localStorage.setItem("pdf_credits", String(n));
  } catch {}
}

export default function Calculator({ lang = "en", onCreditsChange }) {
  const [s, setS] = useState(() => getDefaultState(lang));
  const [credits, setCredits] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setCredits(readCredits());
  }, []);

  useEffect(() => {
    // if user switches language, keep values but update defaults only if pristine
    // (simple approach: do nothing)
  }, [lang]);

  const t = useMemo(() => ({
    en: {
      inputs: "Inputs",
      results: "Results",
      price: "Product price",
      shipCharged: "Shipping charged",
      cogs: "COGS",
      shipCost: "Shipping cost",
      packCost: "Packaging cost",
      payFeePct: "Payment fee %",
      payFeeFixed: "Payment fee fixed",
      platformFeePct: "Platform fee %",
      adMode: "Ads mode",
      cpa: "CPA (cost/order)",
      roas: "ROAS",
      returnRate: "Return rate",
      revenue: "Revenue",
      profit: "Profit",
      margin: "Margin",
      beCpa: "Break-even CPA",
      beRoas: "Break-even ROAS",
      insight: "Insight",
      buy: "Buy 1 PDF export (€1)",
      export: "Export PDF",
      credits: (n) => `Credits: ${n}`,
      need: "You need 1 credit to export.",
      generating: "Generating PDF…",
      checkout: "Opening checkout…"
    },
    it: {
      inputs: "Input",
      results: "Risultati",
      price: "Prezzo prodotto",
      shipCharged: "Spedizione addebitata",
      cogs: "COGS",
      shipCost: "Costo spedizione",
      packCost: "Costo packaging",
      payFeePct: "Fee pagamento %",
      payFeeFixed: "Fee pagamento fissa",
      platformFeePct: "Fee piattaforma %",
      adMode: "Modalità ads",
      cpa: "CPA (costo/ordine)",
      roas: "ROAS",
      returnRate: "Tasso di reso",
      revenue: "Ricavi",
      profit: "Profitto",
      margin: "Margine",
      beCpa: "CPA di pareggio",
      beRoas: "ROAS di pareggio",
      insight: "Insight",
      buy: "Compra 1 export PDF (1€)",
      export: "Esporta PDF",
      credits: (n) => `Crediti: ${n}`,
      need: "Serve 1 credito per esportare.",
      generating: "Genero il PDF…",
      checkout: "Apro il checkout…"
    }
  })[lang] || {}, [lang]);

  const currency = getCurrency(lang);

  const inputs = useMemo(() => ({
    price: parseNum(s.price),
    cogs: parseNum(s.cogs),
    shipCost: parseNum(s.shipCost),
    packCost: parseNum(s.packCost),
    shipCharged: parseNum(s.shipCharged),
    payFeePct: parseNum(s.payFeePct),
    payFeeFixed: parseNum(s.payFeeFixed),
    platformFeePct: parseNum(s.platformFeePct),
    adMode: s.adMode,
    cpa: parseNum(s.cpa),
    roas: parseNum(s.roas),
    returnRate: parseNum(s.returnRate)
  }), [s]);

  const out = useMemo(() => compute(inputs), [inputs]);
  const insightText = useMemo(() => insight(out, currency.symbol, lang), [out, currency.symbol, lang]);

  function setField(key, val) {
    setS((prev) => ({ ...prev, [key]: val }));
  }

  async function buyPdfCredit() {
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lang })
      });
      const data = await res.json();
      if (!data?.url) throw new Error(data?.error || "No checkout url");
      setMsg(t.checkout);
      window.location.href = data.url;
    } catch (e) {
      setMsg(e?.message || "Failed to open checkout");
      setBusy(false);
    }
  }

  function exportPdf() {
    setMsg("");
    const cur = readCredits();
    if (cur <= 0) {
      setMsg(t.need);
      return;
    }

    setBusy(true);
    setMsg(t.generating);

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const left = 48;
      let y = 56;

      doc.setFontSize(18);
      doc.text("Real Ecommerce Profit", left, y);
      y += 18;

      doc.setFontSize(11);
      doc.setTextColor(120);
      doc.text(new Date().toLocaleString(lang === "it" ? "it-IT" : "en-US"), left, y);
      doc.setTextColor(0);
      y += 24;

      doc.setFontSize(13);
      doc.text(t.results, left, y);
      y += 14;

      const lines = [
        `${t.revenue}: ${formatMoney(out.revenue, currency.symbol)}`,
        `${t.profit}: ${formatMoney(out.profit, currency.symbol)}`,
        `${t.margin}: ${formatPct(out.margin)}`,
        `${t.beCpa}: ${formatMoney(out.breakEvenCPA, currency.symbol)}`,
        `${t.beRoas}: ${Number.isFinite(out.breakEvenROAS) ? out.breakEvenROAS.toFixed(2) : "∞"}`
      ];

      doc.setFontSize(11);
      lines.forEach((line) => {
        doc.text(line, left, y);
        y += 16;
      });

      y += 10;
      doc.setFontSize(13);
      doc.text(t.insight, left, y);
      y += 14;
      doc.setFontSize(11);
      doc.text(doc.splitTextToSize(insightText, 520), left, y);

      doc.save("real-ecommerce-profit.pdf");

      const next = cur - 1;
      writeCredits(next);
      setCredits(next);
      onCreditsChange?.(next);
      setMsg(`${t.credits(next)} ✅`);
    } catch (e) {
      setMsg(e?.message || "PDF export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="brand" style={{ marginBottom: 6 }}>{t.inputs}</div>

        <div className="grid">
          <div>
            <div className="label">{t.price}</div>
            <input className="input" value={s.price} onChange={(e) => setField("price", e.target.value)} />
          </div>
          <div>
            <div className="label">{t.shipCharged}</div>
            <input className="input" value={s.shipCharged} onChange={(e) => setField("shipCharged", e.target.value)} />
          </div>
          <div>
            <div className="label">{t.cogs}</div>
            <input className="input" value={s.cogs} onChange={(e) => setField("cogs", e.target.value)} />
          </div>
          <div>
            <div className="label">{t.shipCost}</div>
            <input className="input" value={s.shipCost} onChange={(e) => setField("shipCost", e.target.value)} />
          </div>
          <div>
            <div className="label">{t.packCost}</div>
            <input className="input" value={s.packCost} onChange={(e) => setField("packCost", e.target.value)} />
          </div>
          <div>
            <div className="label">{t.returnRate}</div>
            <input className="input" value={s.returnRate} onChange={(e) => setField("returnRate", e.target.value)} />
          </div>
          <div>
            <div className="label">{t.payFeePct}</div>
            <input className="input" value={s.payFeePct} onChange={(e) => setField("payFeePct", e.target.value)} />
          </div>
          <div>
            <div className="label">{t.payFeeFixed}</div>
            <input className="input" value={s.payFeeFixed} onChange={(e) => setField("payFeeFixed", e.target.value)} />
          </div>
          <div>
            <div className="label">{t.platformFeePct}</div>
            <input className="input" value={s.platformFeePct} onChange={(e) => setField("platformFeePct", e.target.value)} />
          </div>
          <div>
            <div className="label">{t.adMode}</div>
            <select className="input" value={s.adMode} onChange={(e) => setField("adMode", e.target.value)}>
              <option value="cpa">CPA</option>
              <option value="roas">ROAS</option>
            </select>
          </div>
          {s.adMode === "cpa" ? (
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="label">{t.cpa}</div>
              <input className="input" value={s.cpa} onChange={(e) => setField("cpa", e.target.value)} />
            </div>
          ) : (
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="label">{t.roas}</div>
              <input className="input" value={s.roas} onChange={(e) => setField("roas", e.target.value)} />
            </div>
          )}
        </div>

        <div className="section row" style={{ justifyContent: "space-between" }}>
          <div className="badge">{t.credits(credits)}</div>
          <div className="row">
            <button className="btn" disabled={busy} onClick={buyPdfCredit}>{t.buy}</button>
            <button className="btn btnPrimary" disabled={busy} onClick={exportPdf}>{t.export}</button>
          </div>
        </div>

        {msg ? <div className="toast">{msg}</div> : null}
      </div>

      <div className="card">
        <div className="brand" style={{ marginBottom: 6 }}>{t.results}</div>
        <div className="kpi">
          <div className="kpiBox">
            <div className="kpiLabel">{t.revenue}</div>
            <div className="kpiValue">{formatMoney(out.revenue, currency.symbol)}</div>
          </div>
          <div className="kpiBox">
            <div className="kpiLabel">{t.profit}</div>
            <div className="kpiValue">{formatMoney(out.profit, currency.symbol)}</div>
          </div>
          <div className="kpiBox">
            <div className="kpiLabel">{t.margin}</div>
            <div className="kpiValue">{formatPct(out.margin)}</div>
          </div>
          <div className="kpiBox">
            <div className="kpiLabel">{t.beCpa}</div>
            <div className="kpiValue">{formatMoney(out.breakEvenCPA, currency.symbol)}</div>
          </div>
          <div className="kpiBox" style={{ gridColumn: "1 / -1" }}>
            <div className="kpiLabel">{t.beRoas}</div>
            <div className="kpiValue">{Number.isFinite(out.breakEvenROAS) ? out.breakEvenROAS.toFixed(2) : "∞"}</div>
          </div>
        </div>

        <div className="section">
          <div className="brand" style={{ marginBottom: 6 }}>{t.insight}</div>
          <div className="toast">{insightText}</div>
        </div>
      </div>
    </div>
  );
}
