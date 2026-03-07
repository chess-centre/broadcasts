import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import useNetworkInfo from "../../hooks/useNetworkInfo";

export default function SpectatorLinkModal({ open, onClose }) {
  const [copied, setCopied] = useState(false);
  const { getBroadcastURL, lanIP } = useNetworkInfo();
  const url = getBroadcastURL("/live");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <Transition
        show={open}
        as={Fragment}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      </Transition>

      {/* Modal */}
      <Transition
        show={open}
        as={Fragment}
        enter="transition-all duration-250 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-200 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-gh-surface border border-gh-border rounded-lg p-6 max-w-sm w-full shadow-2xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-200">Spectator Link</span>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value={url} size={224} />
              </div>
            </div>

            {/* Network info */}
            {lanIP && lanIP !== "127.0.0.1" && (
              <p className="text-[10px] text-emerald-400 text-center mb-2">
                Reachable on local network ({lanIP})
              </p>
            )}

            {/* Instruction */}
            <p className="text-[10px] text-gh-textMuted text-center mb-3 uppercase tracking-wider">
              Scan to watch on any device
            </p>

            {/* URL + Copy */}
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={url}
                className="flex-1 bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1.5 focus:outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-green-400 text-black hover:bg-green-300"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}
