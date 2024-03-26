import Ticket from "@/components/ticket";
import TicketButtons from "@/components/ticket-buttons";
import TicketUrl from "@/components/ticket-url";
import { BackgroundBeams } from "@/components/ui/background-beams";
import styleUtils from "@/components/utils.module.css";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function TickePage({
	params,
}: { params: { slug: string } }) {
	const user = (
		await db.from("employee").select("*").eq("slug", params.slug).single()
	).data;

	if (!user) {
		redirect("/");
	}

	const headersList = headers();
	const hostname = headersList.get("x-forwarded-host");

	const url = `https://${hostname}/ticket/${params.slug}`;

	return (
		<div className="flex gap-4">
			<div className="flex flex-col gap-6">
				<h1
					className={cn(
						"text-center md:text-start scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl",
						styleUtils.appear,
						styleUtils["appear-first"],
					)}
				>
					Meu ticket 🎉
				</h1>

				<Ticket user={user} />
				<TicketButtons user={user} />
				<TicketUrl url={url} />
			</div>

			<div className="-z-10">
				<BackgroundBeams />
			</div>
		</div>
	);
}
