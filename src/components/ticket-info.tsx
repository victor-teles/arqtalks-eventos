import Image from "next/image";
import Logo2 from "./icons/logo2";

export default function TicketInfo() {
	return (
		<div className="flex justify-between items-center">
			<div className={"opacity-50"}>
				<p className="text-sm md:text-md text-muted-foreground">27 de MARÇO 2024</p>
				<Logo2 />
			</div>

			<div className={"opacity-60"}>
				<Image src={"/qrcode.svg"} width={100} height={100} alt="QRCode" />
			</div>
		</div>
	);
}
