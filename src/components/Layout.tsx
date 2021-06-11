import React from "react";
import { NavBar } from "./NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface WrapperProps {
	variant?: WrapperVariant;
}

export const Layout: React.FC<WrapperProps> = ({ variant, children }) => {
	return (
		<>
			<NavBar />
			<Wrapper variant={variant}>{children}</Wrapper>
		</>
	);
};
