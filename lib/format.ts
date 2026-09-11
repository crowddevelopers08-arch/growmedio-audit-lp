const IST = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

/** 11 Sept 2026, 4:05 pm — always in India time, whatever the server's zone. */
export const formatIST = (date: Date) => IST.format(date);

/** Razorpay amounts are in paise: 29900 → ₹299. */
export const formatPaise = (paise: number, currency = "INR") => {
  const value = (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  return currency === "INR" ? `₹${value}` : `${currency} ${value}`;
};

/** 2,891 */
export const formatCount = (n: number) => n.toLocaleString("en-IN");

const METHOD_LABELS: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  wallet: "Wallet",
  emi: "EMI",
  paylater: "Pay later",
};

export const paymentMethodLabel = (method: string) => METHOD_LABELS[method] ?? method;
