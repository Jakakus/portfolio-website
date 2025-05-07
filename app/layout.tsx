import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Analytics Portfolio",
  description: "Showcasing data visualization, business intelligence, and predictive analytics projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0A0F] text-white`}>
        <div className="bg-gradient-to-br from-[#000814] to-[#001440] fixed inset-0 z-[-2]"></div>
        {children}
      </body>
    </html>
  );
}
