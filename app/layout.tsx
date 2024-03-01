import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
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

  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={inter.className}>
      <Providers>
        <body>
          <Navbar session={session}></Navbar>
          <main>
            {children}
          </main>
          <footer>
            <p>Footer</p>
          </footer>
        </body>
      </Providers>
    </html>
  );
}
