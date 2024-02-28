import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Providers } from "./providers";
import Cart from "@/components/cart/cart";

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
            <Link href="https://www.amazon.com/ref=nosim?tag=jwest11-20" target="_blank">Amazon</Link>
            <a target="_blank" href="https://www.amazon.com/b?_encoding=UTF8&tag=jwest11-20&linkCode=ur2&linkId=d04db934cb1440846d88f0db4e8d9b6d&camp=1789&creative=9325&node=7072561011">Top Cell Phones</a>
            <p>{JSON.stringify(session)}</p>
            <Account session={session}></Account>
            <Cart></Cart>
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
