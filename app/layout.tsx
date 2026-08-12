import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "دنتامانیتور ایران | مراقبت پیوسته، تصمیم مطمئن";
const description = "پلتفرم پایش ارتودنسی با سایت معرفی، داشبوردهای مستقل بیمار، پزشک، کلینیک و ادمین و اپلیکیشن مشترک نقش‌محور";

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
          url: `${origin}/og-v5.png`,
          width: 1200,
          height: 630,
          alt: "دنتامانیتور ایران — داشبوردهای مستقل بیمار، پزشک، کلینیک و ادمین",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og-v5.png`],
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
