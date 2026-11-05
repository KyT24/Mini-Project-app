const MAX_SIDE = 1200;
const JPEG_QUALITY = 0.85;

/** Perkecil foto di browser jadi JPEG, sisi terpanjang maksimal 1200px */
export async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(MAX_SIDE / Math.max(bitmap.width, bitmap.height), 1);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas tidak tersedia');
  // JPEG tidak punya transparansi; tanpa ini area transparan PNG menjadi hitam
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
  );
  if (!blob) throw new Error('Foto gagal dikompres');

  return new File([blob], 'photo.jpg', { type: 'image/jpeg' });
}
