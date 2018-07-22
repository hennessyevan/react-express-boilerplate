import React, { Component, Fragment } from "react";
import Flex, { FlexItem } from "styled-flex-component";
import { Avatar, Popover, Button, Text } from "evergreen-ui";
import { EditProfile, EditPet } from "./";

export class Profile extends Component {
	state = {
		editProfile: false,
		editPet: false
	};

	toggleProfileEditor = () => {
		this.setState(prevState => ({
			editProfile: !prevState.editProfile
		}));
	};

	togglePetEditor = () => {
		this.setState(prevState => ({
			editPet: !prevState.editPet
		}));
	};

	render() {
		const { user, logout } = this.props;
		const { editProfile, editPet } = this.state;
		return (
			<Fragment>
				<Popover
					statelessProps={{ paddingY: 10, paddingX: 15, width: 250 }}
					position="BOTTOM_RIGHT"
					content={
						<InnerMenu
							showProfileEditor={() => this.toggleProfileEditor()}
							showPetEditor={() => this.togglePetEditor()}
							logout={logout}
							firstName={user.firstName}
							lastName={user.lastName}
						/>
					}>
					<Avatar
						cursor="pointer"
						size={40}
						src={user.gravatar ? `https://secure.gravatar.com/avatar/${user.gravatar}?size=80` : ""}
						name={`${user.firstName} ${user.lastName}`}>
						Avatar
					</Avatar>
				</Popover>
				<EditProfile
					onCloseComplete={() => this.toggleProfileEditor()}
					refresh={this.props.refresh}
					isShown={editProfile}
					firstName={user.firstName}
					lastName={user.lastName}
					gravatar={user.gravatar}
					email={user.email}
					logout={logout}
				/>
				<EditPet
					onCloseComplete={() => this.togglePetEditor()}
					refresh={this.props.refresh}
					isShown={editPet}
					name={user.pets && user.pets[0].name}
					pet={user.pets[0]}
				/>
			</Fragment>
		);
	}
}

const InnerMenu = ({ logout, showProfileEditor, showPetEditor, firstName, lastName }) => (
	<Flex justifyAround column>
		<AlignSelfRight>
			<Text>{`${firstName} ${lastName}`}</Text>
		</AlignSelfRight>
		<Button onClick={() => showProfileEditor()} height={36} appearance="ghostBlue">
			Edit Profile
		</Button>
		<Button onClick={() => showPetEditor()} height={36} appearance="ghostBlue">
			Edit Pet
		</Button>
		<Button onClick={() => logout()} height={36} appearance="ghostBlue">
			Sign Out
		</Button>
	</Flex>
);

const AlignSelfRight = FlexItem.extend`
	margin: 10px 18px;
`;
