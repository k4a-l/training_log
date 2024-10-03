import {
	Input,
	InputProps,
	NumberInputField,
	NumberInputFieldProps,
} from "@chakra-ui/react";
import { Dispatch, forwardRef, useEffect, useState } from "react";

export const NumberInputFixed = forwardRef(
	(
		props: Omit<InputProps, "onChange" | "value"> & {
			onChange: Dispatch<number>;
			value: number;
		},
		ref
	) => {
		const { value, onChange } = props;
		const [valueString, setValueString] = useState(String(value));

		useEffect(() => {
			if (valueString !== String(value)) {
				setValueString(String(value));
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [value]);

		return (
			<Input
				{...props}
				ref={ref}
				value={valueString}
				onChange={({ target: { value } }) => {
					setValueString(value);
					if (!isNaN(Number(value))) {
						onChange(Number(value));
					}
				}}
			/>
		);
	}
);

export const NumberInputFieldFixed = forwardRef(
	(
		props: Omit<NumberInputFieldProps, "onChange" | "value"> & {
			onChange: Dispatch<number>;
			value: number;
		},
		ref
	) => {
		const { value, onChange } = props;
		const [valueString, setValueString] = useState(String(value));

		useEffect(() => {
			if (valueString !== String(value)) {
				setValueString(String(value));
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [value]);

		return (
			<NumberInputField
				{...props}
				ref={ref}
				value={valueString}
				onChange={({ target: { value } }) => {
					setValueString(value);
					if (!isNaN(Number(value))) {
						onChange(Number(value));
					}
				}}
			/>
		);
	}
);
