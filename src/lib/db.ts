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

const fetchedEventsPage = new Map<string, number>();

export async function* fetchEvent(eventName: string) {
	while (true) {
		let page = fetchedEventsPage.get(eventName);

		if (!page) {
			page = 0;
		}

		const event = await db
			.from("events")
			.select("*")
			.eq("name", eventName)
			.eq("consumed", false)
			.eq("inredelivery", false)
			.eq("indeadletter", false)
			.order("time", { ascending: true })
			.range(page, page)
			.single();

		fetchedEventsPage.set(eventName, ++page);
		yield event.data;
	}
}

export async function consumeMessage(message: Message) {
	await db
		.from("events")
		.update({ consumed: true })
		.eq("time", message.time)
		.eq("name", message.name)
		.eq("userid", message.userid);
}

export async function redelivery(message: Message) {
	await db
		.from("events")
		.update({
			inredelivery: message.inRedelivery,
			retrycount: message.retryCount,
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
