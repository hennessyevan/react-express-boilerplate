import React, { Fragment, Component } from "react";
import { TimeOfDay } from "./TimeOfDay";
import { IoIosPlus } from "react-icons/lib/io";
import { Card, Heading, Text } from "evergreen-ui";
import Flex, { FlexItem } from "styled-flex-component";
import moment from "moment";

export class Today extends Component {
	state = {
		schedule: [
			{
				time: "0812",
				name: "Evan",
				complete: true
			},
			{
				time: "180000",
				name: "",
				complete: false
			}
		]
	};

	render() {
		const { schedule } = this.state;
		return (
			<Fragment>
				<Heading size={600}>Today</Heading>
				<TodayContainer>
					{schedule.map(
						time =>
							time.complete ? (
								<Card width={300} height={100} marginRight={15} padding={17} paddingY={15} {...full}>
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
								<Card width={300} height={100} padding={15} paddingY={10} {...empty}>
									<Flex center full>
										<IoIosPlus size={28} color="#707070" />
										<Text marginLeft={10}>Add Entry</Text>
									</Flex>
								</Card>
							)
					)}
				</TodayContainer>
			</Fragment>
		);
	}
}

const TodayContainer = Flex.extend`
	margin: 25px 0;
`;

const empty = {
	cursor: "pointer",
	appearance: "tint3",
	hoverElevation: 4
};

const full = {
	cursor: "pointer",
	elevation: 1,
	hoverElevation: 3
};
