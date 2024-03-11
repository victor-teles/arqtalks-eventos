import { AnimationControls, motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";

type Data = {
	consuming: boolean;
	onMessageConsumed: () => void;
};

type Props = EdgeProps<Data> & {};

export default function AnimatedEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
	markerEnd,
}: Props) {
	const controls = useAnimationControls();

	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	useEffect(() => {
		if (data?.consuming) {
			//@ts-ignore
			controls.start({ "--offset": "100%" });
		}
	}, [data?.consuming]);

	return (
		<>
			<BaseEdge
				path={edgePath}
				markerEnd={markerEnd}
				style={{ stroke: "#facc15", strokeWidth: 2 }}
			/>

			{data?.consuming && (
				<AnimatedEvent
					edgePath={edgePath}
					controls={controls}
					user="Victor Mesquita"
					onAnimationComplete={data?.onMessageConsumed}
				/>
			)}
		</>
	);
}

type AnimatedEventProps = {
	edgePath: string;
	controls: AnimationControls;
	user: string;
	onAnimationComplete?: () => void;
};

const transition = {
	repeat: 0,
	ease: "easeInOut",
	duration: 2.5,
};

function AnimatedEvent({
	edgePath,
	controls,
	user,
	...rest
}: AnimatedEventProps) {
	function onAnimationComplete() {
		rest?.onAnimationComplete?.();
	}

	function truncate(str: string) {
		return str.length > 15 ? `${str.substring(0, 10)}...` : str;
	}

	return (
		<motion.g
			exit={{ opacity: 0 }}
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
			<rect x="1" y="35" width={"150"} height="60" rx="5" fill="#09090B" />
			<rect
				x="1"
				y="35"
				width={"150"}
				height="60"
				rx="5"
				stroke="#5F616F"
				strokeWidth="2"
			/>
			<line
				x1="75"
				y1="-4.37114e-08"
				x2="75"
				y2="34"
				stroke="#5F616F"
				strokeWidth="2"
			/>
			<text
				x="16"
				y="46"
				dominantBaseline="hanging"
				fill="white"
				fontWeight={"bold"}
			>
				Usuário
			</text>

			<text x="16" y="70" dominantBaseline="hanging" fill="white">
				{truncate(user)}
			</text>
		</motion.g>
	);
}
