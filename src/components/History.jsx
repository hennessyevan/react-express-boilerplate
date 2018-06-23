import React, { Fragment, Component } from "react";
import styled from "styled-components";
import { Card, Heading, Text } from "evergreen-ui";
import Flex, { FlexItem } from "styled-flex-component";
import moment from "moment";

export class History extends Component {
	state = {
		history: [{ name: "Evan", date: "20180622T080910" }, { name: "User", date: "20180621T181810" }]
	};
	render() {
		return (
			<Fragment>
				<Heading size={600}>Earlier</Heading>
				<HistoryContainer>
					{this.state.history.map((history, i) => (
						<Card cursor="pointer" key={i} width={300} height={100} elevation={1} padding={17} paddingY={15} hoverElevation={3}>
							<Flex column justifyBetween full>
								<FlexItem>
									<Text>{history.name} fed the dog</Text>
								</FlexItem>
								<Flex justifyBetween>
									<FlexItem>
										<Text>{moment(history.date).format("dddd")}</Text>
									</FlexItem>
									<FlexItem>
										<Text>{moment(history.date).format("h:mma")}</Text>
									</FlexItem>
								</Flex>
							</Flex>
						</Card>
					))}
				</HistoryContainer>
			</Fragment>
		);
	}
}

const HistoryContainer = styled.div`
	margin-top: 10px;
	display: grid;
	grid-template-areas: 1fr;
	grid-gap: 10px;
`;
