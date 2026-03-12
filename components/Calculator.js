"use client";

import { useMemo, useState } from "react";
import { compute } from "@/lib/calc";

/* ---------------- helpers ---------------- */

function isNumLike(s) {
  if (s === "" || s === null || s === undefined) return false;
  const v = String(s).trim().replace(",", ".");
  return v !== "" && !Number.isNaN(Number(v));
}

function toNumber(s) {
  if (!isNumLike(s)) return 0;
  return Number(String(s).trim().replace(",", "."));
}

function fmtMoney(n, symbol) {
  const v = Number(n || 0);
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  const s = abs.toFixed(2);
  const parts = s.split(".");
  const int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const dec = parts[1];
  return `${sign}${symbol}${int}.${dec}`;
}

function fmtPct(n) {
  const v = Number(n || 0);
  return `${(v * 100).toFixed(1)}%`;
}

function normalizeMoneyStringForLang(str, lang) {
  if (lang !== "it") return str;
  // 1,234.56 => 1.234,56
  return str.replace(/(\d),(?=\d{3}\b)/g, "$1.").replace(/\.(\d{2})\b/g, ",$1");
}

function defaultState(lang) {
  const dot = lang === "it" ? "," : ".";
  return {
    price: `49${dot}00`,
    productCost: `18${dot}00`,
    shippingCost: `6${dot}50`,
    shippingCharged: `4${dot}90`,
    packaging: `0${dot}80`,
    payFeePct: `2${dot}9`,
    payFeeFixed: `0${dot}30`,
    platformFeePct: `0${dot}0`,
    returnsPct: `8`,
    adsMode: "roas", // "roas" | "cpa"
    roas: `2${dot}5`,
    cpa: `20${dot}00`,
    // Sim
    adUpPct: 0,
    discountPct: 0,
    returnsUp: 0,
  };
}

/* ---------------- component ---------------- */

