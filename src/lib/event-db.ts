import db from "./db";
import { Event } from "./event";

export async function sendEventDb(event: Event) {
	await db.from("events").insert({
		data: JSON.stringify(event.data),
		name: event.name,
		time: event.time.toISOString(),
		userid: event.userId,
		poisoned: event.poisoned,
	});
}
