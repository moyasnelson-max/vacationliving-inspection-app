// lib/qrGenerator.js
import QRCode from 'qrcode';

export async function generateHouseQR(houseId) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/inspection/${houseId}`;
  return await QRCode.toDataURL(url);
}
