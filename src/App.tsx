import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	Spinner,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Textarea,
	Th,
	Thead,
	Tr,
	useBoolean,
	useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

import { TrainingDataByEvent } from "../type";
import { TrainingSet } from "./components/TrainingSet";

const sleep = (time: number) =>
	new Promise((resolve) => setTimeout(resolve, time)); //timeはミリ秒

const traingDataSchema = z.object({
	date: z.string(),
	event: z.string(),
	sets: z
		.array(
			z.object({
				weight: z.number(),
				rep: z.number(),
				memo: z.string().optional(),
			})
		)
		.min(1),
	memo: z.string().optional(),
}) satisfies z.ZodType<TrainingDataByEvent>;

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
		await sleep(1000);
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
					if (r === "success") {
						resolve("success");
					} else {
						resolve(r);
					}
				})
				.withFailureHandler((e) => {
					resolve(String(e));
				})
				.addData(data);
		});
	} else {
		await sleep(1000);
		return "success";
	}
};

const createDefaltTrainingData = (): TrainingDataByEvent => {
	return {
		date: new Date().toLocaleDateString("sv-SE"),
		// event: events[0],
		sets: [{ rep: 10, weight: 0 }],
	};
};

const App = ({ traingEvents }: { traingEvents: string[] }) => {
	const [isSending, setIsSending] = useBoolean(false);
	const [traingData, setTrainingData] = useState<TrainingDataByEvent>(
		createDefaltTrainingData()
	);

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

	return (
		<Stack
			spacing={10}
			borderColor={"gray.200"}
			borderWidth={1}
			p={4}
			borderRadius={5}
		>
			<Stack>
				<HStack
					style={{
						justifyContent: "space-between",
					}}
				>
					<Input
						type="date"
						value={traingData.date}
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
						<option></option>
						{traingEvents.map((t) => (
							<option key={t}>{t}</option>
						))}
					</Select>
				</HStack>
				<Stack borderWidth={1} borderRadius={4} p={1}>
					<Table style={{ borderWidth: "1px", borderColor: "white" }}>
						<Thead>
							<Tr>
								<Th w="6em" whiteSpace={"nowrap"}>
									重量
								</Th>
								<Th w="12em" whiteSpace={"nowrap"}>
									回数
								</Th>
								<Th w="15em">メモ</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody>
							{traingData.sets.map((set, i) => {
								return (
									<TrainingSet
										key={i}
										data={set}
										setData={(data) => {
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
								<Td colSpan={4}>
									<Button
										size="sm"
										onClick={addTrainingSet}
										w={"full"}
									>
										追加
									</Button>
								</Td>
							</Tr>
						</Tbody>
					</Table>
				</Stack>
				<FormControl>
					<FormLabel fontSize={"sm"}>メモ</FormLabel>
					<Textarea
						value={traingData.memo}
						onChange={(v) => {
							setTrainingData({
								...traingData,
								memo: v.target.value,
							});
						}}
					/>
				</FormControl>
			</Stack>
			<HStack justifyContent={"space-between"}>
				<Button
					variant={"ghost"}
					fontSize={"sm"}
					onClick={() => {
						if (window.confirm("入力内容をリセットします")) {
							setTrainingData(createDefaltTrainingData());
						}
					}}
				>
					リセット
				</Button>
				<Button
					colorScheme="blue"
					variant={"outline"}
					w="8em"
					isLoading={isSending}
					onClick={async () => {
						const parseResult =
							traingDataSchema.safeParse(traingData);

						if (parseResult.error) {
							toast({
								title: "データが不正です",
								status: "warning",
								description: (
									<Text whiteSpace={"pre"}>
										{JSON.stringify(
											parseResult.error.flatten()
												.fieldErrors,
											null,
											2
										)}
									</Text>
								),
							});
							return;
						}

						setIsSending.on();
						const r = await submitForm(parseResult.data);
						if (r === "success") {
							toast({ title: "成功", status: "success" });
							setTrainingData(createDefaltTrainingData());
						} else {
							toast({
								title: "失敗",
								status: "error",
								description: r,
							});
						}
						setIsSending.off();
					}}
				>
					送信
				</Button>
			</HStack>
		</Stack>
	);
};

const AppWithFetch = () => {
	const [traingEvents, setTrainingEvents] = useState<string[]>([]);

	useEffect(() => {
		getMasterData().then((v) => {
			setTrainingEvents(v);
		});
	}, []);

	return (
		<Stack w="100dvw" h="100dvh" alignItems={"center"} pt={"10em"}>
			{traingEvents.length === 0 ? (
				<HStack>
					<Text>データ取得中</Text>
					<Spinner />
				</HStack>
			) : (
				<App traingEvents={traingEvents} />
			)}
		</Stack>
	);
};

export default AppWithFetch;
