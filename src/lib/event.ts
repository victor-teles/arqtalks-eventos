export type Event = {
	time: Date;
	name: string;
	userId: number;
	data?: Record<string, unknown>;
	poisoned: boolean;
	user: string;
};

export async function sendEvent(event: Event) {
	await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/event`, {
		method: "post",
		body: JSON.stringify(event),
	});
}
