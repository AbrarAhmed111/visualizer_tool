import "../assets/css/globals.css"; // CSS is now included here
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import Providers from "@/store/Providers";

type RootLayoutProps = {
  children: ReactNode;
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Providers>
      <html lang="en">
        <head></head>
        <body suppressHydrationWarning className="antialiased">
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </body>
      </html>
    </Providers>
  );
}
