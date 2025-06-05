import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tempyst",
  description: "Weather App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
