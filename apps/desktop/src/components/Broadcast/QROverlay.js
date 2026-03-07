import { QRCodeSVG } from "qrcode.react";
import useNetworkInfo from "../../hooks/useNetworkInfo";

export default function QROverlay() {
  const { getBroadcastURL } = useNetworkInfo();
  const url = getBroadcastURL("/live");

  return (
    <div className="fixed bottom-4 left-4 bg-white p-2 rounded-lg shadow-lg z-30 opacity-80 hover:opacity-100 transition-opacity">
      <QRCodeSVG value={url} size={80} />
    </div>
  );
}
