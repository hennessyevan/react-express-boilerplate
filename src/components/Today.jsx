import React, { Fragment, Component } from "react";
import { TimeOfDay } from "./TimeOfDay";
import { IoIosPlus } from "react-icons/lib/io";
import { Card, Heading, Text, Dialog } from "evergreen-ui";
import Flex, { FlexItem } from "styled-flex-component";
import axios from "axios";
import moment from "moment";

export class Today extends Component {
	state = {
		today: [],
		schedule: [],
		dialogIsOpen: false,
		dialogContents: ""
	};

	async componentDidMount() {
		//get pet schedule
		try {
			const pet = await axios.get("/pets/5b415dc0ece44d5eabd4eccc");
			this.setState({
				schedule: pet.data.schedule
			});
		} catch (error) {
			console.log(error);
		}

		// get pet entries for today
		try {
			const entries = await axios.get("/entries/today");
			this.setState({
				today: [...entries.data]
			});
		} catch (error) {
			console.log(error);
		}
	}

	openDialog = (id, name) => {
		const contents = this.state.schedule.filter(entry => entry.id === id);
		this.setState({
			dialogIsOpen: true,
			dialogContents: contents[0].description,
			dialogTitle: `${name} fed the dog`
		});
	};

	checkTime = scheduledTime => {
		const { today } = this.state;
		const match = today.filter(time => moment(time).isBetween(moment(scheduledTime.startTime, "HHmm"), moment(scheduledTime.endTime, "HHmm")));
		console.log(match);
		return match;
	};

	render() {
		const { today, schedule, dialogIsOpen, dialogContents, dialogTitle } = this.state;
		return (
			<Fragment>
				<Heading size={600}>Today</Heading>
				<TodayContainer wrap>
					{today.map(entry => (
						<Card
							key={entry._id}
							onClick={entry.description && (() => this.openDialog(entry._id, entry.user.firstName))}
							width={300}
							height={100}
							marginRight={15}
							marginBottom={15}
							paddingX={17}
							paddingY={15}
							{...full}>
							<Flex justifyBetween column full>
								<FlexItem>
									<Text>{entry.user.firstName} fed the dog</Text>
								</FlexItem>
								<Flex justifyBetween>
									<FlexItem>
										<TimeOfDay time={entry.time} />
									</FlexItem>
									<FlexItem>
										<Text>{moment(entry.time, "HHmm").format("h:mma")}</Text>
									</FlexItem>
								</Flex>
							</Flex>
						</Card>
					))}
					{schedule.map(
						scheduledTime =>
							this.checkTime(scheduledTime) ? (
								<Card key={scheduledTime._id} width={300} height={100} padding={15} paddingY={10} {...empty}>
									<Flex center full>
										<FlexItem>
											<IoIosPlus size={28} color="#707070" />
											<Text marginLeft={10}>Add Entry</Text>
										</FlexItem>
										<FlexItem alignBottom>
											<TimeOfDay time={scheduledTime.startTime} />
										</FlexItem>
									</Flex>
								</Card>
							) : null
					)}
				</TodayContainer>
				<Dialog
					isShown={dialogIsOpen}
					title={dialogTitle}
					onCloseComplete={() =>
						this.setState({
							dialogIsOpen: false
						})
					}
					hasFooter={false}>
					<Text>{dialogContents}</Text>
				</Dialog>
			</Fragment>
		);
	}
}

const TodayContainer = Flex.extend`
	margin: 25px 0;
`;

const empty = {
	cursor: "pointer",
	appearance: "tint3"
};

const full = {
	cursor: "pointer",
	interactive: true,
	elevation: 2,
	hoverElevation: 3
};
