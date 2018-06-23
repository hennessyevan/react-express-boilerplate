import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { Heading } from "evergreen-ui";
import { History, Today } from "./components";

class App extends Component {
	async componentDidMount() {
		try {
			const healthcheck = await axios.get("/healthcheck");
			console.log({ healthcheck: healthcheck.data });
		} catch (error) {
			console.log(error);
		}

		try {
			const login = await axios.post("/login");
			console.log({ login: login.data });
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return (
			<Container>
				<Heading marginBottom={25} size={900}>
					<span role="img" aria-label="dog logo emoji">
						🐶{" "}
					</span>
					The Dog Feed
				</Heading>
				<Today />
				<History />
			</Container>
		);
	}
}

const Container = styled.div`
	max-width: 1200px;
	padding: 4vw;
	margin: 0 auto;
`;

export default App;
