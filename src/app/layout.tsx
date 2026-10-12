import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.scss";
import Providers from "@/providers/QueryProvider";
import SettingsProvider from "@/providers/SettingsProvider";
import { LANGUAGE_COOKIE, THEME_COOKIE } from "@/providers/SettingsProvider/constant";
import type { LanguagePreference, ThemePreference } from "@/providers/SettingsProvider/type";
import { detectLanguage, isLanguage } from "@/locales";

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
  // Read saved settings on the server so the first paint already uses them
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get(THEME_COOKIE)?.value;
  const themePreference: ThemePreference = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'system';

  // No saved language (or 'system'): use the browser's preferred language
  const savedLanguage = cookieStore.get(LANGUAGE_COOKIE)?.value;
  const languagePreference: LanguagePreference = isLanguage(savedLanguage) ? savedLanguage : 'system';
  const language = isLanguage(savedLanguage)
    ? savedLanguage
    : detectLanguage((await headers()).get('accept-language'));

  return (
    <html lang={language} data-theme={themePreference === 'system' ? undefined : themePreference}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SettingsProvider
          initialThemePreference={themePreference}
          initialLanguagePreference={languagePreference}
          initialLanguage={language}
        >
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
