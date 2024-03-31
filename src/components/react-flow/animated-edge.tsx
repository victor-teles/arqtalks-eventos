import { BaseEdge, type EdgeProps, getBezierPath } from "reactflow";

type Data = {
	animated: boolean;
};

type Props = EdgeProps<Data> & {};

export default function AnimatedEdge({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
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
				style={{ stroke: "#facc15", strokeWidth: 4 }}
			/>

			<circle
				style={{ filter: "drop-shadow(3px 3px 5px #facc15" }}
				r="6"
				fill={"#facc15"}
				className="circle"
			>
				<animateMotion dur="6s" repeatCount="indefinite" path={edgePath} />
			</circle>
		</>
	);
}
