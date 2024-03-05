import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});
export const metadata: Metadata = {
	title: "ArqTalks - Arquitetura de eventos",
	description: "ArqTalks - Arquitetura de eventos",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className="dark" lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<Header />
				<main className="flex h-[calc(100%-64px)] flex-col items-center justify-between container py-24">
					{children}
				</main>
				<Toaster />
			</body>
		</html>
	);
}
