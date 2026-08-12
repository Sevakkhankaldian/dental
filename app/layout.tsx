import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "دنتامانیتور ایران | پرتال کامل کلینیک";
const description = "صندوق یکپارچه، بررسی انسانی، بیماران، پیام‌ها، نوبت‌ها، پروتکل‌ها و تحلیل‌های پایش ارتودنسی";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fa_IR",
      images: [
        {
          url: `${origin}/og-v2.png`,
          width: 1200,
          height: 630,
          alt: "دنتامانیتور ایران — پیشنهاد هوشمند، تصمیم پزشک",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og-v2.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
