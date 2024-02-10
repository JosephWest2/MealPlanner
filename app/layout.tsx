import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "An app to easily plan and purchase your meals",
};

function Account({session} : {session: Session | null}) {
  if (session && session.user) {
    return <>
      <Link href="/account">Account</Link>
      <Link href="/api/auth/signout">Sign Out</Link>
    </>
  }
  return <Link href="/api/auth/signin">Sign In</Link>
}

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
          <nav>
            <Link href="/">Home</Link>
            <Link href="/Recipes">Recipes</Link>
            <p>{JSON.stringify(session)}</p>
            <Account session={session}></Account>
          </nav>
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
