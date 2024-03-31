"use server";

import db from "@/lib/db";
import { sendEvent } from "@/lib/event";
import { slugify } from "@/lib/slugfy";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export async function createEmployee(formData: FormData) {
	const name = formData.get("name") as string;
	const slug = `${slugify(name)}-${nanoid(5)}`;

	const user = await db
		.from("employee")
		.insert({ name: name, slug })
		.select()
		.single();

	if (user.data)
		await sendEvent({
			name: "usuario.criado",
			time: new Date(),
			poisoned: false,
			userId: user.data.id,
			user: user.data.name,
			data: { ...user.data },
		});

	redirect(`/ticket/${slug}`);
}
