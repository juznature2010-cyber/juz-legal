import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
