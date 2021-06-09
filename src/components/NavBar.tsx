import { Box, Link } from "@chakra-ui/layout";
import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery();
	let body = null;
	if (fetching) {
		//data is loading
		body = null;
	} else if (!data!.me) {
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
					{data?.me.username}
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
		<Flex bg="tomato" p={4}>
			<Box ml={"auto"}>{body}</Box>
		</Flex>
	);
};
