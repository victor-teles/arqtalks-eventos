import React, { memo } from "react";
import { PiEnvelopeDuotone } from "react-icons/pi";
import { Message } from "./message";

type Data = {
	message: Message;
	edgePath: string;
};

type Props = {
	id: string;
	data: Data;
};

function MessageNode({ data }: Props) {
	return (
		<div className="px-4 py-2 rounded-xl border bg-card text-card-foreground shadow w-52">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<div className="rounded-full w-4 h-4 flex justify-center items-center">
						<PiEnvelopeDuotone />
					</div>
					<div className="ml-2">
						<div className="text-md font-bold">Usuário</div>
						<div className="text-sm text-white">{data.message.user}</div>
						<div className="text-xs text-muted-foreground">
							{data.message.name}
						</div>
					</div>
				</div>

				<span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
					{data.message.retryCount ?? 0}
				</span>
			</div>
		</div>
	);
}

export default memo(MessageNode);
