import React, { Component } from "react";
import styled from "styled-components";
import Flex, { FlexItem } from "styled-flex-component";
import { TextInputField, Card, Heading, Text, Button, Small, toaster } from "evergreen-ui";
import { setToken } from "../tokenservice";
import axios from "axios";

export class Login extends Component {
	state = {
		email: "",
		password: ""
	};

	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async e => {
		e.preventDefault();
		const { email, password } = this.state;
		if (!email || !password) {
			toaster.warning("Please fill out both fields");
			return false;
		}

		try {
			const res = await axios.post("/auth/login", { email, password });
			await setToken(res.data.token);
			this.props.refresh();
		} catch (error) {
			toaster.danger("Invalid Username or Password");
		}
	};
	render() {
		const { isLoggingIn } = this.props;
		return (
			<Flex full center>
				<Card maxWidth="calc(100vw - 25px)" elevation={1} padding={40}>
					<Heading size={800}>Welcome Back.</Heading>
					<Text>Sign in to continue</Text>

					<Flex column>
						<form onSubmit={this.handleSubmit}>
							<TextInputField
								width={300}
								onChange={this.handleChange}
								required
								name="email"
								label="Email"
								placeholder="email@example.com"
								type="email"
								spellCheck={false}
								marginTop={20}
							/>
							<TextInputField
								name="password"
								width={300}
								onChange={this.handleChange}
								required
								label="Password"
								placeholder="Enter Password"
								type="password"
							/>
							<FlexItem inline>
								<Button isLoading={isLoggingIn} onClick={this.handleSubmit} appearance="green">
									Login
								</Button>
							</FlexItem>
						</form>
					</Flex>
					<Flex style={{ marginTop: 15 }} justifyEnd>
						<Small>
							Don't have an account?<SwitchButton onClick={this.props.switchPane()}> Sign Up</SwitchButton>
						</Small>
					</Flex>
				</Card>
			</Flex>
		);
	}
}

const SwitchButton = styled.span`
	color: #016cd1;
	cursor: pointer;
`;
