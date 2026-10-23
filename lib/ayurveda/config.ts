/** Your WhatsApp number: country code first, no + or spaces. */
export const WA_NUMBER = "91XXXXXXXXXX";

/** Optional: a webhook URL (Zapier, Make, Google Apps Script) that receives the lead form as JSON. */
export const FORM_ENDPOINT = "";

export const WA_INTRO_TEXT =
  "Hi, I run an Ayurveda clinic and spend ₹5L+ a month on ads. I would like to reserve my free strategy session.";

export const waLink = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
