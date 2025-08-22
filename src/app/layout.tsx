import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Reduxrovider from "../providers/ReduxProvider";
import AuthStatusProvider from "@/providers/authProvider";
import { Analytics } from "@vercel/analytics/next"
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thenaghz.ir'), 
  title: "نغز | آموزش مهارت‌های نرم و توسعه فردی",
  description: "نغز، پلتفرم جامع آموزش مهارت‌های نرم، توسعه فردی و یادگیری مهارت‌های ضروری برای موفقیت در زندگی و کار",
  keywords: [
    "مهارت‌های نرم", "توسعه فردی", "آموزش آنلاین", "مهارت‌های زندگی", "مهارت", "مدیریت زمان", "حل مسئله", 
    "soft skills", "personal development", "online learning", "life skills",
    "leadership", "communication", "teamwork", "problem solving"
  ],
  authors: [{ name: "نغز", url: "https://thenaghz.ir" }],
  creator: "نغز",
  publisher: "نغز",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification=TEb2wqUiuhi7RpjhdtVFATebdifTCHbT37JIznjdNgY", 
  },
  alternates: {
    canonical: "https://thenaghz.ir",
    languages: {
      'fa-IR': "https://thenaghz.ir",
      'en-US': "https://thenaghz.ir",
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: "en_US",
    url: "https://thenaghz.ir",
    siteName: "نغز",
    title: "نغز | آموزش مهارت‌های نرم و توسعه فردی",
    description: "نغز، پلتفرم جامع آموزش مهارت‌های نرم، توسعه فردی و یادگیری مهارت‌های ضروری برای موفقیت در زندگی و کار",
    images: [
      {
        url: "/Naghz-logo.jpg",
        width: 1200,
        height: 630,
        alt: "لوگوی نغز - آموزش مهارت‌های نرم",
      },
    ],
  },
  icons: {
    icon: [
      {
        url: "/Naghz-logo.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
    shortcut: "/Naghz-logo.jpg",
    apple: "/Naghz-logo.jpg",
  },
  category: "education",
  classification: "educational",
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "نغز",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Reduxrovider>
          <AuthStatusProvider>
            <Header />
            {children}
            <Footer />
            <Analytics />
          </AuthStatusProvider>
        </Reduxrovider>
      </body>
    </html>
  );
}
