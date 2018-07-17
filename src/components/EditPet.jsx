import React, { Component } from "react";
import Flex, { FlexItem } from "styled-flex-component";
import { Dialog, TextInputField, toaster } from "evergreen-ui";
import axios from "axios";
import { getToken } from "../tokenservice";

export class EditPet extends Component {
	state = {
		saving: false,
		name: this.props.name
	};

	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async close => {
		this.setState({
			saving: true
		});

		const { name } = this.state;
		const token = getToken();

		try {
			const res = await axios.put(
				`/pets/${this.props.pet._id}`,
				{ name },
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			toaster.success("Pet Saved.");
			this.setState({
				saving: false
			});
			this.props.refresh();
			close();
		} catch (error) {
			toaster.danger(`Unable to update ${this.state.name || "pet"}`);
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
				title={`Edit ${this.state.name || "Pet"}`}
				isShown={isShown}>
				<Flex wrap full justifyBetween style={{ padding: 10, boxSizing: "border-box" }}>
					<FlexItem basis="47.5%">
						<TextInputField
							label="Name"
							name="name"
							onChange={this.handleChange}
							value={this.state.name}
							isRequired
							spellCheck={false}
							placeholder="Pet's Name"
						/>
					</FlexItem>
				</Flex>
			</Dialog>
		);
	}
}
