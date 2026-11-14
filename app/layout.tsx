import type { Metadata } from "next";
import { Manrope, Unbounded, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SPOTIFY — Спортивная экосистема Ташкента // AI подбор и бронирование",
  description:
    "Платформа персонального подбора спортивных клубов и тренировок в Ташкенте на основе искусственного интеллекта. Сравнивайте цены, расписания и записывайтесь онлайн за 0 UZS.",
  keywords: ["спорт ташкент", "фитнес ташкент", "падел ташкент", "бокс ташкент", "бассейн ташкент", "AI тренер", "sportify uz"],
  openGraph: {
    title: "SPOTIFY Ташкент — Найди свой идеальный спорт за 60 секунд",
    description: "Персональный AI-подбор тренировок и актуальных локаций в Ташкенте.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className={`dark ${manrope.variable} ${unbounded.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('spotify-theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
