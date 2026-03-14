import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Industrial Automation Command Center",
  description:
    "Unified equipment monitoring, operational insights, and automation control for modern factories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
