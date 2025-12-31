import type { Metadata } from "next";
import { BBH_Bartle, Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/page";

const bbh_bartle = BBH_Bartle({
  variable: "--font-bbh-bartle",
  subsets: ["latin"],
  weight: "400"
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Apriiansh Portfolio",
  description: "Portofolio website of Apri build with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bbh_bartle.variable} ${raleway.variable} antialiased h-screen flex flex-col pt-16`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
