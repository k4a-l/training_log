import {
	Tr,
	Td,
	Input,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	IconButton,
} from "@chakra-ui/react";
import { Dispatch } from "react";

import { TraingSetType } from "../../type";

export const TrainingSet = ({
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
