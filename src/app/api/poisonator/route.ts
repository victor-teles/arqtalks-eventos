import db from "@/lib/db";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const event = searchParams.get("event");

	if (!event) {
		return new Response(null, {
			status: 400,
		});
	}

	const data = await db.rpc("poison_count", { event_name: event });

	return new Response(JSON.stringify(data.data), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const event = searchParams.get("event");

	if (!event) {
		return new Response(null, {
			status: 400,
		});
	}

	const data = await db.rpc("poison", { event_name: event });

	return new Response(JSON.stringify(data.data), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
