import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shiv Patel",
  description: "Thoughts on software engineering.",
  openGraph: {
    title: "Shiv Patel",
    description: "Thoughts on software engineering.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
