import { TrainingDataByEvent } from "../type";

export function doGet() {
	return HtmlService.createHtmlOutputFromFile("hosting/index.html")
		.addMetaTag("viewport", "width=device-width, initial-scale=1")
		.setTitle("筋トレ記録");
}

export function addData(form: TrainingDataByEvent) {
	try {
		const activeSpreadSheet = SpreadsheetApp.openById(
			"15I8IJIEOThHoLQvjDjSHi7-bNYgOtJHXvZwc017pcoI"
		);
		const sheet = activeSpreadSheet.getSheetByName("筋力");
		const data = form.date;
		sheet.appendRow([data]);

		return "success"; // 成功した場合は 'success' を返す
	} catch (e) {
		return "error"; // 失敗した場合は 'error' を返す
	}
}

// スプレッドシートからマスタデータを取得する関数
export function getMasterData() {
	const ss = SpreadsheetApp.openById(
		"15I8IJIEOThHoLQvjDjSHi7-bNYgOtJHXvZwc017pcoI"
	);
	// 筋トレ種目シートを取得
	const sheet = ss.getSheetByName("筋トレ種目");
	const lastRow = sheet.getLastRow();

	// 筋トレ種目シートからデータを取得
	const choices = [];
	const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues(); // A列の種目名を取得

	// 選択肢のリストを作成
	for (let i = 0; i < data.length; i++) {
		choices.push(data[i][0]);
	}

	return choices; // 配列として返す
}
