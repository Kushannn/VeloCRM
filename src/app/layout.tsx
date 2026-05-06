import type { Metadata } from "next";
import { Raleway, Manrope } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import Providers from "./providers";
import LayoutWithSidebar from "@/components/layouts/LayoutWithSidebar";
import UserLoader from "./UserLoader";
import HomeSignedOut from "@/components/HomeSignedOut";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-raleway",
});
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
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased min-h-screen`}
        style={{ fontFamily: "var(--font-manrope), sans-serif" }}
      >
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <Providers>
            <UserLoader />
            <LayoutWithSidebar>{children}</LayoutWithSidebar>
          </Providers>
        </ClerkProvider>
        {/* <ClerkProvider>
          <SignedIn>
            <Providers>
              <UserLoader />
              <LayoutWithSidebar>{children}</LayoutWithSidebar>
            </Providers>
          </SignedIn>

          <SignedOut>
            <HomeSignedOut />
          </SignedOut>
        </ClerkProvider> */}
      </body>
    </html>
  );
}
