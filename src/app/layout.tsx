import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import ArtworkLightbox from "@/components/gallery/ArtworkLightbox";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import LittleCamera from "@/components/interaction/LittleCamera";
import Viewfinder from "@/components/interaction/Viewfinder";
import Cursor from "@/components/interaction/Cursor";
import PageVeil from "@/components/animation/PageVeil";
import ScrollBus from "@/components/animation/ScrollBus";
import SmoothScroll from "@/components/animation/SmoothScroll";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/metadata";

/**
 * Self-hosted via next/font: downloaded at build time, served from
 * /_next/static/media — no runtime request to any external font CDN.
 * Chinese copy intentionally stays on the system serif stack (see
 * --font-cn in globals.css) to avoid shipping a 10MB+ CJK webfont.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

/* Numbers, plate indices, timestamps, technical annotations */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 静默的凝视 — 索尔·雷特线上摄影展`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "A QUIET GAZE Editorial Team" }],
  creator: "A QUIET GAZE",
  publisher: "A QUIET GAZE",
  keywords: [
    "Saul Leiter",
    "索尔·雷特",
    "摄影展",
    "线上展览",
    "彩色摄影",
    "纽约街头摄影",
    "A Quiet Gaze",
    "静默的凝视",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | 静默的凝视`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og/cover.jpg",
        width: 1200,
        height: 630,
        alt: "A QUIET GAZE — independent Saul Leiter exhibition cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | 静默的凝视`,
    description: SITE_DESCRIPTION,
    images: ["/og/cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "arts",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EFE9DD",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hans"
      className={`${cormorant.variable} ${dmSans.variable} ${plexMono.variable}`}
      /* Browser extensions (Trancy, Grammarly, …) inject attributes onto
         <html> before React hydrates; this keeps that from surfacing as a
         hydration error. Our own markup stays fully deterministic. */
      suppressHydrationWarning
    >
      <body id="top">
        <a className="skip-link" href="#main">
          跳到主要内容
        </a>

        <SmoothScroll>
          <ScrollBus />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ArtworkLightbox />
          <Cursor />
          <PageVeil />
          <LittleCamera />
          <Viewfinder />
        </SmoothScroll>
      </body>
    </html>
  );
}
