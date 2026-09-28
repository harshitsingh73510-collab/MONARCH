import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./lusion.css";
import SmoothScroll from "@/components/SmoothScroll";
import Grain from "@/components/Grain";
import Chrome from "@/components/Chrome";
import CursorLabel from "@/components/CursorLabel";
import TransitionProvider from "@/components/transition/TransitionProvider";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "MONARCH — Digital Experience Studio",
  description:
    "Monarch is a digital experience studio. We engineer immersive brands, products and interactive experiences the world doesn't forget.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <TransitionProvider>
          <Grain />
          <Chrome />
          <SmoothScroll>{children}</SmoothScroll>
          <CursorLabel />
        </TransitionProvider>
      </body>
    </html>
  );
}
