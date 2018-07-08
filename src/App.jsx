import React, { Component } from "react";
import styled from "styled-components";
import { Heading } from "evergreen-ui";
import { History, Today } from "./components";
import axios from "axios";

class App extends Component {
	state = {
		petName: ""
	};

	async componentDidMount() {
		const pet = await axios.get("/pets/5b415dc0ece44d5eabd4eccc");
		this.setState({
			petName: pet.data.name
		});
	}

	render() {
		return (
			<Container>
				<Heading marginBottom={25} size={900}>
					{this.state.petName && `${this.state.petName}'s `}Dog Feed
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
