import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "An app to easily plan and purchase your meals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/Recipes">Recipes</Link>
        </nav>
        <main>
          {children}
        </main>
        <footer>
          <p>Footer</p>
        </footer>
      </body>
    </html>
  );
}
