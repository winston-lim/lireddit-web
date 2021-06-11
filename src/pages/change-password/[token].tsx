import React, { FunctionComponent, useState } from "react";
import { NextPage } from "next";
import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/router";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/to-error-map";
import { useRouter } from "next/router";
import { useChangePasswordMutation } from "../../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/create-urql-client";
import NextLink from "next/link";
export const ChangePassword: NextPage<{}> = () => {
	const router = useRouter();
	const token =
		typeof router.query.token === "string" ? router.query.token : "";
	const [, changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState("");
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ newPassword: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						newPassword: values.newPassword,
						token,
					});
					if (response.data?.changePassword.errors) {
						const errorMap = toErrorMap(response.data.changePassword.errors);
						if ("token" in errorMap) {
							setTokenError(errorMap["token"]);
						}
						setErrors(errorMap);
					} else if (response.data?.changePassword.user) {
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name="newPassword"
							placeholder="new password"
							label="New Password"
							type="password"
						/>
						{tokenError ? (
							<Box>
								<Box color="red">{tokenError}</Box>
								<NextLink href="/forget-password">
									<Link>Click here to get a new one</Link>
								</NextLink>
							</Box>
						) : null}
						<Button
							mt={4}
							type="submit"
							colorScheme="teal"
							isLoading={isSubmitting}
						>
							change password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(
	ChangePassword as FunctionComponent
);
