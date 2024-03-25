"use client";

import { ReactFlowProvider } from "reactflow";

export default function FlowLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
