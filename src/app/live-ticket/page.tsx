"use client";

import MetricCard from "@/components/metric-card";
import AnimatedEdge from "@/components/react-flow/animated-edge";
import ConsumerNode from "@/components/react-flow/consumer-node";
import QueueNode from "@/components/react-flow/queue-node";
import { Separator } from "@/components/ui/separator";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
const queues = [
	"usuario.criado",
	"usuario.ficou-feliz",
	"usuario.cor-ticket-alterada",
];

const nodeTypes = {
	queue: QueueNode,
	consumer: ConsumerNode,
};

const edgeTypes = {
	animated: AnimatedEdge,
};
const nodes = [
	{
		id: "1",
		data: { label: "Usuario criado", queue: "usuario.criado" },
		position: { x: 0, y: 0 },
		type: "queue",
	},
	{
		id: "2",
		data: { label: "World", queue: "usuario.criado" },
		position: { x: 700, y: 0 },
		type: "consumer",
	},
	{
		id: "3",
		data: { label: "World", queue: "usuario.criado" },
		position: { x: 700, y: 100 },
		type: "consumer",
	},
];

const initialEdges = [
	{
		id: "e1-2",
		source: "1",
		target: "2",
		animated: false,
		type: "animated",
		data: { color1: "#facc15" },
	},
	{
		id: "e1-3",
		source: "1",
		target: "3",
		animated: false,
		type: "animated",
		data: { color1: "#facc15" },
	},
];

export default function LiveTicket() {
	return (
		<div className="mx-auto md:max-w-4xl lg:max-w-5xl w-full flex flex-col gap-10">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<MetricCard
					title="Usuários criados"
					value={Number(1000).toLocaleString("pt-BR")}
					subTitle="Funcionários assistindo talk"
				/>
				<MetricCard
					title="Mudanças de cores"
					value={Number(1000).toLocaleString("pt-BR")}
					subTitle="Não gostam de cinza"
				/>
				<MetricCard
					title="Usuários felizes"
					value={Number(1000).toLocaleString("pt-BR")}
					subTitle="Adoram confetes!"
				/>
			</div>

			<Separator />

			<div style={{ height: "500px" }}>
				<ReactFlow
					nodes={nodes}
					defaultEdges={initialEdges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
				>
					<Background />
				</ReactFlow>
			</div>

			{/* <div className="flex flex-col h-full items-start gap-10 mt-10">
				{queues.map((queue) => (
					<div className="flex flex-col w-full gap-4">
						<span className="flex items-center gap-2">
							<TargetIcon />
							<p className="leading-7">{queue}</p>
						</span>

						<div className="rounded-xl border h-12 w-full">oi</div>
					</div>
				))}
			</div> */}

			{/* <div className="relative h-96 w-full flex flex-col justify-center items-center">
				<Button className="w-60">Iniciar consumidor</Button>
			</div> */}
		</div>
	);
}
