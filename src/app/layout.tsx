import type { Metadata } from "next";
import { Geist, Lato } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dacruiter",
  description:
    "AI-powered recruitment platform that helps companies and recruiters automate interviews, screen candidates faster, and gain data-driven insights to hire the best talent with less time and effort.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${lato.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
