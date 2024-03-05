export type Event = {
	time: Date;
	name: string;
	userId: number;
	data?: Record<string, unknown>;
	poisoned: boolean;
};

export async function sendEvent(event: Event) {
	await fetch("/api/event", {
		method: "post",
		body: JSON.stringify(event),
	});
}
