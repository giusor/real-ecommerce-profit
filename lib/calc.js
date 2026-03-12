// lib/calc.js

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function parseNum(v) {
  if (typeof v !== "string") return Number(v || 0);
  const cleaned = v.replace(",", ".").replace(/[^0-9.\-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(n, currencySymbol = "€") {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  // ensure numeric rounding like before
  return `${sign}${currencySymbol}${abs.toFixed(2)}`;
}

export function formatPct(n) {
  return `${(n * 100).toFixed(1)}%`;
}

/**
 * compute(inputs)
 * inputs = {
 *  price, cogs, shipCost, packCost, shipCharged,
 *  payFeePct, payFeeFixed, platformFeePct,
 *  adMode ("cpa" | "roas"), cpa, roas, returnRate
 * }
 */
export function compute(inputs) {
  const {
    price = 0,
    cogs = 0,
    shipCost = 0,
    packCost = 0,
    shipCharged = 0,
    payFeePct = 0,
    payFeeFixed = 0,
    platformFeePct = 0,
    adMode = "cpa", // "cpa" | "roas"
    cpa = 0,
    roas = 0,
    returnRate = 0
  } = inputs;

  const revenue = price + shipCharged;

  const paymentFee = revenue * payFeePct + payFeeFixed;
  const platformFee = revenue * platformFeePct;

  const adCost = adMode === "cpa"
    ? cpa
    : (roas > 0 ? (revenue / roas) : Infinity);

  // Simple expected return loss model (monetary loss from returns)
  const returnLoss = returnRate * (cogs + shipCost + paymentFee);

  const totalCosts = cogs + shipCost + packCost + paymentFee + platformFee + returnLoss + adCost;
  const profit = revenue - totalCosts;
  const margin = revenue > 0 ? (profit / revenue) : 0;

  // breakEvenCPA is the amount of ad cost you can spend before profit = 0
  const breakEvenCPA = revenue - (cogs + shipCost + packCost + paymentFee + platformFee + returnLoss);
  const breakEvenROAS = breakEvenCPA > 0 ? (revenue / breakEvenCPA) : Infinity;

  // Health badge
  let health = "healthy";
  if (profit < 0 || margin < 0.10) health = "losing";
  else if (margin < 0.20) health = "tight";

  return {
    revenue,
    paymentFee,
    platformFee,
    adCost,
    returnLoss,
    profit,
    margin,
    breakEvenCPA: Math.max(0, breakEvenCPA),
    breakEvenROAS,
    health
  };
}

/**
 * insight(out, currencySymbol, lang = "en")
 * - out: object returned from compute()
 * - currencySymbol: e.g. "€" or "$"
 * - lang: "en" or "it"
 *
 * returns localized insight string
 */
export function insight(
  { profit = 0, margin = 0, breakEvenROAS = Infinity, returnLoss = 0, breakEvenCPA = 0 } = {},
  currencySymbol = "€",
  lang = "en"
) {
  // small helper to format money consistently
  const fm = (n) => formatMoney(n, currencySymbol);

  const t = {
    en: {
      losing: (p) =>
        `You’re losing about ${fm(Math.abs(p))} per order. Reduce ad cost, shipping, or COGS.`,
      zeroAd: `Even with $0 ad spend, this order isn’t profitable. Increase price or reduce costs.`,
      highRoas: `Your unit economics require a high break-even ROAS. Consider raising price or lowering costs.`,
      returns: `Returns are a meaningful drag. Reducing return rate can materially increase profit.`,
      healthy: `Good buffer. You can scale ads up to your break-even CPA before losing money.`,
      tight: `Your margin is tight. Small changes in ads, returns or discounting can flip profitability.`,
    },
    it: {
      losing: (p) =>
        `Stai perdendo circa ${fm(Math.abs(p))} per ordine. Riduci costo ads, spedizione o COGS.`,
      zeroAd: `Anche con ads a 0€, questo ordine non è profittevole. Aumenta il prezzo o riduci i costi.`,
      highRoas: `Le tue unit economics richiedono un ROAS di pareggio elevato. Valuta di aumentare il prezzo o ridurre i costi.`,
      returns: `I resi impattano significativamente sulla marginalità. Ridurre il tasso di reso può aumentare concretamente il profitto.`,
      healthy: `Buon margine di sicurezza. Puoi aumentare le spese pubblicitarie fino al CPA di pareggio.`,
      tight: `Margine molto stretto. Piccole variazioni su ads, resi o sconti possono portare in perdita.`,
    },
  };

  const copy = t[lang] || t.en;

  // decision logic (kept simple and deterministic)
  if (profit < 0) {
    return copy.losing(profit);
  }

  if (breakEvenCPA <= 0) {
    return copy.zeroAd;
  }

  if (breakEvenROAS > 3.0) {
    return copy.highRoas;
  }

  if (returnLoss > 5) {
    return copy.returns;
  }

  if (margin >= 0.20) {
    return copy.healthy;
  }

  return copy.tight;
}
