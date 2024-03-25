export type Message = {
	name: string;
	time: Date;
	userid: number;
	consumed: boolean;
	user: string;
	poisoned: boolean;
	inRedelivery: boolean;
	inDeadLetter: boolean;
	retryCount: number;
};
