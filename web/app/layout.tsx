import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Careboard · Clinic tasks",
  description: "A calm, organized workspace for your clinic care team.",
};

export const viewport: Viewport = {
  themeColor: "#f4f6f3",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
