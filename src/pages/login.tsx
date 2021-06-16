import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useRouter } from "next/router";
import { toErrorMap } from "../utils/to-error-map";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/create-urql-client";
import NextLink from "next/link";
interface loginProps {}

export const Login: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [, login] = useLoginMutation();
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ usernameOrEmail: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login(values);
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						if (typeof router.query.next === "string") {
							router.push(router.query.next);
						} else {
							router.push("/");
						}
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name="usernameOrEmail"
							placeholder="username or email"
							label="Username or Email"
						/>
						<Box mt={4}>
							<InputField
								name="password"
								placeholder="password"
								label="Password"
								type="password"
							/>
						</Box>
						<Flex mt="2">
							<NextLink href="/forget-password">
								<Link ml="auto">Forgot password?</Link>
							</NextLink>
						</Flex>
						<Button
							mt={4}
							type="submit"
							colorScheme="teal"
							isLoading={isSubmitting}
						>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
