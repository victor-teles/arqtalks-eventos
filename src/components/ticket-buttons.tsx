"use client";

import { sendEvent } from "@/lib/event";
import type { User } from "@/lib/user";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti/dist/presets/fireworks";
import type { TConductorInstance } from "react-canvas-confetti/dist/types";
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
			user: user.name,
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
				user: user.name,
				data: { ...user, ticketColor: color },
			}),
		]);

		router.refresh();
	}

	useEffect(() => {
		controllerFireworks?.shoot();
	}, [controllerFireworks]);

	return (
		<>
			<ReactCanvasConfetti onInit={onInitHandler} />

			<div className="flex flex-col lg:flex-row gap-4 items-center lg:justify-between">
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
		</>
	);
}
