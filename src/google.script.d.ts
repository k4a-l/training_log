

/* eslint-disable @typescript-eslint/no-explicit-any */
// google.script.d.ts
declare namespace google {
	namespace script {
		interface Run {
			withSuccessHandler(callback: (response: any) => void): this;
			withFailureHandler(callback: (error: any) => void): this;
			doSomething(): void; // Apps Scriptで定義した関数
			// 他のサーバーサイドの関数もここで定義できます
			addData(data: TrainingDataByEvent): void;
			getMasterData(): string[];
		}

		const run: Run;
	}
}
