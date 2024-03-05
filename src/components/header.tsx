import Link from "next/link";
import Logo from "./icons/logo";

export default function Header() {
	return (
		<header
			className={
				"flex items-center justify-between border-b border-zinc-900 h-16"
			}
		>
			<div className={"max-w-14 flex items-center p-2 m-4"}>
				<Link href="/" className={"w-14 flex"}>
					<Logo />
				</Link>
			</div>
		</header>
	);
}
