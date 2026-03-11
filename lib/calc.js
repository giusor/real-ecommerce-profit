export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function parseNum(v) {
  if (typeof v !== "string") return Number(v || 0);
  const cleaned = v.replace(",", ".").replace(/[^0-9.\-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(n, currencySymbol) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}${currencySymbol}${abs.toFixed(2)}`;
}

export function formatPct(n) {
  return `${(n * 100).toFixed(1)}%`;
}

export function compute(inputs) {
  const {
    price,
    cogs,
    shipCost,
    packCost,
    shipCharged,
    payFeePct,
    payFeeFixed,
    platformFeePct,
    adMode, // "cpa" | "roas"
    cpa,
    roas,
    returnRate
  } = inputs;

  const revenue = price + shipCharged;

  const paymentFee = revenue * payFeePct + payFeeFixed;
  const platformFee = revenue * platformFeePct;

  const adCost = adMode === "cpa"
    ? cpa
    : (roas > 0 ? (revenue / roas) : Infinity);

  // Simple expected return loss model
  const returnLoss = returnRate * (cogs + shipCost + paymentFee);

  const totalCosts = cogs + shipCost + packCost + paymentFee + platformFee + returnLoss + adCost;
  const profit = revenue - totalCosts;
  const margin = revenue > 0 ? (profit / revenue) : 0;

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

export function insight({ profit, margin, breakEvenROAS, returnLoss, breakEvenCPA }, currencySymbol) {
  if (profit < 0) {
    return `You’re losing about ${formatMoney(Math.abs(profit), currencySymbol)} per order. Reduce ad cost, shipping, or COGS.`;
  }
  if (breakEvenCPA <= 0) {
    return `Even with $0 ad spend, this order isn’t profitable. Increase price or reduce costs.`;
  }
  if (breakEvenROAS > 3.0) {
    return `Your unit economics require a high break-even ROAS. Consider raising price or lowering costs.`;
  }
  if (returnLoss > 5) {
    return `Returns are a meaningful drag. Reducing return rate can materially increase profit.`;
  }
  if (margin >= 0.20) {
    return `Good buffer. You can scale ads up to your break-even CPA before losing money.`;
  }
  return `Your margin is tight. Small changes in ads, returns or discounting can flip profitability.`;
}
