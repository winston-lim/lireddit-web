import {
	dedupExchange,
	Exchange,
	fetchExchange,
	stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
	LoginMutation,
	MeQuery,
	MeDocument,
	RegisterMutation,
	LogoutMutation,
	ChangePasswordMutation,
	VoteMutationVariables,
} from "../generated/graphql";
import {
	Cache,
	cacheExchange,
	DataField,
	ResolveInfo,
	Resolver,
	Variables,
} from "@urql/exchange-graphcache";
import { typedUpdateQuery } from "./typed-update-query";
import Router from "next/router";
import gql from "graphql-tag";
import { isServer } from "./is-server";

const invalidateAllPosts = (cache: Cache) => {
	const allFields = cache.inspectFields("Query");
	const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
	fieldInfos.forEach((fieldInfo) => {
		cache.invalidate("Query", "posts", fieldInfo.arguments);
	});
};

export const errorExchange: Exchange =
	({ forward }) =>
	(ops$) => {
		return pipe(
			forward(ops$),
			tap(({ error }) => {
				if (error) {
					if (error?.message.includes("not authenticated")) {
						Router.replace("/login");
					}
				}
			})
		);
	};

export const cursorPagination = (): Resolver => {
	return (
		_parent: DataField,
		fieldArgs: Variables,
		cache: Cache,
		info: ResolveInfo
	) => {
		const { parentKey: entityKey, fieldName } = info;
		//entityKey = query; fieldName = posts
		//cache.inspectFields() returns all the Queries
		const allFields = cache.inspectFields(entityKey);
		//fieldInfos returns all Queries that are posts
		const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
		// if no data, return undefined
		const size = fieldInfos.length;
		if (size === 0) {
			return undefined;
		}
		//check if a query is in cache
		const isInCache = cache.resolve(
			cache.resolve(
				entityKey,
				`${fieldName}(${stringifyVariables(fieldArgs)})`
			) as string,
			"posts"
		);
		//info.partial tells cacheExchange whether or not to make the query request
		//if in cache, do not make request
		// if (!isInCache) {
		// 	return undefined;
		// }
		info.partial = !isInCache;
		const posts: string[] = [];
		let hasMore: boolean = true;
		// resolve values from Queries of posts
		fieldInfos.forEach((fieldInfo) => {
			const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
			const post = cache.resolve(key, "posts") as string[];
			posts.push(...post);
			const _hasMore = cache.resolve(key, "hasMore") as boolean;
			if (!_hasMore) hasMore = _hasMore as boolean;
		});
		return {
			__typename: "PaginatedPosts",
			hasMore,
			posts,
		};
	};
};
export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	let cookie = "";
	if (isServer()) {
		cookie = ctx?.req?.headers?.cookie;
	}
	return {
		url: "http://localhost:4000/graphql",
		fetchOptions: {
			credentials: "include" as const,
			headers: cookie
				? {
						cookie,
				  }
				: undefined,
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				keys: {
					PaginatedPosts: () => null,
				},
				resolvers: {
					Query: {
						posts: cursorPagination(),
					},
				},
				updates: {
					Mutation: {
						login: (_result, args, cache, info) => {
							typedUpdateQuery<LoginMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									if (result.login.errors) {
										return query;
									} else {
										return {
											me: result.login.user,
										};
									}
								}
							);
							invalidateAllPosts(cache);
						},
						register: (_result, args, cache, info) => {
							typedUpdateQuery<RegisterMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									if (result.register.errors) {
										return query;
									} else {
										return {
											me: result.register.user,
										};
									}
								}
							);
						},
						logout: (_result, args, cache, info) => {
							typedUpdateQuery<LogoutMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								() => ({ me: null })
							);
						},
						changePassword: (_result, args, cache, info) => {
							typedUpdateQuery<ChangePasswordMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									if (result.changePassword.errors) {
										return query;
									} else {
										return {
											me: result.changePassword.user,
										};
									}
								}
							);
						},
						createPost: (_result, args, cache, info) => {
							invalidateAllPosts(cache);
						},
						vote: (_result, args, cache, info) => {
							const { postId, value } = args as VoteMutationVariables;
							const data = cache.readFragment(
								gql`
									fragment _ on Post {
										id
										points
										voteStatus
									}
								`,
								{ id: postId } as any
							);
							if (data) {
								if (data.voteStatus === value) {
									return;
								}
								const newPoints =
									data.points + (!data.voteStatus ? 1 : 2) * value;
								cache.writeFragment(
									gql`
										fragment __ on Post {
											points
											voteStatus
										}
									`,
									{ id: postId, points: newPoints, voteStatus: value } as any
								);
							}
						},
					},
				},
			}),
			errorExchange,
			ssrExchange,
			fetchExchange,
		],
	};
};
