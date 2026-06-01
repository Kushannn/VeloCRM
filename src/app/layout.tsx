import type { Metadata } from "next";
import { Raleway, Manrope, Geist } from "next/font/google";
import "./globals.css";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import LayoutWithSidebar from "@/components/layouts/LayoutWithSidebar";
import UserLoader from "./UserLoader";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "VeloCRM",
  description: "Track your client interactions with VeloCRM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${manrope.variable} antialiased min-h-screen`}
        style={{ fontFamily: "var(--font-manrope), sans-serif" }}
        suppressHydrationWarning
      >
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <Providers>
            <UserLoader />
            <LayoutWithSidebar>{children}</LayoutWithSidebar>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
