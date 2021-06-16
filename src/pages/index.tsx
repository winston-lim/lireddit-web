import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/create-urql-client";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import {
	Box,
	Button,
	Flex,
	Heading,
	Link,
	Stack,
	Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { isServer } from "../utils/is-server";
import { UpvoteSection } from "../components/UpvoteSection";

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 15,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({
		variables,
	});
	if (!fetching && !data) {
		return <div> No posts available now</div>;
	}
	return (
		<Layout>
			{!data && fetching ? (
				<div>...loading</div>
			) : (
				<Stack spacing={8}>
					{data!.posts.posts.map((p) => (
						<Flex key={p.id} p={5} shadow="md" borderWidth="1px">
							<UpvoteSection post={p}></UpvoteSection>
							<Box>
								<NextLink href="/post/[id]" as={`/post/${p.id}`}>
									<Link>
										<Heading fontSize="xl">{p.title}</Heading>
									</Link>
								</NextLink>

								<Text>posted by: {p.creator.username}</Text>
								<Text mt={4}>{p.textSnippet}...</Text>
							</Box>
						</Flex>
					))}
				</Stack>
			)}
			{data && data.posts.hasMore ? (
				<Flex>
					<Button
						onClick={() => {
							setVariables({
								limit: variables.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							});
						}}
						isLoading={fetching}
						m="auto"
						my={8}
					>
						load more
					</Button>
				</Flex>
			) : null}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
