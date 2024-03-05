import { cn } from "@/lib/utils";

export default function TicketNumber({ number }: { number: string }) {
	return (
		<h1
			className={
				"scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl"
			}
		>
			№ {number}
		</h1>
	);
}
