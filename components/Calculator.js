"use client";

import { useEffect, useMemo, useState } from "react";
import { clamp, compute, formatMoney, formatPct, insight, parseNum } from "@/lib/calc";

function defaultState(lang) {
  const isIT = lang === "it";
  return {
    price: isIT ? "49,00" : "49.00",
    cogs: isIT ? "18,00" : "18.00",
    shipCost: isIT ? "6,50" : "6.50",
    packCost: isIT ? "0,80" : "0.80",
    shipCharged: isIT ? "4,90" : "4.90",
    payFeePct: isIT ? "2,9" : "2.9",
    payFeeFixed: isIT ? "0,30" : "0.30",
    platformFeePct: "0.0",
    adMode: "cpa",
    cpa: isIT ? "12,00" : "12.00",
    roas: isIT ? "2,5" : "2.5",
    returnRate: "8"
  };
}

export default function Calculator({ lang, isPro, setWantsPro }) {
  const currencySymbol = lang === "it" ? "€" : "$";

  const [s, setS] = useState(() => defaultState(lang));

  // Simulation sliders (applied on top)
  const [adUpPct, setAdUpPct] = useState(0);        // 0..30
  const [discountPct, setDiscountPct] = useState(0); // 0..30
  const [returnsUp, setReturnsUp] = useState(0);     // 0..10 (pp)

  useEffect(() => {
    setS(defaultState(lang));
    setAdUpPct(0); setDiscountPct(0); setReturnsUp(0);
  }, [lang]);

  const inputs = useMemo(() => {
    const base = {
      price: parseNum(s.price),
      cogs: parseNum(s.cogs),
      shipCost: parseNum(s.shipCost),
      packCost: parseNum(s.packCost),
      shipCharged: parseNum(s.shipCharged),
      payFeePct: parseNum(s.payFeePct) / 100,
      payFeeFixed: parseNum(s.payFeeFixed),
      platformFeePct: parseNum(s.platformFeePct) / 100,
      adMode: s.adMode,
      cpa: parseNum(s.cpa),
      roas: parseNum(s.roas),
      returnRate: clamp(parseNum(s.returnRate) / 100, 0, 1)
    };

    // Apply simulation
    const priceAfterDiscount = base.price * (1 - discountPct / 100);
    const returnRateAfter = clamp(base.returnRate + (returnsUp / 100), 0, 1);

    let cpaAfter = base.cpa;
    let roasAfter = base.roas;

    if (base.adMode === "cpa") {
      cpaAfter = base.cpa * (1 + adUpPct / 100);
    } else {
      // If ad cost increases, ROAS decreases (roughly inverse)
      roasAfter = base.roas > 0 ? base.roas / (1 + adUpPct / 100) : 0;
    }

    return {
      ...base,
      price: priceAfterDiscount,
      cpa: cpaAfter,
      roas: roasAfter,
      returnRate: returnRateAfter
    };
  }, [s, discountPct, returnsUp, adUpPct]);

  const out = useMemo(() => compute(inputs), [inputs]);
  const insightText = useMemo(() => insight(out, currencySymbol), [out, currencySymbol]);

  const badge = (() => {
    if (out.health === "healthy") return { text: lang === "it" ? "Solido" : "Healthy", color: "var(--green)" };
    if (out.health === "tight") return { text: lang === "it" ? "Tirato" : "Tight", color: "var(--yellow)" };
    return { text: lang === "it" ? "In perdita" : "Losing money", color: "var(--red)" };
  })();

  return (
    <div className="row">
      <div className="card">
        <h3 style={{ marginTop: 0 }}>{lang === "it" ? "Input" : "Inputs"}</h3>

        <div className="grid2">
          <Field label={lang === "it" ? "Prezzo di vendita" : "Selling price"} value={s.price}
            onChange={(v) => setS({ ...s, price: v })} />
          <Field label="COGS" value={s.cogs} onChange={(v) => setS({ ...s, cogs: v })} help={lang === "it" ? "Costo prodotto per ordine" : "Product cost per order"} />

          <Field label={lang === "it" ? "Costo spedizione (tuo)" : "Shipping cost (your cost)"} value={s.shipCost}
            onChange={(v) => setS({ ...s, shipCost: v })} />
          <Field label={lang === "it" ? "Costo packaging" : "Packaging cost"} value={s.packCost}
            onChange={(v) => setS({ ...s, packCost: v })} />

          <Field label={lang === "it" ? "Spedizione al cliente" : "Shipping charged to customer"} value={s.shipCharged}
            onChange={(v) => setS({ ...s, shipCharged: v })} help={lang === "it" ? "0 se spedizione gratuita" : "0 for free shipping"} />

          <Field label={lang === "it" ? "Fee pagamento %" : "Payment fee %"} value={s.payFeePct}
            onChange={(v) => setS({ ...s, payFeePct: v })} />

          <Field label={lang === "it" ? "Fee fissa pagamento" : "Payment fee fixed"} value={s.payFeeFixed}
            onChange={(v) => setS({ ...s, payFeeFixed: v })} help={lang === "it" ? "es. 0,30 per transazione" : "e.g. $0.30 per transaction"} />

          <Field label={lang === "it" ? "Fee piattaforma %" : "Platform / app fees %"} value={s.platformFeePct}
            onChange={(v) => setS({ ...s, platformFeePct: v })} />

          <Field label={lang === "it" ? "Resi %" : "Return rate %"} value={s.returnRate}
            onChange={(v) => setS({ ...s, returnRate: v })} />
        </div>

        <div className="hr" />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="label">{lang === "it" ? "Ads mode" : "Ads mode"}</div>
            <div className="toggle">
              <div className={`pill ${s.adMode === "cpa" ? "pillOn" : ""}`} onClick={() => setS({ ...s, adMode: "cpa" })}>CPA</div>
              <div className={`pill ${s.adMode === "roas" ? "pillOn" : ""}`} onClick={() => setS({ ...s, adMode: "roas" })}>ROAS</div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {s.adMode === "cpa" ? (
              <Field label={lang === "it" ? "CPA (costo per acquisto)" : "CPA (cost per purchase)"} value={s.cpa}
                onChange={(v) => setS({ ...s, cpa: v })} />
            ) : (
              <Field label={lang === "it" ? "ROAS (x)" : "ROAS (x)"} value={s.roas}
                onChange={(v) => setS({ ...s, roas: v })} />
            )}
          </div>
        </div>

        <div className="hr" />

        <div className="btnRow">
          <button className="btn" onClick={() => { setAdUpPct(0); setDiscountPct(0); setReturnsUp(0); }}>
            {lang === "it" ? "Reset simulazione" : "Reset simulation"}
          </button>
          {!isPro && (
            <button className="btn btnPrimary" onClick={() => setWantsPro(true)}>
              {lang === "it" ? "Sblocca Pro" : "Unlock Pro"}
            </button>
          )}
        </div>

        <div className="small">
          {lang === "it"
            ? "Nota: stime operative, non consulenza fiscale/finanziaria."
            : "Note: decision estimates, not financial/tax advice."}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h3 style={{ marginTop: 0 }}>{lang === "it" ? "Risultati" : "Results"}</h3>
          <span className="badge">
            <span className="dot" style={{ background: badge.color }} />
            {badge.text}
          </span>
        </div>

        <div className="kpi">
          <div className="box">
            <span>{lang === "it" ? "Profitto netto / ordine" : "Net profit / order"}</span>
            <b style={{ color: out.profit < 0 ? "var(--red)" : "var(--text)" }}>{formatMoney(out.profit, currencySymbol)}</b>
          </div>
          <div className="box">
            <span>{lang === "it" ? "Margine netto %" : "Net margin %"}</span>
            <b>{formatPct(out.margin)}</b>
          </div>
          <div className="box">
            <span>{lang === "it" ? "CPA di pareggio" : "Break-even CPA"}</span>
            <b>{formatMoney(out.breakEvenCPA, currencySymbol)}</b>
          </div>
          <div className="box">
            <span>{lang === "it" ? "ROAS di pareggio" : "Break-even ROAS"}</span>
            <b>{out.breakEvenROAS === Infinity ? "∞" : `${out.breakEvenROAS.toFixed(2)}x`}</b>
          </div>
        </div>

        <div className="hr" />

        <div className="card" style={{ padding: 12, background: "rgba(0,0,0,.18)" }}>
          <div className="label">{lang === "it" ? "Insight" : "Insight"}</div>
          <div>{insightText}</div>
        </div>

        <div className="hr" />

        <h4 style={{ margin: "0 0 10px" }}>{lang === "it" ? "Simulazione" : "Simulation"}</h4>
        <div className="sliderRow">
          <Slider label={lang === "it" ? `Costo ads +${adUpPct}%` : `Ad cost +${adUpPct}%`} value={adUpPct} setValue={setAdUpPct} min={0} max={30} />
          <Slider label={lang === "it" ? `Sconto ${discountPct}%` : `Discount ${discountPct}%`} value={discountPct} setValue={setDiscountPct} min={0} max={30} />
          <Slider label={lang === "it" ? `Resi +${returnsUp}pp` : `Returns +${returnsUp}pp`} value={returnsUp} setValue={setReturnsUp} min={0} max={10} />
        </div>

        {!isPro && (
          <div className="small" style={{ marginTop: 10, opacity: 0.9 }}>
            Watermark in exports. Compare scenarios + PDF export in Pro.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, help }) {
  return (
    <div>
      <div className="label">{label}</div>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
      {help ? <div className="small">{help}</div> : null}
    </div>
  );
}

function Slider({ label, value, setValue, min, max }) {
  return (
    <div>
      <div className="label">{label}</div>
      <input className="range" type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </div>
  );
}
