import { Dispatch, useCallback, useEffect, useState } from "react";
import {
	Button,
	Center,
	IconButton,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import { TrainingDataByEvent, TraingSetType } from "../type";

const getMasterData = async (): Promise<string[]> => {
    console.log(google)
	if (google && google.script && google.script.run) {
		return await new Promise((resolve, reject) => {
			google.script.run
				.withSuccessHandler((items: string[]) => {
					resolve(items);
				})
				.withFailureHandler((err) => {
					reject(err);
				})
				.getMasterData(); // スプレッドシートからデータを取得
		});
	} else {
		return ["チェストプレス", "レッグプレス"];
	}
};

const submitForm = async (
	data: TrainingDataByEvent
): Promise<"success" | "error"> => {
	if (google && google.script && google.script.run) {
		return await new Promise((resolve, reject) => {
			google.script.run
				.withSuccessHandler((response: string) => {
					if (response === "success") {
						resolve("success");
						// document.getElementById("myForm")?.reset(); // フォームをクリア
					} else {
						reject("error");
					}
				})
				.addData(data);
		});
	} else {
		return "success";
	}
};

function App() {
	const [TraingEvents, setTrainingEvents] = useState<string[]>([]);
	const [TraingData, setTrainingData] = useState<TrainingDataByEvent>({
		date: new Date().getDate().toString(),
		sets: [],
	});

	useEffect(() => {
		getMasterData().then((v) => {
			setTrainingEvents(v);
		});
	}, []);

	const addTrainingSet = useCallback(() => {
		setTrainingData({
			...TraingData,
			sets: [
				...TraingData.sets,
				{
					rep: 0,
					set: 1,
					weight: 0,
				},
			],
		});
	}, [TraingData]);

	const toast = useToast();

	return (
		<Center w="100dvw" h="100dvh">
			<div
			// style={{ background: "#333", borderRadius: "1em", padding: "1em" }}
			>
				<div
					style={{
						// background: "red",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<Input
						type="date"
						onChange={(v) => {
							setTrainingData({
								...TraingData,
								date: v.target.value,
							});
						}}
					/>
					<Select
						value={TraingData.event}
						onChange={(v) => {
							setTrainingData({
								...TraingData,
								event: v.target.value,
							});
						}}
					>
						{TraingEvents.map((t) => (
							<option key={t}>{t}</option>
						))}
					</Select>
				</div>
				<div>
					<Table style={{ borderWidth: "1px", borderColor: "white" }}>
						<Thead>
							<Tr>
								<Th>重量</Th>
								<Th>回数</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody>
							{TraingData.sets.map((set, i) => {
								return (
									<TrainingSet
										key={i}
										data={set}
										seTdata={(data) => {
											setTrainingData({
												...TraingData,
												sets: TraingData.sets.map(
													(_s, _i) => {
														if (_i !== i) return _s;
														return data;
													}
												),
											});
										}}
										onClickDelete={() => {
											setTrainingData({
												...TraingData,
												sets: TraingData.sets.filter(
													(_s, _i) => _i !== i
												),
											});
										}}
									/>
								);
							})}
							<Tr>
								<Td></Td>
								<Td></Td>
								<Td p={1}>
									<Button size="sm" onClick={addTrainingSet}>
										+
									</Button>
								</Td>
							</Tr>
						</Tbody>
					</Table>
				</div>
				<Button
					onClick={async () => {
						const r = await submitForm(TraingData);
						if (r === "success") {
							toast({ title: "成功", status: "success" });
							setTrainingData({ ...TraingData, sets: [] });
						} else {
							toast({ title: "失敗", status: "error" });
						}
					}}
				>
					送信
				</Button>
			</div>
		</Center>
	);
}

const TrainingSet = ({
	data,
	seTdata,
	onClickDelete,
}: {
	data: TraingSetType;
	seTdata: Dispatch<TraingSetType>;
	onClickDelete: () => void;
}) => {
	return (
		<Tr
			sx={{
				"> td": {
					px: 1,
					py: 2,
				},
			}}
		>
			<Td p={1}>
				<Input
					w="auto"
					type="number"
					value={data.weight}
					onChange={(v) => {
						seTdata({
							...data,
							weight: Number(v.target.value),
						});
					}}
				/>
			</Td>
			<Td>
				<NumberInput
					value={data.rep}
					onChange={(v) => {
						seTdata({
							...data,
							rep: Number(v),
						});
					}}
					// min={0}
				>
					<NumberInputField step={1} />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</Td>
			<Td>
				<IconButton
					size="sm"
					onClick={onClickDelete}
					icon={<p>-</p>}
					aria-label={""}
				/>
			</Td>
		</Tr>
	);
};

export default App;
