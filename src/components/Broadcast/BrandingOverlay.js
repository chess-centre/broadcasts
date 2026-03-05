import { useBroadcastSettings } from "../../context/BroadcastSettingsContext";

const ACCENT_BORDER = {
  green: "border-green-400",
  amber: "border-amber-400",
  blue: "border-blue-400",
  rose: "border-rose-400",
  teal: "border-teal-400",
};

export default function BrandingOverlay() {
  const { settings } = useBroadcastSettings();

  if (!settings.brandingEnabled) return null;

  const hasTitle = settings.brandingEventTitle || settings.brandingSubtitle;
  const hasLogo = settings.brandingLogoUrl;
  const hasTicker = settings.brandingTickerText;
  const accentBorder = ACCENT_BORDER[settings.accentColor] || ACCENT_BORDER.green;

  if (!hasTitle && !hasLogo && !hasTicker) return null;

  return (
    <>
      {/* Top banner */}
      {(hasTitle || hasLogo) && (
        <div
          className={`fixed top-0 left-0 right-0 z-20 bg-gh-bg/80 backdrop-blur-sm border-b-2 ${accentBorder}`}
        >
          <div className="max-w-screen-2xl mx-auto px-6 py-2 flex items-center justify-between">
            <div className="flex flex-col">
              {settings.brandingEventTitle && (
                <span className="text-sm font-semibold text-white tracking-wide">
                  {settings.brandingEventTitle}
                </span>
              )}
              {settings.brandingSubtitle && (
                <span className="text-[10px] text-gh-textMuted uppercase tracking-wider">
                  {settings.brandingSubtitle}
                </span>
              )}
            </div>
            {hasLogo && (
              <img
                src={settings.brandingLogoUrl}
                alt="Logo"
                className="h-8 w-auto object-contain opacity-90"
              />
            )}
          </div>
        </div>
      )}

      {/* Bottom ticker */}
      {hasTicker && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-gh-bg/80 backdrop-blur-sm border-t border-gh-border overflow-hidden">
          <div className="py-1.5 whitespace-nowrap">
            <span
              className="inline-block text-xs text-gh-textMuted tracking-wide"
              style={{ animation: "ticker 20s linear infinite" }}
            >
              {settings.brandingTickerText}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
