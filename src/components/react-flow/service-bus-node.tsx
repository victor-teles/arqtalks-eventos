import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import ServiceBus from "../icons/service-bus";

function ServiceBusNode() {
	return (
		<div className="w-20 h-20 nodrag relative">
			<ServiceBus />
			<Handle
				type="source"
				position={Position.Right}
				className="w-16 !bg-teal-500"
			/>

			<Handle
				type="target"
				position={Position.Left}
				className="w-16 !bg-teal-500"
			/>

			<div className="text-sm font-bold absolute w-[150px] -left-[20px]">
				Azure Service Bus
			</div>
		</div>
	);
}

export default memo(ServiceBusNode);
