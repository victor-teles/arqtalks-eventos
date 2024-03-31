"use client";

import MetricCard from "@/components/metric-card";
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
import broker from "@/lib/bus/broker";
import type { Message } from "@/lib/bus/message";
import useMessaging, { type ConsumerKey } from "@/lib/bus/use-messaging";
import { getMetrics, updateMetrics } from "@/lib/db";
import { usePub, useSub } from "@/lib/use-pubsub";
import { useCallback, useEffect, useReducer, useRef } from "react";
import ReactFlow, {
	Background,
	useEdgesState,
	useNodesState,
	type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { type EdgeData, useFlowBuilder } from "./flow-builder";
import {
	edgeTypes,
	initialEdges,
	initialNodes,
	nodeTypes,
} from "./flow-config";
import {
	type MetricsState,
	reducerConsumeConfig,
	reducerMetrics,
} from "./reducers";

export default function LiveTicket() {
	const messaging = useMessaging(broker);
	const publish = usePub();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] =
		useEdgesState<EdgeData>(initialEdges);
	const flowBuilder = useFlowBuilder(nodes, edges, setNodes, setEdges);

	const [consumeConfig, dispatchConsumeConfig] = useReducer(
		reducerConsumeConfig,
		{
			queue: "usuario.criado",
			velocity: 3.2,
			scheduleConfigured: false,
		},
	);

	const [metrics, dispatchMetrics] = useReducer(reducerMetrics, {
		"usuario.criado": 0,
		"usuario.cor-ticket-alterada": 0,
		"usuario.ficou-feliz": 0,
	});

	useEffect(() => {
		async function fetch() {
			const metrics = await getMetrics();

			dispatchMetrics({
				type: "SET_MANY",
				payload: [
					{
						metricNames: "usuario.cor-ticket-alterada",
						value: metrics.colorChanges,
					},
					{ metricNames: "usuario.criado", value: metrics.happy },
					{ metricNames: "usuario.ficou-feliz", value: metrics.users },
				],
			});
		}

		fetch();

		return () => {
			console.log("clean up");
		};
	}, []);

	useEffect(() => {
		updateMetrics({
			colorChanges: metrics["usuario.cor-ticket-alterada"],
			users: metrics["usuario.criado"],
			happy: metrics["usuario.ficou-feliz"],
		});
	}, [metrics]);

	const onMessageConsumed = async (id: string, message: Message) => {
		publish("messageConsumed", { id, message });
	};

	useSub<{ id: string; message: Message }>(
		"messageConsumed",
		async (data) => {
			const consumedEdge = edges.find((x) => x.id === data.id);
			const message = consumedEdge?.data?.message;
			if (!consumedEdge || !message) return;

			const node = nodes.find((node) => node.id === consumedEdge.target);
			if (!node) return;
			const consumerKey = node.data.consumerKey as ConsumerKey;

			if (message.poisoned) {
				if (message.retryCount >= 3) {
					await messaging.sendToDeadLetter(consumerKey);
					flowBuilder.addMessageToDeadLetter(message);
					await fetchNextMessages([consumedEdge]);
					return;
				}
				if (consumeConfig.scheduleConfigured) {
					await scheduleMessages(
						[consumedEdge],
						flowBuilder.messagesInRedelivery + 1,
					);
					await fetchNextMessages([consumedEdge]);
				}

				return;
			}

			await messaging.consume(consumerKey);
			dispatchMetrics({
				type: "INCREASE",
				payload: { metricName: message.name as keyof MetricsState },
			});

			await fetchNextMessages([consumedEdge]);
		},
		[edges, consumeConfig, nodes],
	);

	const onAddConsumer = async () => {
		const { id, consumerKey } = flowBuilder.addConsumerNode(
			consumeConfig.queue,
		);
		messaging.addConsumer(consumerKey);

		const message = await messaging.fetchNext(consumerKey);

		flowBuilder.addConsumerEdge(consumeConfig.queue, id, {
			velocity: consumeConfig.velocity,
			message,
			onMessageConsumed,
		});
	};

	const fetchNextMessages = useCallback(
		async (consumedEdges: Edge<EdgeData>[]) => {
			const createdEdges: Edge<EdgeData>[] = [];

			for (const edge of consumedEdges) {
				const message = edge?.data?.message;
				if (!message?.name) continue;

				const consumerNode = nodes.find((node) => node.id === edge.target);
				const consumerKey = consumerNode?.data.consumerKey as ConsumerKey;

				const nextMessage = await messaging.fetchNext(consumerKey);

				const createdEdge = flowBuilder.createEdge(edge.source, edge.target, {
					velocity: consumeConfig.velocity,
					message: nextMessage,
					onMessageConsumed,
				});
				createdEdges.push(createdEdge);
			}

			setEdges((eds) => {
				return [
					...eds.filter((x) => !consumedEdges.find((y) => y.id === x.id)),
					...createdEdges,
				];
			});
		},
		[consumeConfig, nodes],
	);

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

	const cleanUpPoisonedMessages = useCallback(async () => {
		const poisonedEdges = edges.filter((edge) => {
			const message = edge.data?.message;

			return message?.poisoned === true;
		});

		await scheduleMessages(poisonedEdges);
		await fetchNextMessages(poisonedEdges);
	}, [edges]);

	const scheduleMessages = useCallback(
		async (consumedEdges: Edge<EdgeData>[], elements = 0) => {
			for (const [index, edge] of consumedEdges.entries()) {
				const message = edge.data?.message;
				if (!message?.name) continue;
				const node = nodes.find((node) => node.id === edge.target);
				const consumerKey = node?.data.consumerKey as ConsumerKey;

				await messaging.schedule(consumerKey);

				flowBuilder.addMessageToRedelivery(
					message,
					(elements || index + 1) * 80,
				);
			}
		},
		[consumeConfig],
	);

	const onConfigureSchedule = () => {
		dispatchConsumeConfig({
			type: "ENABLE_SCHEDULE",
			payload: { scheduleConfigured: true },
		});

		cleanUpPoisonedMessages();
	};

	return (
		<div className="mx-auto md:max-w-4xl lg:max-w-5xl w-full flex flex-col gap-10">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<MetricCard
					title="Usuários criados"
					value={metrics["usuario.criado"].toLocaleString("pt-BR")}
					subTitle="Funcionários assistindo o ArqTalk"
				/>
				<MetricCard
					title="Usuários felizes"
					value={metrics["usuario.ficou-feliz"].toLocaleString("pt-BR")}
					subTitle="Adoram confetes!"
				/>
				<MetricCard
					title="Mudanças de cores"
					value={metrics["usuario.cor-ticket-alterada"].toLocaleString("pt-BR")}
					subTitle="Não gostam de cinza"
				/>
			</div>

			<Separator />

			<div className="flex gap-4 justify-between">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 self-start">
					Diagrama interativo
				</h2>
				<div className="flex gap-4">
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
								<SelectItem value="usuario.criado">Usuário criado</SelectItem>
								<SelectItem value="usuario.ficou-feliz">
									Usuario ficou feliz
								</SelectItem>
								<SelectItem value="usuario.cor-ticket-alterada">
									Cor ticket alterada
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button onClick={onAddConsumer}>Adicionar consumidor</Button>
				</div>
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
}
