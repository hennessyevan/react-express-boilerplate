import React, { Component } from "react";
import styled from "styled-components";
import { LoggedIn, LoggedOut } from "./components";
import { Overlay, Text } from "evergreen-ui";
import axios from "axios";

class App extends Component {
	state = {
		petName: "",
		loggedIn: localStorage.getItem("loggedin"),
		isLoggingIn: false,
		isLoggingOut: false,
		user: {
			firstName: "Evan",
			lastName: "Hennessy",
			gravatar: "15c4638d71a3e5ee3f445a1fe98cffa5"
		}
	};

	async componentDidMount() {
		const pet = await axios.get("/pets/5b415dc0ece44d5eabd4eccc");
		this.setState({
			petName: pet.data.name
		});
	}

	login = async () => {
		this.setState({ isLoggingIn: true });
		setTimeout(() => {
			localStorage.setItem("loggedin", true);
			this.setState({ loggedIn: true, isLoggingIn: false });
		}, 1000);
	};

	logout = async () => {
		this.setState({ isLoggingOut: true });
		setTimeout(() => {
			localStorage.removeItem("loggedin");
			this.setState({ loggedIn: false, isLoggingOut: false });
		}, 1000);
	};

	render() {
		const { petName, loggedIn, isLoggingOut, isLoggingIn, user } = this.state;
		return (
			<Container pose={loggedIn ? "visible" : "hidden"}>
				{loggedIn ? (
					<LoggedIn user={user} logout={() => this.logout()} petName={petName} />
				) : (
					<LoggedOut isLoggingIn={isLoggingIn} login={() => this.login()} />
				)}
				<Overlay isShown={isLoggingOut}>
					<LoggingOutPane>
						<Text>👋 Goodbye {user.firstName}</Text>
					</LoggingOutPane>
				</Overlay>
			</Container>
		);
	}
}

const LoggingOutPane = styled.div`
	z-index: 999;
`;

const Container = styled.div`
	max-width: 1200px;
	padding: 4vw;
	margin: 0 auto;
`;

export default App;
