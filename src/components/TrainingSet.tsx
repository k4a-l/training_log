import { CloseIcon } from "@chakra-ui/icons";
import {
	Tr,
	Td,
	Input,
	NumberInput,
	IconButton,
	useNumberInput,
	Button,
	HStack,
} from "@chakra-ui/react";
import { ComponentProps, Dispatch, forwardRef } from "react";

import { NumberInputFieldFixed, NumberInputFixed } from "./Parts";
import { TraingSetType } from "../../type";

export const TrainingSet = ({
	data,
	setData,
	onClickDelete,
}: {
	data: TraingSetType;
	setData: Dispatch<TraingSetType>;
	onClickDelete: () => void;
}) => {
	return (
		<Tr
			sx={{
				"> td": { px: 1, py: 2 },
			}}
		>
			<Td p={1}>
				<NumberInput>
					<NumberInputFieldFixed
						w="4em"
						sx={{
							paddingInlineEnd: "var(--input-padding)",
						}}
						step={1}
						min={0}
						value={data.weight}
						onChange={(v) => {
							setData({
								...data,
								weight: v,
							});
						}}
					/>
				</NumberInput>
			</Td>
			<Td>
				<NumberInput>
					<MobileSpinner
						w="4em"
						sx={{
							paddingInlineEnd: "var(--input-padding)",
						}}
						value={data.rep}
						onChange={(v) => {
							setData({
								...data,
								rep: v,
							});
						}}
					/>
				</NumberInput>
			</Td>
			<Td>
				<Input
					value={data.memo}
					onChange={(v) => {
						setData({
							...data,
							memo: v.target.value,
						});
					}}
				></Input>
			</Td>
			<Td pr={0}>
				<HStack justifyContent={"end"}>
					<IconButton
						variant={"ghost"}
						onClick={() => {
							if (
								window.confirm(
									"このセットを削除してよいですか？"
								)
							) {
								onClickDelete();
							}
						}}
						icon={<CloseIcon w="0.5em" />}
						aria-label={""}
					/>
				</HStack>
			</Td>
		</Tr>
	);
};

const MobileSpinner = forwardRef(
	(props: ComponentProps<typeof NumberInputFixed>, ref) => {
		const {
			getInputProps,
			getIncrementButtonProps,
			getDecrementButtonProps,
		} = useNumberInput({
			value: props.value,
			step: 1,
			min: 0,
			onChange: (_s, n) => {
				props.onChange(n);
			},
			precision: 0,
		});

		const inc = getIncrementButtonProps();
		const dec = getDecrementButtonProps();
		const input = getInputProps();

		return (
			<HStack spacing={0}>
				<Button {...dec} borderRightRadius={0}>
					-
				</Button>
				<NumberInputFixed
					{...props}
					{...input}
					borderRadius={"0"}
					ref={ref}
					value={props.value}
					onChange={(v) => {
						props.onChange(v);
					}}
				/>
				<Button {...inc} borderLeftRadius={0}>
					+
				</Button>
			</HStack>
		);
	}
);
