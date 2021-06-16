import React from "react";
import { MeQuery } from "../generated/graphql";
import { NavBar } from "./NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface WrapperProps {
	variant?: WrapperVariant;
	meFetching: boolean;
	meData: MeQuery | undefined;
}

export const Layout: React.FC<WrapperProps> = ({
	variant,
	meFetching,
	meData,
	children,
}) => {
	return (
		<>
			<NavBar meFetching={meFetching} meData={meData} />
			<Wrapper variant={variant}>{children}</Wrapper>
		</>
	);
};
