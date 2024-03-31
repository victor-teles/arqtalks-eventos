import type { Message } from "@/lib/bus/message";
import React, { memo, useEffect, useState } from "react";
import { PiEnvelopeDuotone } from "react-icons/pi";

type Data = {
	message: Message;
	edgePath: string;
	onMessageScheduleFinished: (id: string, message: Message) => void;
	count: boolean;
};

type Props = {
	id: string;
	data: Data;
};

const scheduleTimeout = 10;
function MessageNode({ id, data }: Props) {
	const [countUp, setCountUp] = useState(0);

	useEffect(() => {
		if (!data.count) return;
		const interval = setInterval(() => {
			setCountUp((c) => c + 1);
		}, 1000);

		if (countUp >= scheduleTimeout) {
			clearInterval(interval);
			data.onMessageScheduleFinished(id, data.message);
			return;
		}

		return () => {
			clearInterval(interval);
		};
	}, [countUp, data]);

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
					</div>
				</div>

				{data.count && (
					<span className="bg-yellow-100 text-yellow-400 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
						{countUp}
					</span>
				)}
				<span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
					{data.message.retryCount ?? 0}
				</span>
			</div>
		</div>
	);
}

export default memo(MessageNode);
