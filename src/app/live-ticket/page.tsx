"use client";

import MetricCard from "@/components/metric-card";
import AnimatedEdge from "@/components/react-flow/animated-edge";
import ConsumerNode from "@/components/react-flow/consumer-node";
import QueueNode from "@/components/react-flow/queue-node";
import { Button } from "@/components/ui/button";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { countEvents, fetchEvent } from "@/lib/db";
import { useEffect, useRef, useState } from "react";
import ReactFlow, { Background, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes = {
	queue: QueueNode,
	consumer: ConsumerNode,
};

const edgeTypes = {
	animated: AnimatedEdge,
};

type QueueNodeType = {
	id: string;
	data: { label: string; queue: string; queueId?: string };
	position: { x: number; y: number };
	type: "queue";
};
type ConsumerNodeType = {
	id: string;
	position: { x: number; y: number };
	data: { label: string; queue: string; queueId?: string };
	type: "consumer";
};

const initialNodes: (ConsumerNodeType | QueueNodeType)[] = [
	{
		id: "1",
		data: { label: "Usuario criado", queue: "usuario.criado" },
		position: { x: 0, y: 0 },
		type: "queue",
	},
	{
		id: "2",
		data: { label: "Usuario ficou feliz", queue: "usuario.ficou-feliz" },
		position: { x: 0, y: 500 },
		type: "queue",
	},
	{
		id: "3",
		data: {
			label: "Cor ticket alterada",
			queue: "usuario.cor-ticket-alterada",
		},
		position: { x: 0, y: 1000 },
		type: "queue",
	},
];

let globalId = 4;
const getId = () => `${globalId++}`;

export default function LiveTicket() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedQueue, setSelectedQueue] = useState("1");
	const consumerPosition = useRef({ [selectedQueue]: 1 });
	const [createdUsers, setCreatedUsers] = useState(0);
	const [colorsChanges, setColorsChanges] = useState(0);
	const [usersHappy, setUsersHappy] = useState(0);

	useEffect(() => {
		async function fetch() {
			const [createdUsersCount, colorsChangesCount, usersHappyCount] =
				await Promise.all([
					countEvents("usuario.criado"),
					countEvents("usuario.cor-ticket-alterada"),
					countEvents("usuario.ficou-feliz"),
				]);

			setCreatedUsers(createdUsersCount);
			setColorsChanges(colorsChangesCount);
			setUsersHappy(usersHappyCount);
		}

		fetch();

		return () => {
			console.log("clean up");
		};
	}, []);

	async function onMessageConsumed() {
		const generator = fetchEvent("usuario.criado");

		const event = await generator.next();
		console.log(event);
	}

	const onAddConsumer = () => {
		const id = getId();
		const queueNode = nodes.find((node) => node.id === selectedQueue);
		const lastConsumer = nodes.findLast(
			(node) => node.type === "consumer" && node.data.queueId === selectedQueue,
		);
		const y = lastConsumer?.position
			? lastConsumer?.position?.y + 80
			: queueNode?.position.y ?? 0;

		const newNode = {
			id,
			position: { x: 700, y },
			data: {
				label: `Consumidor ${globalId - 4}`,
				queue: queueNode?.data.queue ?? "fila",
				queueId: selectedQueue,
			},
			type: "consumer",
		};

		const newEdge = {
			id,
			source: selectedQueue,
			target: id,
			type: "animated",
			data: {
				consuming: true,
				onMessageConsumed,
			},
		};

		setNodes((nds) => nds.concat(newNode));
		setEdges((eds) => eds.concat(newEdge));

		consumerPosition.current[selectedQueue]++;
	};

	const onSelectQueueChanged = (value: string) => {
		setSelectedQueue(value);
	};

	return (
		<div className="mx-auto md:max-w-4xl lg:max-w-5xl w-full flex flex-col gap-10">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<MetricCard
					title="Usuários criados"
					value={createdUsers.toLocaleString("pt-BR")}
					subTitle="Funcionários assistindo o ArqTalk"
				/>
				<MetricCard
					title="Mudanças de cores"
					value={colorsChanges.toLocaleString("pt-BR")}
					subTitle="Não gostam de cinza"
				/>
				<MetricCard
					title="Usuários felizes"
					value={usersHappy.toLocaleString("pt-BR")}
					subTitle="Adoram confetes!"
				/>
			</div>

			<Separator />

			<div className="flex gap-4 justify-end">
				<Select onValueChange={onSelectQueueChanged} value={selectedQueue}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Selecione uma fila" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Fila</SelectLabel>
							<SelectItem value="1">Usuário criado</SelectItem>
							<SelectItem value="2">Usuario ficou feliz</SelectItem>
							<SelectItem value="3">Cor ticket alterada</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Button onClick={onAddConsumer}>Adicionar consumidor</Button>
			</div>

			<div style={{ height: "500px" }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
				>
					<Background />
				</ReactFlow>
			</div>
		</div>
	);
}
