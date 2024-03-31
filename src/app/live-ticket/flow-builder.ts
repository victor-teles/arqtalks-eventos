import type { Message } from "@/lib/bus/message";
import { type ConsumerKey, newKey } from "@/lib/bus/use-messaging";
import { nanoid } from "nanoid";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import type { Edge, Node, XYPosition } from "reactflow";

export type EdgeData = { message?: Message };

export function useFlowBuilder(
	nodes: Node<any, string | undefined>[],
	edges: Edge<EdgeData>[],
	setNodes: Dispatch<SetStateAction<Node<any, string | undefined>[]>>,
	setEdges: Dispatch<SetStateAction<Edge<EdgeData>[]>>,
) {
	const messagesInRedelivery =
		nodes.filter((n) => n.parentNode === "redelivery-group")?.length ?? 0;
	const messagesInDeadLetter =
		nodes.filter((n) => n.parentNode === "dead-letter-group")?.length ?? 0;

	const getConsumerPosition = (
		topic: string,
		node: Node<any, string | undefined> | undefined,
	): XYPosition => {
		const lastConsumer = nodes?.findLast(
			(node) => node.type === "consumer" && node.data.topic === topic,
		);
		const y = lastConsumer?.position
			? lastConsumer?.position?.y + 150
			: node?.position.y ?? 0;

		return { x: 700, y };
	};

	function addConsumerNode(topic: string): {
		id: string;
		consumerKey: ConsumerKey;
	} {
		const sourceNode = nodes.find((node) => node.id === topic);
		const id = nanoid();
		const consumerKey = newKey(topic);

		const node = {
			id,
			position: getConsumerPosition(topic, sourceNode),
			data: {
				label: "Consumidor",
				queue: topic ?? "fila",
				topic,
				consumerKey,
			},
			type: "consumer",
		};

		setNodes((nds) => nds.concat(node));

		return { id, consumerKey };
	}

	function addConsumerEdge(source: string, target: string, data: any): void {
		const edge = createEdge(source, target, data);
		setEdges((eds) => eds.concat(edge));
	}

	const addMessageToDeadLetter = useCallback((message: Message) => {
		const newNode = {
			id: message.time.toString(),
			position: { x: 50, y: (messagesInDeadLetter + 1) * 80 },
			data: {
				message,
				count: false,
			},
			parentNode: "dead-letter-group",
			type: "message",
		};

		setNodes((nds) => nds.concat(newNode));
	}, []);

	const removeMessageFromRedelivery = useCallback(
		async (id: string, message: Message) => {
			// await redelivery({
			// 	...message,
			// 	inRedelivery: false,
			// });
			setNodes((nds) => nds.filter((n) => n.id !== id));
		},
		[],
	);

	const addMessageToRedelivery = useCallback((message: Message, y: number) => {
		const newNode = {
			id: message.time.toString(),
			position: { x: 50, y },
			data: {
				count: true,
				message,
				onMessageScheduleFinished: removeMessageFromRedelivery,
			},
			parentNode: "redelivery-group",
			type: "message",
		};

		setNodes((nds) => nds.concat(newNode));
	}, []);

	function createEdge(source: string, target: string, data: any) {
		return {
			id: nanoid(),
			source,
			target,
			type: "messageQueue",
			data,
		};
	}

	function addMessage(edgeId: string, message: Message | null): void {}

	return {
		messagesInRedelivery,
		messagesInDeadLetter,
		createEdge,
		addConsumerNode,
		addConsumerEdge,
		addMessage,
		addMessageToDeadLetter,
		addMessageToRedelivery,
	};
}
