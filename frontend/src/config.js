// Numéro de téléphone — configurez via VITE_PHONE_* dans frontend/.env
export const PHONE_DISPLAY = import.meta.env.VITE_PHONE_DISPLAY || '06 XX XX XX XX';
export const PHONE_E164    = import.meta.env.VITE_PHONE_E164    || '+33600000000';  // format tel:
export const WHATSAPP_NUM  = import.meta.env.VITE_WHATSAPP_NUM  || '33600000000';   // format wa.me

export const waLink = (text = '') =>
  `https://wa.me/${WHATSAPP_NUM}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
