import AppProvider from "@/provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Use Alarm",
  description: "Manage subscriptions with alarm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased flex flex-col items-center w-full`}>
        <AppProvider>
          <div className="w-full flex flex-col max-w-[600px] bg-slate-50 h-full flex-1">
            {children}
          </div>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        </AppProvider>
      </body>
    </html>
  );
}
