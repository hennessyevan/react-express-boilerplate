import React, { Fragment, Component } from "react";
import { TimeOfDay } from "./TimeOfDay";
import { IoIosPlus } from "react-icons/lib/io";
import { Card, Heading, Text, Dialog } from "evergreen-ui";
import Flex, { FlexItem } from "styled-flex-component";
import moment from "moment";

export class Today extends Component {
	state = {
		schedule: [
			{
				id: "1",
				time: "0812",
				name: "Evan",
				description: "Dog was happy",
				complete: true
			},
			{
				id: "2",
				time: "1800",
				name: "",
				complete: false
			}
		],
		dialogIsOpen: false,
		dialogContents: ""
	};

	openDialog = (id, name) => {
		const contents = this.state.schedule.filter(entry => entry.id === id);
		this.setState({
			dialogIsOpen: true,
			dialogContents: contents[0].description,
			dialogTitle: `${name} fed the dog`
		});
	};

	render() {
		const { schedule, dialogIsOpen, dialogContents, dialogTitle } = this.state;
		return (
			<Fragment>
				<Heading size={600}>Today</Heading>
				<TodayContainer wrap>
					{schedule.map(
						time =>
							time.complete ? (
								<Card
									key={time.id}
									onClick={time.description && (() => this.openDialog(time.id, time.name))}
									width={300}
									height={100}
									marginRight={15}
									marginBottom={15}
									padding={17}
									paddingY={15}
									{...full}>
									<Flex justifyBetween column full>
										<FlexItem>
											<Text>{time.name} fed the dog</Text>
										</FlexItem>
										<Flex justifyBetween>
											<FlexItem>
												<TimeOfDay time={time.time} />
											</FlexItem>
											<FlexItem>
												<Text>{moment(time.time, "HHmm").format("H:mma")}</Text>
											</FlexItem>
										</Flex>
									</Flex>
								</Card>
							) : (
								<Card key={time.id} width={300} height={100} padding={15} paddingY={10} {...empty}>
									<Flex center full>
										<IoIosPlus size={28} color="#707070" />
										<Text marginLeft={10}>Add Entry</Text>
									</Flex>
								</Card>
							)
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
