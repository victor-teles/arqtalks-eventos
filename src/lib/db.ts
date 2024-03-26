import { Message } from "@/components/react-flow/message";
import { createClient } from "@supabase/supabase-js";
import { Database, Tables } from "./database.types";

const db = createClient<Database>(
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	process.env.NEXT_PUBLIC_SUPABASE_KEY!,
);

export default db;

type ConsumeMetadata = { page: number; locked: boolean };
const fetchedEventsPage = new Map<string, ConsumeMetadata>();

type EventPayload = { queue: string; consumerId: number };

export async function* fetchEvent(payload: EventPayload): AsyncIterator<{
	consumed: boolean;
	data: any;
	indeadletter: boolean;
	inredelivery: boolean;
	name: string;
	poisoned: boolean;
	retrycount: number;
	time: string;
	userid: number;
} | null> {
	while (true) {
		let metadata: ConsumeMetadata | undefined = fetchedEventsPage.get(
			payload.queue,
		);

		if (!metadata) {
			metadata = { locked: false, page: payload.consumerId };
		}

		if (metadata.locked) {
			await new Promise((resolve) => setTimeout(resolve, 200));
			//@ts-ignore
			yield* fetchEvent(payload.queue);
		} else {
			metadata.locked = true;

			const event = await db
				.from("events")
				.select("*")
				.eq("name", payload.queue)
				.eq("consumed", false)
				.eq("consuming", false)
				.eq("inredelivery", false)
				.eq("indeadletter", false)
				.order("time", { ascending: true })
				.range(payload.consumerId, payload.consumerId)
				.single();

			if (event.data)
				await consumingMessage(
					event.data.time,
					event.data.name,
					event.data.userid,
				);

			metadata.locked = false;

			fetchedEventsPage.set(payload.queue, metadata);

			yield event.data;
		}
	}
}

export async function consumeMessage(message: Message) {
	await db
		.from("events")
		.update({ consumed: true, consuming: false })
		.eq("time", message.time)
		.eq("name", message.name)
		.eq("userid", message.userid);
}

export async function consumingMessage(
	time: string,
	name: string,
	userid: number,
) {
	await db
		.from("events")
		.update({ consuming: true })
		.eq("time", time)
		.eq("name", name)
		.eq("userid", userid);
}

export async function redelivery(message: Message) {
	await db
		.from("events")
		.update({
			inredelivery: message.inRedelivery,
			retrycount: message.retryCount,
			consuming: false,
		})
		.eq("time", message.time)
		.eq("name", message.name)
		.eq("userid", message.userid);
}

export async function deadletter(message: Message) {
	await db
		.from("events")
		.update({ indeadletter: message.inDeadLetter })
		.eq("time", message.time)
		.eq("name", message.name)
		.eq("userid", message.userid);
}

export async function countEvents(eventName: string): Promise<number> {
	const { count } = await db
		.from("events")
		.select("name", { count: "exact" })
		.eq("name", eventName)
		.eq("consumed", true);

	return count ?? 0;
}
