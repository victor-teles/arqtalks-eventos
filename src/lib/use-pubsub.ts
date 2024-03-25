import { EventEmitter } from "eventemitter3";
import { useEffect } from "react";

const emitter = new EventEmitter();

type DependencyList = readonly unknown[];

export const useSub = <T>(
	event: string,
	callback: (data: T) => void,
	deps: DependencyList,
) => {
	const unsubscribe = () => {
		emitter.off(event, callback);
	};

	useEffect(() => {
		emitter.on(event, callback);
		return unsubscribe;
	}, deps);

	return unsubscribe;
};

export const usePub = <T>() => {
	return (event: string, data: T) => {
		emitter.emit(event, data);
	};
};
