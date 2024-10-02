export type TraingSetType = { weight: number; rep: number; set: number };

export type TrainingDataByEvent = {
	date: string;
	event?: string;
	sets: TraingSetType[];
};
