import type { Metadata, Viewport } from "next";

import "./globals.css";
import ArtworkLightbox from "@/components/gallery/ArtworkLightbox";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ScrollMotion from "@/components/animation/ScrollMotion";
import SmoothScroll from "@/components/animation/SmoothScroll";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/metadata";

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
  themeColor: "#EAE6DE",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body id="top">
        <a className="skip-link" href="#main">
          跳到主要内容
        </a>

        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ScrollMotion />
          <ArtworkLightbox />
        </SmoothScroll>
      </body>
    </html>
  );
}
