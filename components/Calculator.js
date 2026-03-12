"use client";

import { useEffect, useMemo, useState } from "react";
import { compute } from "@/lib/calc";

const LS_KEY = "pro_unlocked";

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
  // format: 1,234.56 in EN / 1.234,56 in IT handled by locale outside if needed
  // We keep simple formatting + replace later if IT.
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
  // Convert "$1,234.56" -> "€1.234,56" style later; symbol set elsewhere.
  if (lang !== "it") return str;
  // swap thousand/decimal separators (simple approach)
  // 1,234.56 => 1.234,56
  return str.replace(/(\d),(?=\d{3}\b)/g, "$1.").replace(/\.(\d{2})\b/g, ",$1");
}

function defaultState(lang) {
  // Defaults shown as strings (user-friendly)
  // IT uses comma; EN uses dot
  const dot = lang === "it" ? "," : ".";
  return {
    price: `49${dot}00`,
    cogs: `18${dot}00`,
    shipCost: `6${dot}50`,
    shipCharged: `4${dot}90`,
    packaging: `0${dot}80`,
    payFeePct: `2${dot}9`,
    payFeeFixed: `0${dot}30`,
    platformFeePct: `0${dot}0`,
    returnsPct: `8`,
    adsMode: "roas", // "roas" | "cpa"
    roas: `2${dot}5`,
    cpa: `20${dot}00`,
    // Pro sims
    adUpPct: 0,
    discountPct: 0,
    returnsUp: 0,
  };
}

