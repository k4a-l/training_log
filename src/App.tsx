import { Dispatch, useCallback, useEffect, useState } from "react";
import {
	Button,
	Center,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Spinner,
	Stack,
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
	if (typeof google !== "undefined" && google.script && google.script.run) {
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
): Promise<"success" | string> => {
	if (typeof google !== "undefined" && google.script && google.script.run) {
		return new Promise((resolve) => {
			google.script.run
				.withSuccessHandler((r: string) => {
					console.log("success", r);
					if (r === "success") {
						resolve("success");
					} else {
						resolve(r);
					}
				})
				.withFailureHandler((e) => {
					console.log("error", e);
					resolve(String(e));
				})
				.addData(data);
		});
	} else {
		return "success";
	}
};

function App() {
	const [traingEvents, setTrainingEvents] = useState<string[]>([]);
	const [traingData, setTrainingData] = useState<TrainingDataByEvent>({
		date: new Date().getDate().toString(),
		sets: [{ rep: 10, weight: 0 }],
	});

	useEffect(() => {
		getMasterData().then((v) => {
			setTrainingEvents(v);
		});
	}, []);

	const addTrainingSet = useCallback(() => {
		setTrainingData({
			...traingData,
			sets: [
				...traingData.sets,
				{
					rep: 10,
					weight: 0,
				},
			],
		});
	}, [traingData]);

	const toast = useToast();

	if (traingEvents.length === 0) {
		return <Spinner />;
	}

	return (
		<Center w="100dvw" h="100dvh">
			<Stack>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<Input
						type="date"
						onChange={(v) => {
							setTrainingData({
								...traingData,
								date: v.target.value,
							});
						}}
					/>
					<Select
						value={traingData.event}
						onChange={(v) => {
							setTrainingData({
								...traingData,
								event: v.target.value,
							});
						}}
					>
						{traingEvents.map((t) => (
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
								<Th>メモ</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody>
							{traingData.sets.map((set, i) => {
								return (
									<TrainingSet
										key={i}
										data={set}
										seTdata={(data) => {
											setTrainingData({
												...traingData,
												sets: traingData.sets.map(
													(_s, _i) => {
														if (_i !== i) return _s;
														return data;
													}
												),
											});
										}}
										onClickDelete={() => {
											setTrainingData({
												...traingData,
												sets: traingData.sets.filter(
													(_s, _i) => _i !== i
												),
											});
										}}
									/>
								);
							})}
							<Tr
								sx={{
									"> td": { px: 1, py: 2 },
								}}
							>
								<Td>
									<Input visibility={"hidden"} />
								</Td>
								<Td>
									<Input visibility={"hidden"} />
								</Td>
								<Td>
									<Input visibility={"hidden"} />
								</Td>
								<Td p={1}>
									<Button size="sm" onClick={addTrainingSet}>
										+
									</Button>
								</Td>
							</Tr>
						</Tbody>
					</Table>
				</div>
				<FormControl>
					<FormLabel fontSize={"sm"}>メモ</FormLabel>
					<Input
						value={traingData.memo}
						onChange={(v) => {
							setTrainingData({
								...traingData,
								memo: v.target.value,
							});
						}}
					></Input>
				</FormControl>
				<HStack justifyContent={"end"}>
					<Button
						onClick={async () => {
							const r = await submitForm(traingData);
							if (r === "success") {
								toast({ title: "成功", status: "success" });
								setTrainingData({
									...traingData,
									sets: [],
									memo: "",
								});
							} else {
								toast({
									title: "失敗",
									status: "error",
									description: r,
								});
							}
						}}
					>
						送信
					</Button>
				</HStack>
			</Stack>
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
				"> td": { px: 1, py: 2 },
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
				>
					<NumberInputField step={1} />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</Td>
			<Td>
				<Input
					value={data.memo}
					onChange={(v) => {
						seTdata({
							...data,
							memo: v.target.value,
						});
					}}
				></Input>
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
