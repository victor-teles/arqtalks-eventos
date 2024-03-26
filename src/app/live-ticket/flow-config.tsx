"use client";

import AnimatedEdge from "@/components/react-flow/animated-edge";
import appNode from "@/components/react-flow/app-node";
import ConsumerNode from "@/components/react-flow/consumer-node";
import MessageNode from "@/components/react-flow/message-node";
import MessageQueueEdge from "@/components/react-flow/message-queue-edge";
import QueueNode from "@/components/react-flow/queue-node";
import ServiceBusNode from "@/components/react-flow/service-bus-node";

export const nodeTypes = {
	queue: QueueNode,
	consumer: ConsumerNode,
	serviceBus: ServiceBusNode,
	app: appNode,
	message: MessageNode,
};

export const edgeTypes = {
	messageQueue: MessageQueueEdge,
	animated: AnimatedEdge,
};

export const initialNodes: any = [
	{
		id: "1",
		type: "app",
		data: { label: "API Ticket", queue: "Publicador" },
		position: { x: -1000, y: 500 },
	},
	{
		id: "2",
		type: "serviceBus",
		position: { x: -500, y: 500 },
	},
	{
		id: "3",
		data: { label: "Usuario criado", queue: "usuario.criado" },
		position: { x: 0, y: 0 },
		type: "queue",
	},
	{
		id: "4",
		data: { label: "Usuario ficou feliz", queue: "usuario.ficou-feliz" },
		position: { x: 0, y: 500 },
		type: "queue",
	},
	{
		id: "5",
		data: {
			label: "Cor ticket alterada",
			queue: "usuario.cor-ticket-alterada",
		},
		position: { x: 0, y: 1000 },
		type: "queue",
	},
	{
		id: "redelivery-group",
		data: { label: "Espaço agendamento 🔂 (schedule) " },
		position: {
			x: 1000,
			y: 0,
		},
		className: "!text-white font-bold !text-xl",
		style: {
			backgroundColor: "rgba(255, 0, 0, 0.1)",
			width: 300,
			height: 2000,
		},
	},
	{
		id: "dead-letter-group",
		data: { label: "Espaço Dead Letter 💀" },
		position: {
			x: 1400,
			y: 0,
		},
		className: "!text-white font-bold !text-xl",
		style: {
			backgroundColor: "rgba(255, 0, 0, 0.1)",
			width: 300,
			height: 2000,
		},
	},
];
export const initialEdges = [
	{
		id: "animated-1",
		source: "1",
		target: "2",
		type: "animated",
		data: {},
	},
	{
		id: "animated-2",
		source: "2",
		target: "3",
		type: "animated",
		data: {},
	},
	{
		id: "animated-3",
		source: "2",
		target: "4",
		type: "animated",
		data: {},
	},
	{
		id: "animated-4",
		source: "2",
		target: "5",
		type: "animated",
		data: {},
	},
];
