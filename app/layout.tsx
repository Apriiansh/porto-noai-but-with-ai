import type { Metadata } from "next";
import { Abril_Fatface, Exo_2, Raleway } from "next/font/google";
// @ts-ignore
import "./globals.css";

const abril_fatface = Abril_Fatface({
  variable: "--font-abril-fatface",
  subsets: ["latin"],
  weight: "400"
});

const exo_2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
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
        className={`${abril_fatface.variable} ${exo_2.variable} ${raleway.variable} antialiased h-screen flex flex-col pt-16`}
      >
        {children}
      </body>
    </html>
  );
}
