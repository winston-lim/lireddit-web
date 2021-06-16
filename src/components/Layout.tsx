import React from "react";
import { MeQuery } from "../generated/graphql";
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
