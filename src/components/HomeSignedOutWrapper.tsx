"use client";

import dynamic from "next/dynamic";

const HomeSignedOut = dynamic(() => import("@/components/HomeSignedOut"), {
  ssr: false,
});

export default function HomeSignedOutWrapper() {
  return <HomeSignedOut />;
}
