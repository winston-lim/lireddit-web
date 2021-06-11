import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string;
	textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
	label,
	size: _,
	textarea,
	...props
}) => {
	const [field, { error }] = useField(props);
	const inputProps = {
		...field,
		...props,
		id: field.name,
		placeholder: props.placeholder,
	} as any;
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			{textarea ? (
				<Textarea {...inputProps}></Textarea>
			) : (
				<Input {...inputProps} />
			)}
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
