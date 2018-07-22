import React, { Fragment, Component } from "react";
import styled from "styled-components";
import axios from "axios";
import posed, { PoseGroup } from "react-pose";
import { IoIosMore } from "react-icons/lib/io";
import { Card, Heading, Text, Dialog, colors } from "evergreen-ui";
import Flex, { FlexItem } from "styled-flex-component";
import moment from "moment";
import { getToken } from "../tokenservice";
import { Ellipsis } from "./";

export class History extends Component {
	state = {
		history: [],
		dialogIsOpen: false,
		dialogDescription: "",
		dialogTitle: ""
	};

	async componentDidMount() {
		try {
			const token = getToken();
			const entries = await axios.get(`/entries?time=history&pet=${this.props.pet}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			this.setState({
				history: entries.data
			});
		} catch (error) {
			console.log(error);
		}
	}

	openDialog = (name, dialogDescription, time, petName) => {
		this.setState({
			dialogIsOpen: true,
			dialogTitle: `${name} fed ${petName} ${moment(time).from(moment())}`,
			dialogDescription
		});
	};

	render() {
		const { history, dialogIsOpen, dialogTitle, dialogDescription } = this.state;

		if (history.length) {
			return (
				<Fragment>
					<HistoryContainer>
						<Heading size={600}>Earlier</Heading>
						<PoseGroup animateOnMount={true}>
							{history.map((entry, i) => (
								<HistoryCard
									cursor="pointer"
									key={entry._id}
									width={300}
									height={100}
									elevation={0}
									position="relative"
									padding={17}
									paddingY={15}
									i={i}
									hoverElevation={2}>
									<Flex column justifyBetween full>
										<Ellipsis size={16} onClick={() => this.openDialog(entry.user.firstName, entry.description, entry.updatedAt, entry.pet.name)} />
										<FlexItem>
											<Text>
												{entry.user.firstName} fed {entry.pet.name}
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
