"use client";

import { User } from "@/lib/user";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti/dist/presets/fireworks";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Tilt from "vanilla-tilt";
import TicketFrame from "./ticket-frame";
import TicketFrameMobile from "./ticket-frame-mobile";
import TicketInfo from "./ticket-info";
import TicketNumber from "./ticket-number";
import TicketProfile from "./ticket-profile";
import styles from "./ticket.module.css";
import styleUtils from "./utils.module.css";

type Props = {
	user: User;
};

export default function Ticket({ user }: Props) {
	const ticketRef = useRef<HTMLDivElement>(null);
	const [controllerFireworks, setControllerFireworks] =
		useState<TConductorInstance>();
	const ticketNumber = String(user.id).padStart(8, "0");

	const onInitHandler = ({ conductor }: { conductor: TConductorInstance }) => {
		setControllerFireworks(conductor);
	};

	useEffect(() => {
		controllerFireworks?.shoot();
	}, [controllerFireworks]);

	useEffect(() => {
		if (ticketRef.current && !window.matchMedia("(pointer: coarse)").matches) {
			Tilt.init(ticketRef.current, {
				glare: true,
				max: 5,
				"max-glare": 0.16,
				"full-page-listening": true,
			});
		}
	}, [ticketRef]);

	return (
		<div className={"flex flex-col  gap-10 w-full"}>
			<ReactCanvasConfetti onInit={onInitHandler} />
			<div
				ref={ticketRef}
				className={cn(
					styles["ticket-visual"],
					styleUtils.appear,
					styleUtils["appear-second"],
				)}
			>
				<div className={"relative translate-z-0"}>
					<div className={"hidden md:flex"}>
						<TicketFrame color={user.ticketcolor} />
					</div>
					<div className={"flex md:hidden"}>
						<TicketFrameMobile color={user.ticketcolor} />
					</div>

					<div
						className={
							"absolute top-0 w-full h-full pl-10 pr-10 py-11 md:pl-16 md:pr-40"
						}
					>
						<TicketProfile name={user.name} />
					</div>

					<div className={"absolute bottom-14 md:bottom-0 right-0"}>
						<div
							className={cn(
								"w-[330px] md:origin-bottom-right text-center",
								styles["rotate-ticket"],
							)}
						>
							<TicketNumber number={ticketNumber} />
						</div>
					</div>

					<div
						className={
							"absolute top-[140px] pl-10 pr-10 py-11 md:pl-16 md:pr-40 w-full h-full"
						}
					>
						<TicketInfo />
					</div>
				</div>
			</div>
		</div>
	);
}