export default function Calculator({ lang, isPro, setWantsPro }) {
  const t = useMemo(() => {
    const it = {
      input: "Input",
      results: "Risultati",
      simulation: "Simulazione",
      lockedNote: "Disponibile in Pro: confronto scenari + export PDF senza watermark.",
      unlock: "Sblocca Pro",
      resetSim: "Reset simulazione",
      // Friendly labels (no acronyms)
      sellPrice: "Prezzo di vendita",
      sellPriceHelp: "Prezzo pagato dal cliente (IVA inclusa se la usi così).",
      productCost: "Costo prodotto per ordine",
      productCostHelp: "Costo merce (quanto ti costa produrre/acquistare l’ordine).",
      shippingYou: "Spedizione (costo tuo)",
      shippingYouHelp: "Quanto paghi tu al corriere per spedire.",
      shippingCustomer: "Spedizione pagata dal cliente",
      shippingCustomerHelp: "Quanto incassi dal cliente per la spedizione (0 se gratuita).",
      packaging: "Packaging",
      packagingHelp: "Scatola, materiale imballo, etichette.",
      payFeesPct: "Commissione pagamento (%)",
      payFeesPctHelp: "Es. Stripe/PayPal percentuale.",
      payFeesFixed: "Commissione pagamento fissa",
      payFeesFixedHelp: "Es. 0,30€ per transazione.",
      platformFeePct: "Commissione piattaforma (%)",
      platformFeePctHelp: "Es. fee marketplace o app/checkout (se applicabile).",
      returnsPct: "Resi (%)",
      returnsPctHelp: "Quota ordini che rimborsi (in media).",

      adsTitle: "Pubblicità",
      adsModeLabel: "Come misuri la pubblicità?",
      adsModeROAS: "Rendimento (ricavi / spesa)",
      adsModeCPA: "Costo per acquisto",
      roasLabel: "Rendimento pubblicità (x)",
      roasHelp: "Esempio: 2,5 significa 2,5€ di ricavi per 1€ speso.",
      cpaLabel: "Costo pubblicità per ordine",
      cpaHelp: "Quanto ti costa ottenere un ordine (in media).",

      kpiProfit: "Profitto netto / ordine",
      kpiMargin: "Margine netto",
      kpiBreakEvenAds: "Ads a pareggio per ordine",
      kpiBreakEvenROAS: "Rendimento ads di pareggio",

      insightTitle: "Interpretazione",
      // Insight buckets (user-friendly)
      insightGood:
        "Ottimo: hai margine. Puoi reinvestire in ads o sconti senza andare in perdita.",
      insightOk:
        "Sei in equilibrio: piccoli cambiamenti (ads, resi, sconti) possono spostare il profitto.",
      insightBad:
        "Sei in perdita: prima di scalare, rivedi prezzo, costi, resi o spesa ads.",

      statusLoss: "In perdita",
      statusOk: "In equilibrio",
      statusProfit: "Profittevole",

      simAdsUp: "Ads più care",
      simDiscount: "Sconto",
      simReturnsUp: "Resi in aumento",
      simHint:
        "Muovi i cursori per vedere l’impatto sui risultati. In Pro puoi confrontare scenari A vs B.",

      disclaimer: "Nota: stime operative. Non è consulenza fiscale/finanziaria.",

      currencySymbol: "€",
    };

    const en = {
      input: "Inputs",
      results: "Results",
      simulation: "Simulation",
      lockedNote: "Available in Pro: scenario comparison + clean PDF export (no watermark).",
      unlock: "Unlock Pro",
      resetSim: "Reset simulation",

      sellPrice: "Selling price",
      sellPriceHelp: "What the customer pays (include taxes if that’s how you track it).",
      productCost: "Product cost per order",
      productCostHelp: "Your product cost (COGS) per order.",
      shippingYou: "Shipping (your cost)",
      shippingYouHelp: "What you pay the carrier.",
      shippingCustomer: "Shipping charged to customer",
      shippingCustomerHelp: "What you collect from the customer (0 if free shipping).",
      packaging: "Packaging",
      packagingHelp: "Box, labels, materials.",
      payFeesPct: "Payment fee (%)",
      payFeesPctHelp: "e.g., Stripe/PayPal percentage fee.",
      payFeesFixed: "Payment fixed fee",
      payFeesFixedHelp: "e.g., $0.30 per transaction.",
      platformFeePct: "Platform fee (%)",
      platformFeePctHelp: "Marketplace/app/platform fee if applicable.",
      returnsPct: "Returns (%)",
      returnsPctHelp: "Average share of orders refunded.",

      adsTitle: "Advertising",
      adsModeLabel: "How do you track ads?",
      adsModeROAS: "Return (revenue / spend)",
      adsModeCPA: "Cost per purchase",
      roasLabel: "Ad return (x)",
      roasHelp: "Example: 2.5 means $2.5 revenue per $1 spent.",
      cpaLabel: "Ad cost per order",
      cpaHelp: "Average cost to get one order.",

      kpiProfit: "Net profit / order",
      kpiMargin: "Net margin",
      kpiBreakEvenAds: "Break-even ad spend / order",
      kpiBreakEvenROAS: "Break-even ad return",

      insightTitle: "Insight",
      insightGood:
        "Great: you have margin. You can reinvest in ads or discounts without going negative.",
      insightOk:
        "Tight: small changes (ads, returns, discounts) can flip profitability.",
      insightBad:
        "You’re losing money: before scaling, revisit price, costs, returns, or ad spend.",

      statusLoss: "Losing money",
      statusOk: "Tight",
      statusProfit: "Profitable",

      simAdsUp: "Higher ad costs",
      simDiscount: "Discount",
      simReturnsUp: "More returns",
      simHint:
        "Move sliders to see the impact. In Pro you can compare Scenario A vs B.",

      disclaimer: "Disclaimer: estimates only. Not financial/tax advice.",
      currencySymbol: "$",
    };

    return lang === "it" ? it : en;
  }, [lang]);

  const [state, setState] = useState(() => defaultState(lang));

  // If language changes, update defaults only if user hasn't edited fields yet
  useEffect(() => {
    setState((prev) => {
      // naive: keep user values, only adjust formatting for decimals in the two main fields if empty
      // We'll keep it simple and not overwrite user.
      return prev;
    });
  }, [lang]);

  const currencySymbol = t.currencySymbol;

  // Build inputs for compute()
  const baseInputs = useMemo(() => {
    const price = toNumber(state.price);
    const cogs = toNumber(state.cogs);
    const shipCost = toNumber(state.shipCost);
    const shipCharged = toNumber(state.shipCharged);
    const packaging = toNumber(state.packaging);
    const payFeePct = toNumber(state.payFeePct) / 100;
    const payFeeFixed = toNumber(state.payFeeFixed);
    const platformFeePct = toNumber(state.platformFeePct) / 100;
    const returnsPct = toNumber(state.returnsPct) / 100;

    // Ads
    let adCost = 0;
    if (state.adsMode === "roas") {
      const roas = Math.max(0.0001, toNumber(state.roas));
      // adCost = revenue/roas; revenue here is selling price + shipping charged
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

  // Apply simulations (adUpPct, discountPct, returnsUp)
  const simInputs = useMemo(() => {
    const adUp = state.adUpPct / 100;
    const discount = state.discountPct / 100;
    const returnsUp = state.returnsUp / 100;

    const priceAfterDiscount = baseInputs.price * (1 - discount);
    const shipCharged = baseInputs.shipCharged; // keep same
    const adCost = baseInputs.adCost * (1 + adUp);
    const returnsPct = Math.min(0.99, baseInputs.returnsPct + returnsUp);

    return {
      ...baseInputs,
      price: priceAfterDiscount,
      shipCharged,
      adCost,
      returnsPct,
    };
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

  function setField(key, val) {
    setState((prev) => ({ ...prev, [key]: val }));
  }

  function resetSimulation() {
    setState((prev) => ({ ...prev, adUpPct: 0, discountPct: 0, returnsUp: 0 }));
  }

  const money = (n) => normalizeMoneyStringForLang(fmtMoney(n, currencySymbol), lang);

  return (
    <div className="grid2">
      {/* LEFT: INPUT */}
      <div className="card">
        <div className="cardTitle">{t.input}</div>

        <div className="fieldGrid">
          <Field
            label={t.sellPrice}
            help={t.sellPriceHelp}
            value={state.price}
            onChange={(v) => setField("price", v)}
          />
          <Field
            label={t.productCost}
            help={t.productCostHelp}
            value={state.cogs}
            onChange={(v) => setField("cogs", v)}
          />

          <Field
            label={t.shippingYou}
            help={t.shippingYouHelp}
            value={state.shipCost}
            onChange={(v) => setField("shipCost", v)}
          />
          <Field
            label={t.packaging}
            help={t.packagingHelp}
            value={state.packaging}
            onChange={(v) => setField("packaging", v)}
          />

          <Field
            label={t.shippingCustomer}
            help={t.shippingCustomerHelp}
            value={state.shipCharged}
            onChange={(v) => setField("shipCharged", v)}
          />
          <Field
            label={t.payFeesPct}
            help={t.payFeesPctHelp}
            value={state.payFeePct}
            onChange={(v) => setField("payFeePct", v)}
          />

          <Field
            label={t.payFeesFixed}
            help={t.payFeesFixedHelp}
            value={state.payFeeFixed}
            onChange={(v) => setField("payFeeFixed", v)}
          />
          <Field
            label={t.platformFeePct}
            help={t.platformFeePctHelp}
            value={state.platformFeePct}
            onChange={(v) => setField("platformFeePct", v)}
          />

          <Field
            label={t.returnsPct}
            help={t.returnsPctHelp}
            value={state.returnsPct}
            onChange={(v) => setField("returnsPct", v)}
          />
        </div>

        <div className="divider" />

        <div className="cardTitle" style={{ marginTop: 4 }}>
          {t.adsTitle}
        </div>
        <div className="muted" style={{ marginTop: 6 }}>
          {t.adsModeLabel}
        </div>

        <div className="segmented" style={{ marginTop: 10 }}>
          <button
            className={`segBtn ${state.adsMode === "roas" ? "segOn" : ""}`}
            onClick={() => setField("adsMode", "roas")}
            type="button"
          >
            {t.adsModeROAS}
          </button>
          <button
            className={`segBtn ${state.adsMode === "cpa" ? "segOn" : ""}`}
            onClick={() => setField("adsMode", "cpa")}
            type="button"
          >
            {t.adsModeCPA}
          </button>
        </div>

        {state.adsMode === "roas" ? (
          <Field
            label={t.roasLabel}
            help={t.roasHelp}
            value={state.roas}
            onChange={(v) => setField("roas", v)}
          />
        ) : (
          <Field
            label={t.cpaLabel}
            help={t.cpaHelp}
            value={state.cpa}
            onChange={(v) => setField("cpa", v)}
          />
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

      {/* RIGHT: RESULTS */}
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
          <Kpi title={t.kpiBreakEvenROAS} value={`${breakEvenROAS.toFixed(2)}x`} />
        </div>

        <div className="divider" />

        <div className="cardTitle">{t.insightTitle}</div>
        <div className="insightBox">{insightText}</div>

        <div className="divider" />

        <div className="cardTitle">{t.simulation}</div>
        <div className="muted" style={{ marginTop: 6 }}>
          {t.simHint}
        </div>

        <SliderRow
          label={t.simAdsUp}
          value={state.adUpPct}
          onChange={(v) => setField("adUpPct", v)}
          suffix="%"
        />
        <SliderRow
          label={t.simDiscount}
          value={state.discountPct}
          onChange={(v) => setField("discountPct", v)}
          suffix="%"
        />
        <SliderRow
          label={t.simReturnsUp}
          value={state.returnsUp}
          onChange={(v) => setField("returnsUp", v)}
          suffix="%"
        />

        {!isPro && <div className="muted" style={{ marginTop: 10 }}>{t.lockedNote}</div>}
      </div>
    </div>
  );
}

/* ---------- UI bits ---------- */

function Field({ label, help, value, onChange }) {
  return (
    <div className="field">
      <div className="fieldLabelRow">
        <div className="fieldLabel">{label}</div>
      </div>
      {help ? <div className="fieldHelp">{help}</div> : null}
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
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
