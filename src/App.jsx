import React, { Component } from "react";
import styled from "styled-components";
import Flex from "styled-flex-component";
import { LoggedIn, LoggedOut } from "./components";
import { Overlay, Text } from "evergreen-ui";
import axios from "axios";
import { getToken, removeToken } from "./tokenservice";

class App extends Component {
	state = {
		isLoggingIn: true,
		isLoggingOut: false,
		user: null,
		pet: null
	};

	async componentDidMount() {
		this.getCurrentUser();
	}

	getCurrentUser = async () => {
		const token = getToken();
		if (token) {
			try {
				const res = await axios.get("/users/current", {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				const user = res.data;
				const pet = user.pets[0]._id;
				this.setPet(pet);
				this.setUser({ user });
			} catch (error) {
				console.error(error);
			}
		} else {
			this.setState({ isLoggingIn: false });
		}
	};

	refresh = async () => {
		await this.getCurrentUser();
		this.forceUpdate();
	};

	setPet = pet => {
		this.setState({ pet });
	};

	setUser = user => {
		this.setState({ user, isLoggingIn: false });
	};

	logout = () => {
		this.setState({ isLoggingOut: true });
		setTimeout(() => {
			removeToken();
			this.setState({ isLoggingOut: false, user: null });
		}, 1000);
	};

	render() {
		const { isLoggingOut, isLoggingIn, user, pet } = this.state;
		if (!isLoggingIn) {
			return (
				<Container pose={user ? "visible" : "hidden"}>
					{user ? (
						<LoggedIn refresh={() => this.refresh()} user={user} pet={pet} logout={() => this.logout()} />
					) : (
						<LoggedOut refresh={() => this.refresh()} isLoggingIn={isLoggingIn} />
					)}
					<Overlay isShown={isLoggingOut}>
						<LoggingOutPane>
							<Flex full center>
								<GoodbyeText color="white" size={900}>
									<span aria-label="Hand Waving Emoji" role="img">
										👋
									</span>&nbsp;&nbsp;Goodbye
								</GoodbyeText>
							</Flex>
						</LoggingOutPane>
					</Overlay>
				</Container>
			);
		} else {
			return "";
		}
	}
}

const GoodbyeText = styled(Text)`
	color: white;
	z-index: 999;
`;

const LoggingOutPane = styled.div`
	z-index: 999;
	height: 100vh;
	width: 100vw;
`;

const Container = styled.div`
	max-width: 1200px;
	padding: 4vw;
	margin: 0 auto;
`;

export default App;
