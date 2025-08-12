import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Reduxrovider from "../providers/ReduxProvider";
import AuthStatusProvider from "@/providers/authProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nghaz",
  description: "Naghz, a web app to teach soft skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        style={{ fontFamily: 'Yekan, sans-serif' }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Reduxrovider>
          <AuthStatusProvider>
            <Header />
            {children}
          </AuthStatusProvider>
        </Reduxrovider>
      </body>
    </html>
  );
}
