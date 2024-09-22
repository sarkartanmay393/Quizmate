import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ToastProvider } from "~/components/ui/toast";

export const metadata: Metadata = {
  title: "Quizmate",
  description: "Quiz application for the CT3A",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
      <ToastProvider />
    </html>
  );
}
