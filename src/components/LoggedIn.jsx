import React, { Fragment, Component } from "react";
import styled from "styled-components";
import { History, Today, Profile } from "./";
import Flex from "styled-flex-component";
import { Heading, Button } from "evergreen-ui";
import axios from "axios";
import { getToken } from "../tokenservice";

export const LoggedIn = ({ logout, user, refresh, pet }) => (
	<LoggedInContainer>{user.pet ? <Main logout={logout} user={user} refresh={refresh} pet={pet} /> : <PickAPet user={user} />}</LoggedInContainer>
);

const Main = ({ logout, user, refresh, pet }) => (
	<Fragment>
		<ProfileContainer>
			<Profile refresh={refresh} logout={logout} user={user} />
		</ProfileContainer>
		<Heading marginBottom={25} size={900}>
			{user.pet && `${user.pet.name}'s `}Dog Feed
		</Heading>
		<Today pet={pet} user={user} />
		<History pet={pet} />
	</Fragment>
);

class PickAPet extends Component {
	state = {
		availablePets: {}
	};

	async componentDidMount() {
		const token = getToken();
		const availablePets = token
			? await axios.get(`/pets`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
			  })
			: {};
	}

	render() {
		return (
			<Fragment>
				<Heading>Pick A Pet</Heading>
				<div>{}</div>
			</Fragment>
		);
	}
}

const LoggedInContainer = styled.div`
	position: relative;
`;

const ProfileContainer = Flex.extend`
	position: absolute;
	top: 0;
	right: 0;
`;
