import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/create-urql-client";
import { toErrorMap } from "../utils/to-error-map";
import login from "./login";

export const ForgetPassword: React.FC<{}> = ({}) => {
	const [complete, setComplete] = useState(false);
	const [, forgotPassword] = useForgotPasswordMutation();
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ email: "" }}
				onSubmit={async (values, { setErrors }) => {
					await forgotPassword(values);
					setComplete(true);
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<Box color="green">
							If an account with that email exists, we sent a email with
							instructions
						</Box>
					) : (
						<Form>
							<InputField
								name="email"
								placeholder="email"
								label="Email"
								type="email"
							/>
							<Button
								mt={4}
								type="submit"
								colorScheme="teal"
								isLoading={isSubmitting}
							>
								Request password change
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ForgetPassword);
