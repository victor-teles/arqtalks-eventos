"use client";

import MetricCard from "@/components/metric-card";
import { Button } from "@/components/ui/button";

import { Message } from "@/components/react-flow/message";
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
import { countEvents, fetchEvent, redelivery } from "@/lib/db";
import { usePub, useSub } from "@/lib/use-pubsub";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import ReactFlow, {
	Background,
	Edge,
	Position,
	XYPosition,
	useEdgesState,
	useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
	edgeTypes,
	initialEdges,
	initialNodes,
	nodeTypes,
} from "./flow-config";
import { MetricTopic, reducerConsumeConfig, reducerMetrics } from "./reducers";

let globalId = 6;
const getId = () => `${globalId++}`;

const metricTopicsMap: MetricTopic = {
	"usuario.criado": "users",
	"usuario.cor-ticket-alterada": "colorChanges",
	"usuario.ficou-feliz": "happy",
};

type EdgeData = { message?: Message };

export default function LiveTicket() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] =
		useEdgesState<EdgeData>(initialEdges);
	const [consumeConfig, dispatchConsumeConfig] = useReducer(
		reducerConsumeConfig,
		{
			queue: "3",
			velocity: 3.2,
		},
	);
	const [metrics, dispatchMetrics] = useReducer(reducerMetrics, {
		happy: 0,
		colorChanges: 0,
		users: 0,
	});

	const consumerPosition = useRef({ [consumeConfig.queue]: 3 });
	const publish = usePub();

	useEffect(() => {
		async function fetch() {
			const [createdUsersCount, colorsChangesCount, usersHappyCount] =
				await Promise.all([
					countEvents("usuario.criado"),
					countEvents("usuario.cor-ticket-alterada"),
					countEvents("usuario.ficou-feliz"),
				]);

			dispatchMetrics({
				type: "SET_MANY",
				payload: [
					{ metricNames: "colorChanges", value: colorsChangesCount },
					{ metricNames: "happy", value: usersHappyCount },
					{ metricNames: "users", value: createdUsersCount },
				],
			});
		}

		fetch();

		return () => {
			console.log("clean up");
		};
	}, []);

	const onMessageConsumed = async (id: string, message: Message) => {
		publish("messageConsumed", { id, message });
	};

	useSub<{ id: string; message: Message }>(
		"messageConsumed",
		async (data) => {
			const consumedEdge = edges.find((x) => x.id === data.id);
			const message = data.message;

			if (message.poisoned || !consumedEdge) return;

			await fetchNextMessage(message.name, consumedEdge);

			dispatchMetrics({
				type: "INCREASE",
				payload: { metricName: metricTopicsMap[message.name] },
			});
		},
		[edges],
	);

	const removeAllPoisonedMessages = useCallback(async () => {
		const poisonedEdges = edges.filter((edge) => {
			const message = edge.data?.message;

			return message?.poisoned === true;
		});

		for (const [index, edge] of poisonedEdges.entries()) {
			const message = edge.data?.message;
			if (!message?.name) continue;

			await fetchNextMessage(message.name, edge);
			await redelivery({ ...message, retryCount: message.retryCount + 1 });
			addMessageToRedelivery(message, (index + 1) * 80);
		}
	}, [edges]);

	const addMessageToRedelivery = useCallback((message: Message, y: number) => {
		const newNode = {
			id: message.time.toString(),
			position: { x: 50, y },
			data: {
				message,
			},
			parentNode: "redelivery-group",
			type: "message",
		};

		setNodes((nds) => nds.concat(newNode));
	}, []);

	const fetchNextMessage = useCallback(
		async (event: string, consumedEdge: Edge<EdgeData>) => {
			const nextMessage = await fetchEvent(event).next();

			if (nextMessage.value?.userid === undefined) return;
			const edge = createEdge(
				consumedEdge.id,
				consumedEdge.source,
				nextMessage,
			);

			setEdges((eds) => {
				return [...eds.filter((x) => x.id !== consumedEdge.id), edge];
			});
		},
		[consumeConfig],
	);

	const onAddConsumer = async () => {
		const id = getId();
		const queueNode = nodes.find((node) => node.id === consumeConfig.queue);
		const lastConsumer = nodes.findLast(
			(node) =>
				node.type === "consumer" && node.data.queueId === consumeConfig.queue,
		);
		const y = lastConsumer?.position
			? lastConsumer?.position?.y + 150
			: queueNode?.position.y ?? 0;

		const newNode = {
			id,
			position: { x: 700, y },
			data: {
				label: "Consumidor",
				queue: queueNode?.data.queue ?? "fila",
				queueId: consumeConfig.queue,
			},
			type: "consumer",
		};

		const message = await fetchEvent(queueNode?.data.queue).next();
		const newEdge = createEdge(id, consumeConfig.queue, message);

		setNodes((nds) => nds.concat(newNode));
		setEdges((eds) => eds.concat(newEdge));

		consumerPosition.current[consumeConfig.queue]++;
	};

	const onSelectQueueChanged = (queueName: string) => {
		dispatchConsumeConfig({
			type: "CHANGE_QUEUE",
			payload: { queueName },
		});
	};

	const onVelocityChanged = (value: string) => {
		dispatchConsumeConfig({
			type: "INCRESE_VELOCITY",
			payload: { velocity: Number(value) },
		});
	};

	const onConfigureSchedule = () => {
		removeAllPoisonedMessages();
	};

	return (
		<div className="mx-auto md:max-w-4xl lg:max-w-5xl w-full flex flex-col gap-10">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<MetricCard
					title="Usuários criados"
					value={metrics.users.toLocaleString("pt-BR")}
					subTitle="Funcionários assistindo o ArqTalk"
				/>
				<MetricCard
					title="Usuários felizes"
					value={metrics.happy.toLocaleString("pt-BR")}
					subTitle="Adoram confetes!"
				/>
				<MetricCard
					title="Mudanças de cores"
					value={metrics.colorChanges.toLocaleString("pt-BR")}
					subTitle="Não gostam de cinza"
				/>
			</div>

			<Separator />

			<div className="flex gap-4 justify-end">
				<Select
					onValueChange={onSelectQueueChanged}
					value={consumeConfig.queue}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Selecione uma fila" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Fila</SelectLabel>
							<SelectItem value="3">Usuário criado</SelectItem>
							<SelectItem value="4">Usuario ficou feliz</SelectItem>
							<SelectItem value="5">Cor ticket alterada</SelectItem>
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
			<div className="flex gap-4 justify-end">
				<Select
					onValueChange={onVelocityChanged}
					value={String(consumeConfig.velocity)}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Velocidade consumo" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Velocidade</SelectLabel>
							<SelectItem value="2">Muito rápido</SelectItem>
							<SelectItem value="3.2">Rápido</SelectItem>
							<SelectItem value="5">Lento</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>

				<Button variant={"outline"} onClick={onConfigureSchedule}>
					Configurar schedule
				</Button>
			</div>
		</div>
	);

	function createEdge(
		id: string,
		source: string,
		message: IteratorResult<
			{
				consumed: boolean;
				data: any;
				name: string;
				poisoned: boolean;
				retrycount: number;
				time: string;
				userid: number;
			} | null,
			void
		>,
	) {
		return {
			id,
			source,
			target: id,
			type: "messageQueue",
			data: {
				velocity: consumeConfig.velocity,
				message: toMessage({ message }),
				onMessageConsumed,
			},
		};
	}
}

function toMessage({ message }: { message: any }) {
	const event = message.value;
	if (event === null) return undefined;

	return {
		name: event.name,
		time: event.time,
		userid: event.userid,
		consumed: event.consumed,
		user: event.data?.name ?? "Usuário",
		poisoned: event.poisoned,
		inRedelivery: event.inRedelivery,
		inDeadLetter: event.inDeadLetter,
		retryCount: event.retryCount,
	};
}
