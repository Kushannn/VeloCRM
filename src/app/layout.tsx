import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

import Navbar from "../components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-raleway", // renamed to match the font
});

export const metadata: Metadata = {
  title: "VeloCRM",
  description: "Track your client interactions with VeloCRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className={`${raleway.variable} antialiased`}>
            <Navbar />
            {children}
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
