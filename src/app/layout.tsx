import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.scss";
import Providers from "@/providers/QueryProvider";
import SettingsProvider from "@/providers/SettingsProvider";
import { THEME_COOKIE } from "@/providers/SettingsProvider/constant";
import type { Theme } from "@/providers/SettingsProvider/type";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "Name Tailor - AI Naming Helper",
  description: "AI-powered naming helper for developers",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // Read the saved theme on the server so the first paint already uses it
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get(THEME_COOKIE)?.value;
  const theme: Theme | null = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null;

  return (
    <html lang="en" data-theme={theme ?? undefined}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SettingsProvider initialTheme={theme}>
          <Providers>
            {children}
          </Providers>
        </SettingsProvider>
      </body>
    </html>
  );
};

export { metadata };
export default RootLayout;