export default function Calculator({ lang, isPro, setWantsPro }) {
  const t = useMemo(() => {
    const it = {
      input: "Input",
      results: "Risultati",
      simulation: "Simulazione",
      unlock: "Sblocca Pro",
      resetSim: "Reset simulazione",

      exportPdf: "Esporta PDF",
      exporting: "Creo il PDF...",
      exportHint: "Scarica un report pulito in PDF (solo Pro).",

      sellPrice: "Prezzo di vendita",
      sellPriceHelp: "Quanto paga il cliente per il prodotto.",
      sellPricePh: "es. 49,00",

      productCost: "Costo prodotto per ordine",
      productCostHelp: "Costo merce medio per ordine.",
      productCostPh: "es. 18,00",

      shippingYou: "Spedizione (costo tuo)",
      shippingYouHelp: "Quanto paghi tu al corriere.",
      shippingYouPh: "es. 6,50",

      shippingCustomer: "Spedizione pagata dal cliente",
      shippingCustomerHelp: "Metti 0 se fai spedizione gratuita.",
      shippingCustomerPh: "es. 4,90 (o 0)",

      packaging: "Packaging",
      packagingHelp: "Scatola, materiali, etichette.",
      packagingPh: "es. 0,80",

      payFeesPct: "Commissione pagamento (%)",
      payFeesPctHelp: "Percentuale (Stripe/PayPal ecc.).",
      payFeesPctPh: "es. 2,9",

      payFeesFixed: "Commissione pagamento fissa",
      payFeesFixedHelp: "Costo fisso per transazione.",
      payFeesFixedPh: "es. 0,30",

      platformFeePct: "Commissione piattaforma (%)",
      platformFeePctHelp: "Solo se applicabile (marketplace/app).",
      platformFeePctPh: "es. 0",

      returnsPct: "Resi (%)",
      returnsPctHelp: "Quota media di ordini rimborsati.",
      returnsPctPh: "es. 8",

      adsTitle: "Pubblicità",
      adsModeLabel: "Come inserisci la pubblicità?",
      adsModeROAS: "Rendimento (ricavi / spesa)",
      adsModeCPA: "Costo per ordine",

      roasLabel: "Rendimento pubblicità (x)",
      roasHelp: "Esempio: 2,5 = 2,5€ di ricavi per 1€ speso.",
      roasPh: "es. 2,5",

      cpaLabel: "Costo pubblicità per ordine",
      cpaHelp: "Quanto spendi in ads per ottenere un ordine.",
      cpaPh: "es. 20,00",

      kpiProfit: "Profitto netto per ordine",
      kpiMargin: "Margine netto",
      kpiBreakEvenAds: "Spesa ads massima per non andare in perdita",
      kpiBreakEvenROAS: "Rendimento ads minimo per non andare in perdita",

      insightTitle: "Interpretazione",
      insightGood:
        "Ottimo: hai margine. Puoi sostenere ads più care o piccoli sconti senza andare in perdita.",
      insightOk:
        "Margine stretto: piccoli cambiamenti (ads, resi, sconti) possono ribaltare il risultato.",
      insightBad:
        "Sei in perdita: rivedi prezzo, costi, resi o spesa ads prima di scalare.",

      statusLoss: "In perdita",
      statusOk: "Margine stretto",
      statusProfit: "Profittevole",

      simAdsUp: "Ads più care",
      simDiscount: "Sconto",
      simReturnsUp: "Resi in aumento",
      simHint: "Muovi i cursori per vedere l’impatto.",

      lockedNote: "In Pro: confronto scenari + export PDF pulito (senza watermark).",
      disclaimer: "Nota: stime operative. Non è consulenza fiscale/finanziaria.",
      currencySymbol: "€",

      requiredHint: "Inserisci un numero valido",
      exportErr: "Errore durante la generazione del PDF.",
    };

    const en = {
      input: "Inputs",
      results: "Results",
      simulation: "Simulation",
      unlock: "Unlock Pro",
      resetSim: "Reset simulation",

      exportPdf: "Export PDF",
      exporting: "Creating PDF...",
      exportHint: "Download a clean PDF report (Pro only).",

      sellPrice: "Selling price",
      sellPriceHelp: "What the customer pays for the product.",
      sellPricePh: "e.g. 49.00",

      productCost: "Product cost per order",
      productCostHelp: "Average product cost per order.",
      productCostPh: "e.g. 18.00",

      shippingYou: "Shipping (your cost)",
      shippingYouHelp: "What you pay the carrier.",
      shippingYouPh: "e.g. 6.50",

      shippingCustomer: "Shipping charged to customer",
      shippingCustomerHelp: "Use 0 if you offer free shipping.",
      shippingCustomerPh: "e.g. 4.90 (or 0)",

      packaging: "Packaging",
      packagingHelp: "Box, labels, materials.",
      packagingPh: "e.g. 0.80",

      payFeesPct: "Payment fee (%)",
      payFeesPctHelp: "Percentage fee (Stripe/PayPal etc.).",
      payFeesPctPh: "e.g. 2.9",

      payFeesFixed: "Payment fixed fee",
      payFeesFixedHelp: "Fixed fee per transaction.",
      payFeesFixedPh: "e.g. 0.30",

      platformFeePct: "Platform fee (%)",
      platformFeePctHelp: "Only if applicable (marketplace/app).",
      platformFeePctPh: "e.g. 0",

      returnsPct: "Returns (%)",
      returnsPctHelp: "Average share of orders refunded.",
      returnsPctPh: "e.g. 8",

      adsTitle: "Advertising",
      adsModeLabel: "How do you enter advertising?",
      adsModeROAS: "Return (revenue / spend)",
      adsModeCPA: "Cost per order",

      roasLabel: "Ad return (x)",
      roasHelp: "Example: 2.5 = $2.5 revenue per $1 spent.",
      roasPh: "e.g. 2.5",

      cpaLabel: "Ad cost per order",
      cpaHelp: "Average ad spend to get one order.",
      cpaPh: "e.g. 20.00",

      kpiProfit: "Net profit per order",
      kpiMargin: "Net margin",
      kpiBreakEvenAds: "Max ad spend to avoid losing money",
      kpiBreakEvenROAS: "Min ad return to avoid losing money",

      insightTitle: "Insight",
      insightGood:
        "Great: you have margin. You can handle higher ad costs or small discounts without going negative.",
      insightOk:
        "Tight: small changes (ads, returns, discounts) can flip the result.",
      insightBad:
        "You’re losing money: revisit price, costs, returns, or ad spend before scaling.",

      statusLoss: "Losing money",
      statusOk: "Tight margin",
      statusProfit: "Profitable",

      simAdsUp: "Higher ad costs",
      simDiscount: "Discount",
      simReturnsUp: "More returns",
      simHint: "Move sliders to see the impact.",

      lockedNote: "In Pro: scenario comparison + clean PDF export (no watermark).",
      disclaimer: "Disclaimer: estimates only. Not financial/tax advice.",
      currencySymbol: "$",

      requiredHint: "Enter a valid number",
      exportErr: "Error while generating PDF.",
    };

    return lang === "it" ? it : en;
  }, [lang]);

  const [state, setState] = useState(() => defaultState(lang));
  const [pdfBusy, setPdfBusy] = useState(false);

  const currencySymbol = t.currencySymbol;

  const baseInputs = useMemo(() => {
    const price = toNumber(state.price);
    const cogs = toNumber(state.productCost);
    const shipCost = toNumber(state.shippingCost);
    const shipCharged = toNumber(state.shippingCharged);
    const packaging = toNumber(state.packaging);
    const payFeePct = toNumber(state.payFeePct) / 100;
    const payFeeFixed = toNumber(state.payFeeFixed);
    const platformFeePct = toNumber(state.platformFeePct) / 100;
    const returnsPct = toNumber(state.returnsPct) / 100;

    let adCost = 0;
    if (state.adsMode === "roas") {
      const roas = Math.max(0.0001, toNumber(state.roas));
      const revenue = price + shipCharged;
      adCost = revenue / roas;
    } else {
      adCost = Math.max(0, toNumber(state.cpa));
    }

    return {
      price,
      cogs,
      shipCost,
      shipCharged,
      packaging,
      payFeePct,
      payFeeFixed,
      platformFeePct,
      returnsPct,
      adCost,
    };
  }, [state]);

  const simInputs = useMemo(() => {
    const adUp = state.adUpPct / 100;
    const discount = state.discountPct / 100;
    const returnsUp = state.returnsUp / 100;

    const priceAfterDiscount = baseInputs.price * (1 - discount);
    const adCost = baseInputs.adCost * (1 + adUp);
    const returnsPct = Math.min(0.99, baseInputs.returnsPct + returnsUp);

    return { ...baseInputs, price: priceAfterDiscount, adCost, returnsPct };
  }, [baseInputs, state.adUpPct, state.discountPct, state.returnsUp]);

  const out = useMemo(() => compute(simInputs), [simInputs]);

  const profit = out?.profit ?? 0;
  const margin = out?.margin ?? 0;
  const breakEvenCPA = out?.breakEvenCPA ?? 0;
  const breakEvenROAS = out?.breakEvenROAS ?? 0;

  const status = useMemo(() => {
    if (profit < 0) return "loss";
    if (profit >= 0 && profit < 1) return "ok";
    return "profit";
  }, [profit]);

  const statusLabel =
    status === "loss" ? t.statusLoss : status === "ok" ? t.statusOk : t.statusProfit;

  const insightText =
    status === "profit" ? t.insightGood : status === "ok" ? t.insightOk : t.insightBad;

  const money = (n) => normalizeMoneyStringForLang(fmtMoney(n, currencySymbol), lang);

  function setField(key, val) {
    setState((prev) => ({ ...prev, [key]: val }));
  }

  function resetSimulation() {
    setState((prev) => ({ ...prev, adUpPct: 0, discountPct: 0, returnsUp: 0 }));
  }

  const requiredKeys = [
    "price",
    "productCost",
    "shippingCost",
    "shippingCharged",
    "packaging",
    "payFeePct",
    "payFeeFixed",
    "platformFeePct",
    "returnsPct",
    state.adsMode === "roas" ? "roas" : "cpa",
  ];

  const invalid = useMemo(() => {
    const map = {};
    for (const k of requiredKeys) map[k] = !isNumLike(state[k]);
    return map;
  }, [state, requiredKeys]);

  async function exportPdf() {
    try {
      setPdfBusy(true);

      const inputsForPdf =
        lang === "it"
          ? [
              { label: "Prezzo di vendita", value: money(baseInputs.price) },
              { label: "Costo prodotto per ordine", value: money(baseInputs.cogs) },
              { label: "Spedizione (costo tuo)", value: money(baseInputs.shipCost) },
              { label: "Spedizione pagata dal cliente", value: money(baseInputs.shipCharged) },
              { label: "Packaging", value: money(baseInputs.packaging) },
              { label: "Commissione pagamento (%)", value: `${(baseInputs.payFeePct * 100).toFixed(2)}%` },
              { label: "Commissione pagamento fissa", value: money(baseInputs.payFeeFixed) },
              { label: "Commissione piattaforma (%)", value: `${(baseInputs.platformFeePct * 100).toFixed(2)}%` },
              { label: "Resi (%)", value: `${(baseInputs.returnsPct * 100).toFixed(2)}%` },
              {
                label: "Pubblicità (modalità)",
                value: state.adsMode === "roas" ? "Rendimento" : "Costo per ordine",
              },
              {
                label: state.adsMode === "roas" ? "Rendimento ads (x)" : "Costo ads per ordine",
                value: state.adsMode === "roas" ? `${toNumber(state.roas).toFixed(2)}x` : money(toNumber(state.cpa)),
              },
              { label: "Simulazione: ads più care", value: `${state.adUpPct}%` },
              { label: "Simulazione: sconto", value: `${state.discountPct}%` },
              { label: "Simulazione: resi in aumento", value: `${state.returnsUp}%` },
            ]
          : [
              { label: "Selling price", value: money(baseInputs.price) },
              { label: "Product cost per order", value: money(baseInputs.cogs) },
              { label: "Shipping (your cost)", value: money(baseInputs.shipCost) },
              { label: "Shipping charged to customer", value: money(baseInputs.shipCharged) },
              { label: "Packaging", value: money(baseInputs.packaging) },
              { label: "Payment fee (%)", value: `${(baseInputs.payFeePct * 100).toFixed(2)}%` },
              { label: "Payment fixed fee", value: money(baseInputs.payFeeFixed) },
              { label: "Platform fee (%)", value: `${(baseInputs.platformFeePct * 100).toFixed(2)}%` },
              { label: "Returns (%)", value: `${(baseInputs.returnsPct * 100).toFixed(2)}%` },
              {
                label: "Advertising mode",
                value: state.adsMode === "roas" ? "Return" : "Cost per order",
              },
              {
                label: state.adsMode === "roas" ? "Ad return (x)" : "Ad cost per order",
                value: state.adsMode === "roas" ? `${toNumber(state.roas).toFixed(2)}x` : money(toNumber(state.cpa)),
              },
              { label: "Simulation: higher ad costs", value: `${state.adUpPct}%` },
              { label: "Simulation: discount", value: `${state.discountPct}%` },
              { label: "Simulation: more returns", value: `${state.returnsUp}%` },
            ];

      const payload = {
        lang,
        currencySymbol,
        inputs: inputsForPdf,
        outputs: {
          profit,
          margin,
          breakEvenCPA,
          breakEvenROAS,
        },
        meta: {
          status: statusLabel,
          insight: insightText,
        },
      };

      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("pdf");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "real-ecommerce-profit-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (e) {
      alert(t.exportErr);
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <div className="grid2">
      {/* LEFT */}
      <div className="card">
        <div className="cardTitle">{t.input}</div>

        <div className="fieldGrid" style={{ marginTop: 12 }}>
          <Field label={t.sellPrice} help={t.sellPriceHelp} placeholder={t.sellPricePh}
            value={state.price} invalid={invalid.price} invalidText={t.requiredHint}
            onChange={(v) => setField("price", v)} />
          <Field label={t.productCost} help={t.productCostHelp} placeholder={t.productCostPh}
            value={state.productCost} invalid={invalid.productCost} invalidText={t.requiredHint}
            onChange={(v) => setField("productCost", v)} />

          <Field label={t.shippingYou} help={t.shippingYouHelp} placeholder={t.shippingYouPh}
            value={state.shippingCost} invalid={invalid.shippingCost} invalidText={t.requiredHint}
            onChange={(v) => setField("shippingCost", v)} />
          <Field label={t.packaging} help={t.packagingHelp} placeholder={t.packagingPh}
            value={state.packaging} invalid={invalid.packaging} invalidText={t.requiredHint}
            onChange={(v) => setField("packaging", v)} />

          <Field label={t.shippingCustomer} help={t.shippingCustomerHelp} placeholder={t.shippingCustomerPh}
            value={state.shippingCharged} invalid={invalid.shippingCharged} invalidText={t.requiredHint}
            onChange={(v) => setField("shippingCharged", v)} />
          <Field label={t.payFeesPct} help={t.payFeesPctHelp} placeholder={t.payFeesPctPh}
            value={state.payFeePct} invalid={invalid.payFeePct} invalidText={t.requiredHint}
            onChange={(v) => setField("payFeePct", v)} />

          <Field label={t.payFeesFixed} help={t.payFeesFixedHelp} placeholder={t.payFeesFixedPh}
            value={state.payFeeFixed} invalid={invalid.payFeeFixed} invalidText={t.requiredHint}
            onChange={(v) => setField("payFeeFixed", v)} />
          <Field label={t.platformFeePct} help={t.platformFeePctHelp} placeholder={t.platformFeePctPh}
            value={state.platformFeePct} invalid={invalid.platformFeePct} invalidText={t.requiredHint}
            onChange={(v) => setField("platformFeePct", v)} />

          <Field label={t.returnsPct} help={t.returnsPctHelp} placeholder={t.returnsPctPh}
            value={state.returnsPct} invalid={invalid.returnsPct} invalidText={t.requiredHint}
            onChange={(v) => setField("returnsPct", v)} />
        </div>

        <div className="divider" />

        <div className="cardTitle" style={{ marginTop: 4 }}>
          {t.adsTitle}
        </div>
        <div className="muted" style={{ marginTop: 6 }}>
          {t.adsModeLabel}
        </div>

        <div className="segmented" style={{ marginTop: 10 }}>
          <button className={`segBtn ${state.adsMode === "roas" ? "segOn" : ""}`}
            onClick={() => setField("adsMode", "roas")} type="button">
            {t.adsModeROAS}
          </button>
          <button className={`segBtn ${state.adsMode === "cpa" ? "segOn" : ""}`}
            onClick={() => setField("adsMode", "cpa")} type="button">
            {t.adsModeCPA}
          </button>
        </div>

        {state.adsMode === "roas" ? (
          <Field label={t.roasLabel} help={t.roasHelp} placeholder={t.roasPh}
            value={state.roas} invalid={invalid.roas} invalidText={t.requiredHint}
            onChange={(v) => setField("roas", v)} />
        ) : (
          <Field label={t.cpaLabel} help={t.cpaHelp} placeholder={t.cpaPh}
            value={state.cpa} invalid={invalid.cpa} invalidText={t.requiredHint}
            onChange={(v) => setField("cpa", v)} />
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="btn" onClick={resetSimulation} type="button">
            {t.resetSim}
          </button>

          {!isPro && (
            <button className="btn btnPrimary" onClick={() => setWantsPro(true)} type="button">
              {t.unlock}
            </button>
          )}
        </div>

        <div className="note" style={{ marginTop: 10 }}>
          {t.disclaimer}
        </div>
      </div>

      {/* RIGHT */}
      <div className="card">
        <div className="cardTopRow">
          <div className="cardTitle">{t.results}</div>
          <div className={`pillTag ${status}`}>
            <span className="dot" />
            {statusLabel}
          </div>
        </div>

        <div className="kpiGrid">
          <Kpi title={t.kpiProfit} value={money(profit)} />
          <Kpi title={t.kpiMargin} value={fmtPct(margin)} />
          <Kpi title={t.kpiBreakEvenAds} value={money(breakEvenCPA)} />
          <Kpi title={t.kpiBreakEvenROAS} value={`${Number(breakEvenROAS || 0).toFixed(2)}x`} />
        </div>

        <div className="divider" />

        <div className="cardTitle">{t.insightTitle}</div>
        <div className="insightBox">{insightText}</div>

        <div className="divider" />

        <div className="cardTitle">{t.simulation}</div>
        <div className="muted" style={{ marginTop: 6 }}>
          {t.simHint}
        </div>

        <SliderRow label={t.simAdsUp} value={state.adUpPct} onChange={(v) => setField("adUpPct", v)} suffix="%" />
        <SliderRow label={t.simDiscount} value={state.discountPct} onChange={(v) => setField("discountPct", v)} suffix="%" />
        <SliderRow label={t.simReturnsUp} value={state.returnsUp} onChange={(v) => setField("returnsUp", v)} suffix="%" />

        <div className="divider" />

        {/* PRO: PDF export */}
        {isPro ? (
          <div>
            <div className="muted" style={{ marginBottom: 10 }}>{t.exportHint}</div>
            <button className="btn btnPrimary" onClick={exportPdf} disabled={pdfBusy}>
              {pdfBusy ? t.exporting : t.exportPdf}
            </button>
          </div>
        ) : (
          <div className="muted">{t.lockedNote}</div>
        )}
      </div>
    </div>
  );
}

/* ---------------- UI bits ---------------- */

function Field({ label, help, placeholder, value, onChange, invalid, invalidText }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`field ${invalid ? "fieldInvalid" : ""}`}>
      <div className="fieldLabel">{label}</div>

      {help && focused ? <div className="fieldHelp">{help}</div> : null}

      <input
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {invalid && focused ? <div className="fieldError">{invalidText}</div> : null}
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="kpi">
      <div className="kpiTitle">{title}</div>
      <div className="kpiValue">{value}</div>
    </div>
  );
}

function SliderRow({ label, value, onChange, suffix }) {
  return (
    <div className="sliderRow">
      <div className="sliderTop">
        <div className="sliderLabel">{label}</div>
        <div className="sliderVal">
          {value}
          {suffix}
        </div>
      </div>
      <input
        className="slider"
        type="range"
        min="0"
        max="50"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
