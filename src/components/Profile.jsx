import React, { Component, Fragment } from "react";
import Flex, { FlexItem } from "styled-flex-component";
import { Avatar, Popover, Button, Text } from "evergreen-ui";
import { EditProfile } from "./";

export class Profile extends Component {
	state = {
		editProfile: false
	};

	toggleProfileEditor = () => {
		this.setState(prevState => ({
			editProfile: !prevState.editProfile
		}));
	};

	render() {
		const { gravatar, firstName, lastName, logout } = this.props;
		const { editProfile } = this.state;
		return (
			<Fragment>
				<Popover
					statelessProps={{ paddingY: 10, paddingX: 15, width: 250 }}
					position="BOTTOM_RIGHT"
					content={<InnerMenu showProfileEditor={() => this.toggleProfileEditor()} logout={logout} firstName={firstName} lastName={lastName} />}>
					<Avatar
						cursor="pointer"
						size={40}
						src={gravatar ? `https://secure.gravatar.com/avatar/${gravatar}?size=80` : ""}
						name={`${firstName} ${lastName}`}>
						Avatar
					</Avatar>
				</Popover>
				<EditProfile onCloseComplete={() => this.toggleProfileEditor()} isShown={editProfile} firstName={firstName} lastName={lastName} />
			</Fragment>
		);
	}
}

const InnerMenu = ({ logout, showProfileEditor, firstName, lastName }) => (
	<Flex justifyAround column>
		<AlignSelfRight>
			<Text>{`${firstName} ${lastName}`}</Text>
		</AlignSelfRight>
		<Button onClick={() => showProfileEditor()} height={36} appearance="ghostBlue">
			Edit Profile
		</Button>
		<Button height={36} appearance="ghostBlue">
			Add Pet
		</Button>
		<Button onClick={() => logout()} height={36} appearance="ghostBlue">
			Sign Out
		</Button>
	</Flex>
);

const AlignSelfRight = FlexItem.extend`
	margin: 10px 18px;
`;
