import React, { Component, Fragment } from "react";
import styled from "styled-components";
import Flex, { FlexItem } from "styled-flex-component";
import { TextInputField, Card, Heading, Text, Button, Small } from "evergreen-ui";

export class LoggedOut extends Component {
	state = {
		signUpFlow: false
	};

	switchPane = () => {
		this.setState(prevState => ({
			signUpFlow: !prevState.signUpFlow
		}));
	};

	render() {
		const { signUpFlow } = this.state;
		return (
			<Fragment>
				{signUpFlow ? (
					<SignUp switchPane={() => this.switchPane} />
				) : (
					<Login login={this.props.login} isLoggingIn={this.props.isLoggingIn} switchPane={() => this.switchPane} />
				)}
			</Fragment>
		);
	}
}

class Login extends Component {
	render() {
		const { isLoggingIn, login } = this.props;
		return (
			<Flex full center>
				<Card elevation={1} padding={40}>
					<Heading size={800}>Welcome Back.</Heading>
					<Text>Sign in to continue</Text>
					<Flex column>
						<TextInputField width={300} required label="Email" placeholder="email@example.com" type="email" spellCheck={false} marginTop={20} />
						<TextInputField width={300} required label="Password" placeholder="Enter Password" type="password" />
						<FlexItem inline>
							<Button isLoading={isLoggingIn} onClick={() => login()} appearance="green">
								Login
							</Button>
						</FlexItem>
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

class SignUp extends Component {
	state = {
		isLoading: false,
		info: {}
	};

	render() {
		const { isLoading } = this.state;
		return (
			<Flex full center>
				<Card elevation={1} padding={40}>
					<Heading size={800}>Create an Account.</Heading>
					<Text>You're just one step away to pet-sanity</Text>
					<Flex column>
						<Flex alignCenter justifyBetween style={{ marginTop: 20 }}>
							<TextInputField width={145} required label="First Name" placeholder="Bill" type="first-name" spellCheck={false} />
							<TextInputField width={145} required label="Last Name" placeholder="Withers" type="last-name" spellCheck={false} />
						</Flex>
						<TextInputField width={300} required label="Email" placeholder="email@example.com" type="email" spellCheck={false} />
						<TextInputField width={300} required label="Password" placeholder="Enter Password" type="password" />
						<FlexItem inline>
							<Button isLoading={isLoading} appearance="blue">
								Sign Up
							</Button>
						</FlexItem>
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
