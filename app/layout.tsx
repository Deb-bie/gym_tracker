import type { Metadata } from "next";
import {Inter, Poppins} from 'next/font/google'
import "./globals.css";
import ClientLayout from "./client";


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  weight: "300",
  subsets: ['latin'],
  variable: '--font-poppins',
})


export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "Track your gym progress easily",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

