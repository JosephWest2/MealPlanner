import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/server/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "An app to easily plan and purchase your meals",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={inter.className}>
      <Providers>
        <body>
          <Navbar></Navbar>
          <main style={{minHeight: "80vh"}}>
            {children}
          </main>
          <footer>
            <p style={{color: "grey"}}>© Joseph West</p>
          </footer>
        </body>
      </Providers>
    </html>
  );
}
