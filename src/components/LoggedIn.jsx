import React, { Fragment } from "react";
import styled from "styled-components";
import { History, Today, Profile } from "./";
import Flex from "styled-flex-component";
import { Heading } from "evergreen-ui";

export const LoggedIn = ({ petName, logout, user }) => (
	<LoggedInContainer>
		<ProfileContainer>
			<Profile logout={logout} {...user} />
		</ProfileContainer>
		<Heading marginBottom={25} size={900}>
			{petName && `${petName}'s `}Dog Feed
		</Heading>
		<Today />
		<History petName={petName} />
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
