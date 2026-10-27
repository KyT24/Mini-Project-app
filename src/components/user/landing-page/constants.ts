export const WA_NUMBER = '0882019348463';
export const RESERVE_HREF = `https://wa.me/${WA_NUMBER}`;
export const NAVY = '#1B1B7A';

export function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
