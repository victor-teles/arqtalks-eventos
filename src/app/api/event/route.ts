import db from "@/lib/db";

type PoisonCount = {
	poison_count: number;
};

export async function POST(request: Request) {
	const req = await request.json();

	const poisonResponse = await db.rpc("poison", { event_name: req.name });
	const poisonCount = poisonResponse.data as PoisonCount[] | undefined;

	await db.from("events").insert({
		data: req.data,
		name: req.name,
		time: req.time,
		userid: req.userId,
		poisoned: (poisonCount?.at(0)?.poison_count ?? 0) % 10 === 0,
	});

	return new Response("", {
		status: 200,
	});
}
