import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Chess Broadcast - Live DGT Board Broadcasting",
  description:
    "Professional live chess broadcasting software. Connect DGT boards, stream games in real-time with engine analysis, clocks, and spectator views. Free and open source.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Chess Broadcast - Live DGT Board Broadcasting",
    description:
      "Professional live chess broadcasting. Connect DGT boards, stream games in real-time. Free and open source.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
