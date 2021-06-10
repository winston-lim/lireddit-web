import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/create-urql-client";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
	const [{ data }] = usePostsQuery();
	return (
		<>
			<NavBar />
			<div>hello</div>
			{!data ? (
				<div>...loading</div>
			) : (
				data.posts.map((p) => <div key={p.id}>{p.title}</div>)
			)}
		</>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
