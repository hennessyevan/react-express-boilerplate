import React, { Fragment, Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { Card, Heading, Text, Dialog } from "evergreen-ui";
import Flex, { FlexItem } from "styled-flex-component";
import moment from "moment";

export class History extends Component {
	state = {
		history: [],
		dialogIsOpen: false
	};

	async componentDidMount() {
		try {
			const entries = await axios.get("/entries/history");
			this.setState({
				history: [...entries.data]
			});
		} catch (error) {
			console.log(error);
		}
	}

	openDialog = () => {
		this.setState({
			dialogIsOpen: true
		});
	};

	render() {
		const { history, dialogIsOpen } = this.state;
		if (this.state.history.length) {
			return (
				<Fragment>
					<Heading size={600}>Earlier</Heading>
					<HistoryContainer>
						{history.map(entry => (
							<Card
								onClick={this.openDialog}
								cursor="pointer"
								key={entry._id}
								width={300}
								height={100}
								elevation={0}
								padding={17}
								paddingY={15}
								hoverElevation={2}>
								<Flex column justifyBetween full>
									<FlexItem>
										<Text>{entry.user.firstName} fed the dog</Text>
									</FlexItem>
									<Flex justifyBetween>
										<FlexItem>
											<Text>{moment(entry.time).format("dddd")}</Text>
										</FlexItem>
										<FlexItem>
											<Text>{moment(entry.time).format("h:mma")}</Text>
										</FlexItem>
									</Flex>
								</Flex>
							</Card>
						))}
					</HistoryContainer>
					<Dialog
						isShown={dialogIsOpen}
						title="Title"
						onCloseComplete={() =>
							this.setState({
								dialogIsOpen: false
							})
						}
						hasFooter={false}>
						<Text>Hello</Text>
					</Dialog>
				</Fragment>
			);
		} else {
			return null;
		}
	}
}

const HistoryContainer = styled.div`
	margin-top: 10px;
	display: grid;
	grid-template-areas: 1fr;
	grid-gap: 10px;
`;
