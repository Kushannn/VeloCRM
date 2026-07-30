// src/app/fonts.ts
import localFont from "next/font/local";

export const myFont = localFont({
  src: [
    {
      path: "../../public/fonts/PPNeueMontreal-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontreal-Semibold.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontreal-Extrabold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-my-font", // used to plug into Tailwind
  display: "swap",
});
