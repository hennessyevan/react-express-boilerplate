import React, { Component } from "react";
import Flex, { FlexItem } from "styled-flex-component";
import { Dialog, TextInputField, toaster } from "evergreen-ui";
import axios from "axios";
import { getToken } from "../tokenservice";

export class EditProfile extends Component {
	state = {
		saving: false,
		firstName: this.props.firstName,
		lastName: this.props.lastName,
		email: this.props.email
	};

	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async close => {
		this.setState({
			saving: true
		});

		const { firstName, lastName, email } = this.state;
		const token = getToken();

		try {
			const res = await axios.put(
				"/users/current",
				{ firstName, lastName, email },
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			toaster.success("Profile Saved.");
			this.setState({
				saving: false
			});
			this.props.email === this.state.email ? this.props.refresh() : this.props.logout();
			close();
		} catch (error) {
			toaster.danger(`Unable to Login`);
			this.setState({
				saving: false
			});
		}
	};

	render() {
		const { saving } = this.state;
		const { isShown, onCloseComplete } = this.props;
		return (
			<Dialog
				onConfirm={close => this.handleSubmit(close)}
				confirmLabel="Save"
				onCloseComplete={onCloseComplete}
				isConfirmLoading={saving}
				title="Edit Profile"
				isShown={isShown}>
				<Flex wrap full justifyBetween style={{ padding: 10, boxSizing: "border-box" }}>
					<FlexItem basis="47.5%">
						<TextInputField
							label="First Name"
							name="firstName"
							onChange={this.handleChange}
							value={this.state.firstName}
							isRequired
							spellCheck={false}
							placeholder="First Name"
						/>
					</FlexItem>
					<FlexItem basis="47.5%">
						<TextInputField
							label="Last Name"
							name="lastName"
							onChange={this.handleChange}
							value={this.state.lastName}
							isRequired
							spellCheck={false}
							placeholder="Last Name"
						/>
					</FlexItem>
					<FlexItem basis="47.5%">
						<TextInputField
							label="Email"
							name="email"
							description="Changing this field will require you to login again"
							onChange={this.handleChange}
							value={this.state.email}
							isRequired
							spellCheck={false}
							placeholder="Email"
						/>
					</FlexItem>
					<FlexItem basis="47.5%">
						<TextInputField
							label="Profile Photo"
							name="profile_photo"
							value={this.props.gravatar}
							description="This field is controlled by your gravatar"
							disabled
						/>
					</FlexItem>
				</Flex>
			</Dialog>
		);
	}
}
