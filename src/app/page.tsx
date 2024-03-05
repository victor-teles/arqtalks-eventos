import { EmployeeForm } from "@/components/employee-form";

export default function Home() {
	return (
		<div className="flex flex-col gap-4 h-52 justify-between items-center">
			<span className="flex flex-col items-center">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl">
					ArqTalks - Arquitetura de Eventos
				</h1>

				<p className="text-xl text-muted-foreground mt-4">
					27 Março 2024 | Sistema de simulação de eventos
				</p>
			</span>

			<EmployeeForm />
		</div>
	);
}
