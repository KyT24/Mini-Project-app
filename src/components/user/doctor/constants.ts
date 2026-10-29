export const FEE_RANGES = [
  { value: 'low', label: 'Di bawah Rp150.000', min_fee: undefined, max_fee: 149999 },
  { value: 'mid', label: 'Rp150.000 – Rp300.000', min_fee: 150000, max_fee: 300000 },
  { value: 'high', label: 'Di atas Rp300.000', min_fee: 300001, max_fee: undefined },
] as const;
