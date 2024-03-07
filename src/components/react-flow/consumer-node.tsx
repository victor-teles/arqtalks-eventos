import React, { memo } from "react";
import { PiComputerTowerDuotone } from "react-icons/pi";
import { Handle, Position } from "reactflow";

type Data = {
	label: string;
	queue: string;
};

type Props = {
	data: Data;
};

function ConsumerNode({ data }: Props) {
	return (
		<div className="px-4 py-2 rounded-xl border bg-card text-card-foreground shadow">
			<div className="flex items-center">
				<div className="rounded-full w-4 h-4 flex justify-center items-center">
					<PiComputerTowerDuotone />
				</div>
				<div className="ml-2">
					<div className="text-md font-bold">{data.label}</div>
					<div className="text-sm text-muted-foreground">{data.queue}</div>
				</div>
			</div>

			<Handle
				type="target"
				position={Position.Left}
				className="w-16 !bg-teal-500"
			/>
		</div>
	);
}

export default memo(ConsumerNode);
