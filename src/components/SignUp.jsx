import React, { Component } from "react";
import styled from "styled-components";
import Flex, { FlexItem } from "styled-flex-component";
import { TextInputField, Card, Heading, Text, Button, Small, toaster } from "evergreen-ui";
import axios from "axios";

export class SignUp extends Component {
	state = {
		isLoading: false,
		email: "",
		password: "",
		firstName: "",
		lastName: ""
	};

	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async e => {
		e.preventDefault();
		const { email, password, firstName, lastName } = this.state;
		if (!email || !password) {
			toaster.warning("Invalid Username or Password");
			return false;
		}

		try {
			this.setState({ isLoading: true });
			await axios.post("/auth/signup", { email, password, firstName, lastName });
			this.setState({ isLoading: false });
			this.props.refresh();
			this.props.switchPane();
		} catch (error) {
			this.setState({ isLoading: false });
			toaster.danger(`Unable to Sign Up ${error}`);
		}
	};

	render() {
		const { isLoading } = this.state;
		return (
			<Flex full center>
				<Card elevation={1} padding={40}>
					<Heading size={800}>Create an Account.</Heading>
					<Text>You're just one step away to pet-sanity</Text>
					<Flex column>
						<form onSubmit={this.handleSubmit}>
							<Flex alignCenter justifyBetween style={{ marginTop: 20 }}>
								<TextInputField
									width={145}
									onChange={this.handleChange}
									name="firstName"
									required
									label="First Name"
									placeholder="Bill"
									type="first-name"
									spellCheck={false}
								/>
								<TextInputField
									width={145}
									onChange={this.handleChange}
									name="lastName"
									required
									label="Last Name"
									placeholder="Withers"
									type="last-name"
									spellCheck={false}
								/>
							</Flex>
							<TextInputField
								width={300}
								onChange={this.handleChange}
								name="email"
								required
								label="Email"
								placeholder="email@example.com"
								type="email"
								spellCheck={false}
							/>
							<TextInputField
								width={300}
								onChange={this.handleChange}
								name="password"
								required
								label="Password"
								placeholder="Enter Password"
								type="password"
							/>
							<FlexItem inline>
								<Button isLoading={isLoading} onClick={this.handleSubmit} appearance="blue">
									Sign Up
								</Button>
							</FlexItem>
						</form>
					</Flex>
					<Flex style={{ marginTop: 15 }} justifyEnd>
						<Small>
							Already have an account?<SwitchButton onClick={this.props.switchPane()}> Login</SwitchButton>
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
