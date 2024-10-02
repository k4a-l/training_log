/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace google {
	namespace script {
		interface Run {
			withSuccessHandler(callback: (response: any) => void): this;
			withFailureHandler(callback: (error: any) => void): this;
			doSomething(): void; // Apps Scriptで定義した関数
			// 他のサーバーサイドの関数もここで定義できます
			addData(data: import("../type").TrainingDataByEvent): void;
			getMasterData(): string[];
		}

		const run: Run;
	}
}

declare namespace GoogleAppsScript {
	interface HtmlOutput {
		getContent(): string;
		setContent(content: string): HtmlOutput;
		setTitle(title: string): HtmlOutput;
		setSandboxMode(mode: string): HtmlOutput;
	}

	interface HtmlService {
		createHtmlOutputFromFile(filename: string): HtmlOutput;
	}

	interface SpreadsheetApp {
		openById(id: string): any;
	}
}

declare const HtmlService: GoogleAppsScript.HtmlService;

declare const SpreadsheetApp: GoogleAppsScript.SpreadsheetApp;
