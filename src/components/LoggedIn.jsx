import React from "react";
import styled from "styled-components";
import { History, Today, Profile } from "./";
import Flex from "styled-flex-component";
import { Heading } from "evergreen-ui";

export const LoggedIn = ({ logout, user, refresh, pet }) => (
	<LoggedInContainer>
		{console.log(pet)}
		<ProfileContainer>
			<Profile refresh={refresh} logout={logout} {...user} />
		</ProfileContainer>
		<Heading marginBottom={25} size={900}>
			{user.user.pets && `${user.user.pets[0].name}'s `}Dog Feed
		</Heading>
		<Today pet={pet} user={user.user} />
		<History pet={pet} />
	</LoggedInContainer>
);

const LoggedInContainer = styled.div`
	position: relative;
`;

const ProfileContainer = Flex.extend`
	position: absolute;
	top: 0;
	right: 0;
`;
