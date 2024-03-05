import db from "@/lib/db";

export async function PUT(request: Request) {
	const res = await request.json();

	await db
		.from("employee")
		.update({ ticketcolor: res.color })
		.eq("slug", res.slug);

	return new Response("User updated", {
		status: 200,
	});
}
