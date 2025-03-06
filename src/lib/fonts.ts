import localFont from "next/font/local";

export const pantasia = localFont({
  src: [
    {
      path: "../fonts/Pantasia.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-pantasia",
  display: "block",
  preload: true,
});
