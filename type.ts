export type TraingSetType = { weight: number; rep: number; memo?: string };

export type TrainingDataByEvent = {
	date: string;
	event?: string;
	sets: TraingSetType[];
	memo?: string;
};
