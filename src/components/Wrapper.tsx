import { Box } from "@chakra-ui/layout";
import React from "react";

export type WrapperVariant = "small" | "regular";
interface wrapperProps {
	variant?: "small" | "regular";
}

export const Wrapper: React.FC<wrapperProps> = ({
	children,
	variant = "regular",
}) => {
	return (
		<Box
			mt={8}
			mx="auto"
			maxW={variant === "regular" ? "800px" : "400px"}
			w="100%"
		>
			{children}
		</Box>
	);
};
