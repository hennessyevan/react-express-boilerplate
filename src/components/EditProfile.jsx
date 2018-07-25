import React, { Component, Fragment } from "react";
import Flex, { FlexItem } from "styled-flex-component";
import { Dialog, TextInputField, toaster, Button } from "evergreen-ui";
import axios from "axios";
import { getToken } from "../tokenservice";

export class EditProfile extends Component {
	state = {
		saving: false,
		deleteAccountDialog: false,
		firstName: this.props.firstName,
		lastName: this.props.lastName,
		email: this.props.email,
		newPassword: "",
		confirmPassword: ""
	};

	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async close => {
		const { firstName, lastName, email, newPassword, confirmPassword } = this.state;
		const token = getToken();

		const passwordMatch = newPassword === confirmPassword;
		const password = passwordMatch && newPassword !== "" ? newPassword : null;
		if (!passwordMatch) {
			toaster.danger(`Passwords don't match ${newPassword}`);
			return false;
		}

		const newProfile = !password ? { firstName, lastName, email } : { firstName, lastName, email, password };

		console.log(password);

		this.setState({
			saving: true
		});
		try {
			await axios.put("/users/current", newProfile, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			toaster.success("Profile Saved.");
			this.setState({
				saving: false
			});
			if (this.props.email === this.state.email || password !== "") {
				this.props.logout();
			} else {
				this.props.refresh();
			}
			close();
		} catch (error) {
			toaster.danger(`Unable to Login`);
			this.setState({
				saving: false
			});
		}
	};

	deleteAccount = async close => {
		try {
			this.setState({ saving: true });
			const token = getToken();
			await axios.delete(`/users/${this.props.userID}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			close();
			this.setState({ loading: false });
			this.props.logout();
		} catch (error) {
			toaster.warning("Unable to delete account");
		}
	};

	render() {
		const { saving, deleteAccountDialog } = this.state;
		const { isShown, onCloseComplete } = this.props;

		return (
			<Fragment>
				<Dialog
					onConfirm={close => this.handleSubmit(close)}
					confirmLabel="Save"
					onCloseComplete={onCloseComplete}
					isConfirmLoading={saving}
					title="Edit Profile"
					isShown={isShown && !deleteAccountDialog}>
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
								description="Changing this will require you to login"
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
						<FlexItem basis="47.5%">
							<TextInputField
								type="password"
								label="New Password"
								name="newPassword"
								onChange={this.handleChange}
								value={this.state.newPassword}
								spellCheck={false}
								description="Set a new password"
							/>
						</FlexItem>
						<FlexItem basis="47.5%">
							<TextInputField
								type="password"
								label="Confirm Password"
								name="confirmPassword"
								onChange={this.handleChange}
								value={this.state.confirmPassword}
								spellCheck={false}
								description="Confirm your new password"
							/>
						</FlexItem>
						<FlexItem style={{ marginTop: 25 }} basis="47.5%">
							<Button onClick={() => this.setState({ deleteAccountDialog: true })} size={100} appearance="ghost" color="red">
								Delete Account
							</Button>
						</FlexItem>
					</Flex>
				</Dialog>
				<Dialog
					type="danger"
					confirmLabel="Delete"
					title="Delete Account"
					isConfirmLoading={saving}
					onConfirm={close => this.deleteAccount(close)}
					isShown={deleteAccountDialog}>
					Are you sure? You won't be able to undo this action.
				</Dialog>
			</Fragment>
		);
	}
}
