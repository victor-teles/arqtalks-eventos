import { useState } from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";
import { AnimatedEvent } from "./animated-event";
import { Message } from "./message";

type Data = {
	velocity?: number;
	message: Message;
	onMessageConsumed: (edgeId: string, message: Message) => void;
};

type Props = EdgeProps<Data> & {};

export default function MessageQueueEdge({
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
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<>
			<BaseEdge
				path={edgePath}
				markerEnd={markerEnd}
				style={{ stroke: "#facc15", strokeWidth: 2 }}
			/>

			{data?.message && (
				<AnimatedEvent
					velocity={data?.velocity ?? 3.2}
					key={data?.message.time.toString()}
					id={id}
					message={data?.message}
					edgePath={edgePath}
					onAnimationComplete={data?.onMessageConsumed}
				/>
			)}
		</>
	);
}
