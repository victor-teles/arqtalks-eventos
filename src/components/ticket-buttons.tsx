"use client";

import { sendEvent } from "@/lib/event";
import { User } from "@/lib/user";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti/dist/presets/fireworks";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import { Button } from "./ui/button";

type Props = {
	user: User;
};

export default function TicketButtons({ user }: Props) {
	const router = useRouter();
	const colorsButtons = ["#252729", "#a3e635", "#facc15", "#2dd4bf", "#a78bfa"];
	const [controllerFireworks, setControllerFireworks] =
		useState<TConductorInstance>();

	function onInitHandler({ conductor }: { conductor: TConductorInstance }) {
		setControllerFireworks(conductor);
	}

	async function shootConfetti() {
		await sendEvent({
			name: "usuario.ficou-feliz",
			poisoned: false,
			time: new Date(),
			userId: user.id,
			data: { ...user },
		});
		controllerFireworks?.shoot();
	}

	async function changeColor(color: string) {
		await Promise.all([
			fetch("/api/user", {
				method: "put",
				body: JSON.stringify({ slug: user.slug, color }),
			}),

			sendEvent({
				name: "usuario.cor-ticket-alterada",
				poisoned: false,
				time: new Date(),
				userId: user.id,
				data: { ...user, ticketColor: color },
			}),
		]);

		router.refresh();
	}

	useEffect(() => {
		controllerFireworks?.shoot();
	}, [controllerFireworks]);

	return (
		<div className="flex gap-4 justify-between">
			<ReactCanvasConfetti onInit={onInitHandler} />

			<div className="flex gap-4">
				{colorsButtons.map((color) => (
					<Button
						onClick={() => changeColor(color)}
						size={"icon"}
						className={cn({
							"shadow-inner": color === user.ticketcolor,
						})}
						style={{ backgroundColor: color }}
					></Button>
				))}
			</div>

			<div className="flex gap-4">
				<Button onClick={shootConfetti}>Jogar confete 🎉</Button>
			</div>
		</div>
	);
}
