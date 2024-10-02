import { TrainingDataByEvent } from "../type";
import "../src/google.script";

export function doGet() {
	return (
		HtmlService.createHtmlOutputFromFile("hosting/index.html")
			// .addMetaTag("viewport", "width=device-width, initial-scale=1")
			.setTitle("筋トレ記録")
	);
}

export function addData(form: TrainingDataByEvent) {
	try {
		const activeSpreadSheet = SpreadsheetApp.openById(
			"15I8IJIEOThHoLQvjDjSHi7-bNYgOtJHXvZwc017pcoI"
		);
		const sheet = activeSpreadSheet.getSheetByName("筋力");

		if (form.sets.length === 0) {
			return "セット数が0です";
		}
		const values = form.sets.map((set) => [
			form.date,
			form.event,
			set.weight,
			set.rep,
			form.memo ? form.memo + (set.memo ? " / " + set.memo : "") : "",
		]);
		sheet.insertRowsBefore(2, values.length);
		sheet.getRange(2, 1, values.length, values[0].length).setValues(values);

		return "success"; // 成功した場合は 'success' を返す
	} catch (e) {
		return String(e); // 失敗した場合は 'error' を返す
	}
}

// スプレッドシートからマスタデータを取得する関数
export function getMasterData(): string[] {
	const ss = SpreadsheetApp.openById(
		"15I8IJIEOThHoLQvjDjSHi7-bNYgOtJHXvZwc017pcoI"
	);
	// 筋トレ種目シートを取得
	const sheet = ss.getSheetByName("筋トレ種目");
	const lastRow = sheet.getLastRow();

	// 筋トレ種目シートからデータを取得
	const choices: string[] = [];
	const data: string[][] = sheet.getRange(2, 1, lastRow - 1, 1).getValues(); // A列の種目名を取得

	// 選択肢のリストを作成
	for (let i = 0; i < data.length; i++) {
		choices.push(data[i][0]);
	}

	return choices; // 配列として返す
}
