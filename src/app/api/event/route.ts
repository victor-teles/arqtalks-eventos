import db from "@/lib/db";

export async function POST(request: Request) {
	const req = await request.json();

	await db.from("events").insert({
		data: req.data,
		name: req.name,
		time: req.time,
		userid: req.userId,
		poisoned: req.poisoned,
	});

	return new Response("", {
		status: 200,
	});
}
