import React, { Component } from "react";
import Flex, { FlexItem } from "styled-flex-component";
import { Dialog, TextInputField, toaster } from "evergreen-ui";
import axios from "axios";
import { getToken } from "../tokenservice";
import { TimeOfDay } from "./";
import TimeRange from "react-time-range";
import moment from "moment";
import _ from "lodash";

export class EditPet extends Component {
	state = {
		saving: false,
		name: this.props.name,
		schedule:
			this.props.pet &&
			this.props.pet.schedule.map((schedule, i) => ({
				_id: schedule._id,
				startTime: schedule.startTime,
				endTime: schedule.endTime,
				index: i
			}))
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
			await axios.put(
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

	modifySchedule = async (time, id, index) => {
		let newSchedule = this.state.schedule.filter(schedule => schedule._id !== id);
		newSchedule = [
			...newSchedule,
			{
				_id: id,
				startTime: moment(time.startTime).format("HHmm"),
				endTime: moment(time.endTime).format("HHmm"),
				index: index
			}
		];
		newSchedule = await _.sortBy(newSchedule, ["index"]);
		this.setState({
			schedule: newSchedule
		});
		console.log({ time, id });
	};

	render() {
		const { saving, schedule } = this.state;
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
						<pre>{JSON.stringify(schedule, null, 3)}</pre>
						{schedule.map(schedule => (
							<Flex alignCenter>
								<TimeOfDay time={moment(schedule.startTime, "HHmm")} />
								<TimeRange
									startLabel={false}
									endLabel="-"
									sameIsValid={false}
									startMoment={moment(schedule.startTime, "HHmm")}
									endMoment={moment(schedule.endTime, "HHmm")}
									onChange={time => this.modifySchedule(time, schedule._id, schedule.index)}
								/>
							</Flex>
						))}
					</FlexItem>
				</Flex>
			</Dialog>
		);
	}
}
