import React, { Component } from "react";
import styled from "styled-components";
import { Heading } from "evergreen-ui";
import { History, Today } from "./components";

class App extends Component {
	async componentDidMount() {}

	render() {
		return (
			<Container>
				<Heading marginBottom={25} size={900}>
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
