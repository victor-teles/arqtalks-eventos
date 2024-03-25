import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import {
	PiBugBeetleDuotone,
	PiCheckCircleDuotone,
	PiEnvelopeDuotone,
} from "react-icons/pi";
import { Message } from "./message";

export type AnimatedEventProps = {
	id: string;
	edgePath: string;
	velocity: number;
	message: Message;
	onAnimationComplete?: (edgeId: string, message: Message) => void;
};
export function AnimatedEvent({
	id,
	edgePath,
	message,
	velocity,
	...rest
}: AnimatedEventProps) {
	const controls = useAnimationControls();
	const transition = {
		repeat: 0,
		ease: "easeInOut",
		duration: velocity,
	};

	useEffect(() => {
		if (!message?.consumed) {
			//@ts-ignore
			controls.start({ "--offset": "100%" });
		}
	}, [message?.consumed]);

	function onAnimationComplete() {
		rest?.onAnimationComplete?.(id, message);
	}

	function truncate(str: string) {
		return str.length > 15 ? `${str.substring(0, 10)}...` : str;
	}

	return (
		<AnimatePresence>
			<motion.g
				// exit={{ opacity: 0 }}
				fill="none"
				style={{
					offsetPath: `path("${edgePath}")`,
					offsetDistance: "var(--offset)",
				}}
				//@ts-expect-error
				initial={{ "--offset": "0%" }}
				animate={controls}
				transition={transition}
				onAnimationComplete={onAnimationComplete}
			>
				<rect x="1" y="35" width={"195"} height="60" rx="5" fill="#09090B" />
				<rect
					x="1"
					y="35"
					width={"195"}
					height="60"
					rx="5"
					stroke="#5F616F"
					strokeWidth="2"
				/>
				<PiEnvelopeDuotone x="16" y="46" />
				<text
					x="38"
					y="46"
					dominantBaseline="hanging"
					fill="white"
					fontWeight={"bold"}
				>
					Usuário
				</text>

				<text x="38" y="70" dominantBaseline="hanging" fill="white">
					{truncate(message.user)}
				</text>

				{message.poisoned ? (
					<PiBugBeetleDuotone color="#ef4444" size={20} x="165" y="46" />
				) : (
					<PiCheckCircleDuotone color="#22c55e" size={20} x="165" y="46" />
				)}
			</motion.g>
		</AnimatePresence>
	);
}
