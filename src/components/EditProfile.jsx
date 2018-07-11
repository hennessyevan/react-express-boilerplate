import React, { Component } from "react";
import Flex, { FlexItem } from "styled-flex-component";
import { Dialog, TextInputField, toaster } from "evergreen-ui";

export class EditProfile extends Component {
	state = {
		saving: false,
		firstName: this.props.firstName,
		lastName: this.props.lastName
	};

	saveProfileSettings = close => {
		this.setState({
			saving: true
		});
		setTimeout(() => {
			this.setState({
				saving: false
			});
			close();
			toaster.success("Profile Saved.");
		}, 1000);
	};

	render() {
		const { saving } = this.state;
		const { isShown, onCloseComplete } = this.props;
		return (
			<Dialog
				onConfirm={close => this.saveProfileSettings(close)}
				confirmLabel="Save"
				onCloseComplete={onCloseComplete}
				isConfirmLoading={saving}
				title="Edit Profile"
				isShown={isShown}>
				<Flex wrap full justifyBetween style={{ padding: 10, boxSizing: "border-box" }}>
					<FlexItem basis="47.5%">
						<TextInputField label="First Name" isRequired spellCheck={false} placeholder="First Name" />
					</FlexItem>
					<FlexItem basis="47.5%">
						<TextInputField label="Last Name" isRequired spellCheck={false} placeholder="Last Name" />
					</FlexItem>
					<FlexItem basis="47.5%">
						<TextInputField label="Email" isRequired spellCheck={false} placeholder="Email" />
					</FlexItem>
				</Flex>
			</Dialog>
		);
	}
}
