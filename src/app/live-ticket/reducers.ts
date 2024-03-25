enum ConsumeConfigKind {
	CHANGE_QUEUE = "CHANGE_QUEUE",
	INCRESE_VELOCITY = "INCRESE_VELOCITY",
}

type ConsumeConfigState = {
	queue: string;
	velocity: number;
};

type ConsumeConfigAction =
	| {
			type: "CHANGE_QUEUE";
			payload: { queueName: string };
	  }
	| {
			type: "INCRESE_VELOCITY";
			payload: { velocity: number };
	  };

export function reducerConsumeConfig(
	state: ConsumeConfigState,
	action: ConsumeConfigAction,
): ConsumeConfigState {
	const { type, payload } = action;
	switch (type) {
		case ConsumeConfigKind.CHANGE_QUEUE:
			return {
				...state,
				queue: payload.queueName,
			};
		case ConsumeConfigKind.INCRESE_VELOCITY:
			return {
				...state,
				velocity: payload.velocity,
			};
		default:
			return state;
	}
}

enum MetricsKind {
	INCREASE = "INCREASE",
	SET_MANY = "SET_MANY",
}

type MetricsState = {
	happy: number;
	colorChanges: number;
	users: number;
};

export type MetricTopic = { [key: string]: keyof MetricsState };

type MetricsAction =
	| {
			type: "INCREASE";
			payload: { metricName: keyof MetricsState };
	  }
	| {
			type: "SET_MANY";
			payload: { metricNames: keyof MetricsState; value: number }[];
	  };

export function reducerMetrics(
	state: MetricsState,
	action: MetricsAction,
): MetricsState {
	const { type, payload } = action;
	switch (type) {
		case MetricsKind.INCREASE:
			return {
				...state,
				[payload.metricName]: state[payload.metricName] + 1,
			};
		case MetricsKind.SET_MANY:
			for (const metric of payload) {
				state[metric.metricNames] = metric.value;
			}

			return {
				...state,
			};
		default:
			return state;
	}
}
