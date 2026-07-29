import type { Metadata } from "next";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Shine Cars | Ride Safe, Ride Smart - Premium Transport Service",
  description:
    "Premium transport service providing reliable, comfortable, and safe rides across the UK. Airport transfers, corporate accounts, executive rides, and more.",
  keywords: "taxi, cab, transport, airport transfer, corporate travel, UK",
  openGraph: {
    title: "Shine Cars | Ride Safe, Ride Smart",
    description: "Premium transport service across the UK.",
    type: "website",
    locale: "en_GB",
    siteName: "Shine Cars",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable}`}>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
