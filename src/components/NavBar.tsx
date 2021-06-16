import { Box, Link } from "@chakra-ui/layout";
import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { MeQuery, useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/is-server";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ data: meData, fetching: meFetching }] = useMeQuery({
		pause: isServer(),
	});
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	let body = null;
	if (meFetching) {
		//data is loading
		body = null;
	} else if (meData === undefined || meData === null || !meData!.me) {
		//user is not logged in
		body = (
			<>
				<NextLink href="/login">
					<Link color="white" mr={2}>
						Login
					</Link>
				</NextLink>
				<NextLink href="/register">
					<Link color="white">Register</Link>
				</NextLink>
			</>
		);
	} else {
		// user is logged in
		body = (
			<Flex>
				<Box mr={2} textColor="white">
					{meData?.me.username}
				</Box>
				<Button
					onClick={() => {
						logout();
					}}
					isLoading={logoutFetching}
					variant="link"
					textColor="white"
				>
					Logout
				</Button>
			</Flex>
		);
	}
	return (
		<Flex position="sticky" top={0} zIndex={1} bg="tomato" p={4}>
			<Box ml={"auto"}>{body}</Box>
		</Flex>
	);
};
