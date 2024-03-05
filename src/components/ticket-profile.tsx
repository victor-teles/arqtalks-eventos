import { getInitials } from "@/lib/initials";
import { Avatar, AvatarFallback } from "./ui/avatar";

type Props = {
	name?: string;
};

export default function TicketProfile({ name }: Props) {
	const user = name || "Meu nome";
	return (
		<div className={"flex item-center"}>
			<Avatar className="h-16 w-16">
				<AvatarFallback>{getInitials(user)}</AvatarFallback>
			</Avatar>

			<div className={"flex-1 ml-2"}>
				<p
					className={
						"scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight"
					}
				>
					<span>{user}</span>
				</p>
				<p className={"leading-7"}>Funcionário MAG</p>
			</div>
		</div>
	);
}
