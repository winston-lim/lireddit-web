import { Box, Heading } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/create-urql-client";

export const Post = ({}) => {
	const router = useRouter();
	const id =
		typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
	const [{ data, error, fetching }] = usePostQuery({
		pause: id === -1,
		variables: {
			id,
		},
	});
	if (fetching) {
		return (
			<Layout>
				<div>Loading...</div>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<div>{error.message}</div>
			</Layout>
		);
	}

	if (!data?.post) {
		return (
			<Layout>
				<Box>Could not find post</Box>
			</Layout>
		);
	}

	return (
		<Layout>
			<Heading mb={4}>{data.post.title}</Heading>
			{data.post.text}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
