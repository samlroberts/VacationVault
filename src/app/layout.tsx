import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "react-hot-toast";
import { ViewTransitions } from "next-view-transitions";

export const metadata: Metadata = {
  title: "Vacation Vault",
  description: "Keep your vacation memories safe and organized.",
  icons: [{ rel: "icon", url: "/icon.svg" }],
};

import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <ViewTransitions>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </body>
      </html>
    </ViewTransitions>
  );
}
