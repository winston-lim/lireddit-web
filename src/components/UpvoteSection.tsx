import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
	post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
	const [loadingState, setLoadingState] =
		useState<"upvote-loading" | "downvote-loading" | "not-loading">(
			"not-loading"
		);
	const [, vote] = useVoteMutation();
	const isLoadingDownvote = loadingState === "downvote-loading";
	const isLoadingUpvote = loadingState === "upvote-loading";
	return (
		<Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
			<IconButton
				color={post.voteStatus === 1 ? "green" : undefined}
				onClick={async () => {
					setLoadingState("upvote-loading");
					await vote({
						postId: post.id,
						value: 1,
					});
					setLoadingState("not-loading");
				}}
				isLoading={isLoadingUpvote}
				disabled={isLoadingDownvote || post.voteStatus === 1}
				aria-label="Upvote post"
				icon={<ChevronUpIcon w={6} h={6} />}
			/>
			{post.points}
			<IconButton
				color={post.voteStatus === -1 ? "red" : undefined}
				onClick={async () => {
					setLoadingState("downvote-loading");
					await vote({
						postId: post.id,
						value: -1,
					});
					setLoadingState("not-loading");
				}}
				isLoading={isLoadingDownvote}
				disabled={isLoadingUpvote || post.voteStatus === -1}
				aria-label="Downvote post"
				icon={<ChevronDownIcon w={6} h={6} />}
			/>
		</Flex>
	);
};
