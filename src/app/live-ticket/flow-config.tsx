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
		id: "api-ticket",
		type: "app",
		data: { label: "API Ticket", queue: "Publicador" },
		position: { x: -1000, y: 500 },
	},
	{
		id: "service-bus",
		type: "serviceBus",
		position: { x: -500, y: 500 },
	},
	{
		id: "usuario.criado",
		data: { label: "Usuario criado" },
		position: { x: 0, y: 0 },
		type: "queue",
	},
	{
		id: "usuario.ficou-feliz",
		data: { label: "Usuario ficou feliz" },
		position: { x: 0, y: 500 },
		type: "queue",
	},
	{
		id: "usuario.cor-ticket-alterada",
		data: {
			label: "Cor ticket alterada",
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
		source: "api-ticket",
		target: "service-bus",
		type: "animated",
		data: {},
	},
	{
		id: "animated-2",
		source: "service-bus",
		target: "usuario.criado",
		type: "animated",
		data: {},
	},
	{
		id: "animated-3",
		source: "service-bus",
		target: "usuario.ficou-feliz",
		type: "animated",
		data: {},
	},
	{
		id: "animated-4",
		source: "service-bus",
		target: "usuario.cor-ticket-alterada",
		type: "animated",
		data: {},
	},
];
