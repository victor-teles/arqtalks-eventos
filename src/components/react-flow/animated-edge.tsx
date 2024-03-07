import {
	motion,
	useAnimate,
	useAnimationControls,
	useMotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
	BaseEdge,
	EdgeLabelRenderer,
	EdgeProps,
	getBezierPath,
} from "reactflow";
import { Button } from "../ui/button";
type Props = EdgeProps & {};

export default function AnimatedEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
	label,
	markerEnd,
}: Props) {
	const controls = useAnimationControls();
	const controls2 = useAnimationControls();
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});
	const transition = {
		repeat: Infinity,
		type: "spring",
		duration: 8,
	};

	useEffect(() => {
		//@ts-expect-error
		controls.start({ "--offset": "100%" });
		//@ts-expect-error
		controls2.start({ "--offset": "100%" });
	}, []);

	// const transition = { duration: 4, yoyo: Infinity, ease: "easeInOut" };

	function pause() {
		controls.stop();
	}

	return (
		<>
			<BaseEdge
				path={edgePath}
				markerEnd={markerEnd}
				style={{ stroke: `${data.color1}`, strokeWidth: 2 }}
			/>

			{/* <motion.g
				width="112"
				height="25"
				fill="none"
				style={{
					offsetPath: `path("${edgePath}")`,
					offsetDistance: "var(--offset)",
				}}
				//@ts-expect-error
				initial={{ "--offset": "0%" }}
				animate={controls2}
				transition={transition}
			>
				<rect x="1" y="1" width="110" height="23" rx="5" fill="#09090B" />
				<rect
					x="1"
					y="1"
					width="110"
					height="23"
					rx="5"
					stroke="#A3E635"
					stroke-width="2"
				/>
				<text className="text-white">Olaaaaa</text>
			</motion.g> */}

			<motion.circle
				r="4"
				fill={`${data.color1}`}
				style={{
					filter: `drop-shadow(3px 3px 5px ${data.color1}`,
					offsetPath: `path("${edgePath}")`,
					offsetDistance: "var(--offset)",
				}}
				//@ts-expect-error
				initial={{ "--offset": "0%" }}
				animate={controls}
				transition={transition}
			/>
		</>
	);
}
