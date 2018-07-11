import React, { Fragment, Component } from "react";
import styled from "styled-components";
import axios from "axios";
import posed, { PoseGroup } from "react-pose";
import { Card, Heading, Text, Dialog } from "evergreen-ui";
import Flex, { FlexItem } from "styled-flex-component";
import moment from "moment";

export class History extends Component {
	state = {
		history: [],
		dialogIsOpen: false,
		dialogDescription: "",
		dialogTitle: ""
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

	openDialog = (name, dialogDescription, time) => {
		this.setState({
			dialogIsOpen: true,
			dialogTitle: `${name} fed ${this.props.petName} ${moment(time).from(moment())}`,
			dialogDescription
		});
	};

	render() {
		const { history, dialogIsOpen, dialogTitle, dialogDescription } = this.state;
		if (this.state.history.length) {
			return (
				<Fragment>
					<HistoryContainer>
						<Heading size={600}>Earlier</Heading>
						<PoseGroup animateOnMount={true}>
							{history.map((entry, i) => (
								<HistoryCard
									onClick={() => this.openDialog(entry.user.firstName, entry.description, entry.updatedAt)}
									cursor="pointer"
									key={entry._id}
									width={300}
									height={100}
									elevation={0}
									padding={17}
									paddingY={15}
									i={i}
									hoverElevation={2}>
									<Flex column justifyBetween full>
										<FlexItem>
											<Text>
												{entry.user.firstName} fed {this.props.petName}
											</Text>
										</FlexItem>
										<Flex justifyBetween>
											<FlexItem>
												<Text>{moment(entry.updatedAt).format("dddd")}</Text>
											</FlexItem>
											<FlexItem>
												<Text>{moment(entry.updatedAt).format("h:mma")}</Text>
											</FlexItem>
										</Flex>
									</Flex>
								</HistoryCard>
							))}
						</PoseGroup>
					</HistoryContainer>
					<Dialog
						isShown={dialogIsOpen}
						title={dialogTitle}
						onCloseComplete={() =>
							this.setState({
								dialogIsOpen: false
							})
						}
						hasFooter={false}>
						<Text>{dialogDescription}</Text>
					</Dialog>
				</Fragment>
			);
		} else {
			return null;
		}
	}
}

const HistoryCard = posed(Card)({
	enter: {
		opacity: 1,
		y: 0,
		delay: ({ i }) => i * 175 + 600,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 15
		}
	},
	exit: {
		opacity: 0,
		y: 10
	}
});

const HistoryContainer = styled.div`
	margin-top: 10px;
	display: grid;
	grid-template-areas: 1fr;
	grid-gap: 10px;

	@media screen and (max-width: 767px) {
		justify-content: center;
	}
`;
