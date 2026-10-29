// Sisa detik upload bukti bayar, dihitung dari remaining_seconds server
// (tidak bergantung jam perangkat). `fetchedAt` = dataUpdatedAt React Query.
export function getRemainingSeconds(remainingSeconds: number, fetchedAt: number, now: number) {
  return Math.max(Math.ceil((fetchedAt + remainingSeconds * 1000 - now) / 1000), 0);
}
