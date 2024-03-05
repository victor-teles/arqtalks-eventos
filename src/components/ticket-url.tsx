"use client";

import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export default function TicketUrl({ url }: { url: string }) {
	function copyUrl() {
		navigator.clipboard.writeText(url);
		toast("Url do ticket copiada!", {
			description: "Agora você pode enviar para seus colegas!",
		});
	}
	return (
		<div className="flex w-full items-center space-x-2">
			<p className="text-sm text-muted-foreground flex-0.5">
				URL do seu Ticket
			</p>
			<span className="relative flex-1">
				<Input type="text" readOnly value={url} />
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-1/2 right-3 transform -translate-y-1/2"
					onClick={copyUrl}
				>
					<ClipboardCopyIcon className="h-4 w-4" />
				</Button>
			</span>
		</div>
	);
}
