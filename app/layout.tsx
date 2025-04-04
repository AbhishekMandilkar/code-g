import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import { RepoDropdown } from "@/components/Dashboard/repo-dropdown";
import { SiteHeader } from "@/components/Dashboard/site-header";
import { RepoProvider } from "@/components/Provider/RepoProvider";
import { Toaster } from "sonner";
import {ThemeProvider} from "@/components/Provider/ThemeProvider";
import {ThemeToggle} from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider  attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
        <RepoProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <AppSidebar variant="inset" />
            <SidebarInset>
              <div className="flex flex-1 flex-col overflow-y-auto">
                <SiteHeader leftView={<RepoDropdown />} rightView={<ThemeToggle />} />
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </RepoProvider>
        <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
