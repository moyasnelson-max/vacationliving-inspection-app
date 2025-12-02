export default function QRDownloader({ url }) {
  return (
    <a href={url} download className="qr-download">
      Download QR
    </a>
  );
}