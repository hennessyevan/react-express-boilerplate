import React, { Component, Fragment } from "react";
import Flex, { FlexItem } from "styled-flex-component";
import { Avatar, Popover, Button, Text } from "evergreen-ui";
import { EditProfile, EditPet } from "./";
import axios from "axios";

export class Profile extends Component {
	state = {
		editProfile: false,
		editPet: false,
		gravatar: ""
	};

	async componentDidMount() {
		const gravatarHash = this.props.user.gravatar;
		if (gravatarHash && !this.state.gravatar) {
			const res = await axios.get(`https://secure.gravatar.com/avatar/${gravatarHash}?d=404`);
			this.setState({ gravatar: res ? `https://secure.gravatar.com/avatar/${gravatarHash}?d=404` : "" });
		} else {
			this.setState({ gravatar: "" });
		}
	}

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

		if (user) {
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
						<Avatar cursor="pointer" size={40} src={this.state.gravatar} name={`${user.firstName} ${user.lastName}`}>
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
						userID={user._id}
					/>
					<EditPet
						onCloseComplete={() => this.togglePetEditor()}
						refresh={this.props.refresh}
						isShown={editPet}
						name={user.pet.name}
						pet={user.pet}
					/>
				</Fragment>
			);
		} else {
			return "";
		}
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
		{/* <Button onClick={() => showPetEditor()} height={36} appearance="ghostBlue">
			Edit Pet
		</Button> */}
		<Button onClick={() => logout()} height={36} appearance="ghostBlue">
			Sign Out
		</Button>
	</Flex>
);

const AlignSelfRight = FlexItem.extend`
	margin: 10px 18px;
`;
