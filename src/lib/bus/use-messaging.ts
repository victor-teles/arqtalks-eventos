import type {
	ServiceBusClient,
	ServiceBusReceivedMessage,
	ServiceBusReceiver,
} from "@azure/service-bus";
import { nanoid } from "nanoid";
import { useRef } from "react";
import type { Message } from "./message";
import { Queue } from "./queue";

export type ConsumerKey = { id: string; topic: string };
export type ConsumerMeta = {
	bus: ServiceBusReceiver;
	incomingMessage: ServiceBusReceivedMessage | undefined;
};
export const newKey = (topic: string) => ({ id: nanoid(), topic });

export default function useMessaging(broker: ServiceBusClient) {
	const consumers = useRef(new Map<ConsumerKey, ConsumerMeta>());

	function addConsumer(consumerKey: ConsumerKey) {
		if (consumers.current.get(consumerKey)) return;

		consumers.current.set(consumerKey, {
			bus: broker.createReceiver(consumerKey.topic),
			incomingMessage: undefined,
		});
	}

	async function fetchNext(consumerKey: ConsumerKey): Promise<Message | null> {
		const metadata = consumers.current.get(consumerKey);
		if (!metadata) return null;

		const interator = metadata.bus.getMessageIterator();

		const incomingMessage = (await interator.next())
			.value as ServiceBusReceivedMessage;

		metadata.incomingMessage = incomingMessage;

		const body = JSON.parse(incomingMessage.body);

		return {
			consumed: false,
			inDeadLetter: !!incomingMessage.deadLetterReason,
			inRedelivery: false,
			name: body.name,
			poisoned: body.poisoned,
			retryCount: body.retryCount ?? 0,
			time: body.time,
			user: body.user,
			userId: body.userId,
		};
	}

	async function consume(consumerKey: ConsumerKey): Promise<void> {
		const metadata = consumers.current.get(consumerKey);
		if (!metadata) return;

		const message = metadata.incomingMessage;
		if (message) await metadata.bus.completeMessage(message);
	}

	async function sendToDeadLetter(consumerKey: ConsumerKey): Promise<void> {
		const metadata = consumers.current.get(consumerKey);
		if (!metadata) return;

		const message = metadata.incomingMessage;
		if (message) await metadata.bus.deadLetterMessage(message);
	}

	async function schedule(consumerKey: ConsumerKey): Promise<void> {
		const metadata = consumers.current.get(consumerKey);
		if (!metadata) return;

		const message = metadata.incomingMessage;

		if (message) {
			const body = JSON.parse(message.body);

			message.body = JSON.stringify({
				...body,
				retryCount: body.retryCount + 1,
			});

			const scheduledEnqueueTimeUtc = new Date(Date.now() + 10000);
			const sender = broker.createSender(consumerKey.topic);

			await sender.scheduleMessages(message, scheduledEnqueueTimeUtc);
			await metadata.bus.completeMessage(message);
		}
	}

	return {
		addConsumer,
		fetchNext,
		consume,
		sendToDeadLetter,
		schedule,
	};
}
