import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { FramerProvider } from "@/components/FramerProvider";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ShortcutProvider } from "@/components/ShortcutProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prio - Secure & Kinetic Task Management",
  description: "A professional, verdant kinetic task manager for seamless productivity.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${spaceGrotesk.variable} ${manrope.variable}`}
    >
      <body 
        className="min-h-full flex flex-col bg-[#0c1511] text-[#dbe5de] font-sans overflow-x-hidden"
        suppressHydrationWarning
      >
        <FramerProvider>
          <ErrorBoundary>
            <ShortcutProvider>
              {children}
            </ShortcutProvider>
          </ErrorBoundary>
        </FramerProvider>
        <Toaster 
          position="top-right" 
          theme="dark" 
          richColors 
          toastOptions={{
            className: "glass-toast rounded-2xl border-none shadow-2xl",
            style: {
              background: '#18221d',
              border: '1px solid #3f4944',
              color: '#dbe5de',
              fontFamily: 'var(--font-manrope)',
            }
          }} 
        />
      </body>
    </html>
  );
}

