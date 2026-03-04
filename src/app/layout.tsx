import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crossover Prompt Generator",
  description: "異世界クロスオーバー画像プロンプト生成ツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${geist.className} bg-gray-950 text-gray-100 min-h-screen`}
      >
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight">
              🎨 Crossover Prompt Generator
            </Link>
            <div className="flex gap-4">
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
              >
                Generator
              </Link>
              <Link
                href="/history"
                className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
              >
                History
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
