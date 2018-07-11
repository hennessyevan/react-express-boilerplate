import React, { Fragment, Component } from "react";
import styled from "styled-components";
import posed, { PoseGroup, tween, spring } from "react-pose";
import { TimeOfDay } from "./TimeOfDay";
import { IoIosPlus, IoIosCheckmark, IoIosClose } from "react-icons/lib/io";
import { Card, Heading, Text, Dialog, toaster } from "evergreen-ui";
import Flex, { FlexItem } from "styled-flex-component";
import axios from "axios";
import moment from "moment";

export class Today extends Component {
	state = {
		today: [],
		schedule: [],
		dialogIsOpen: false,
		dialogContents: "",
		petName: "",
		startCardDeletion: false
	};

	async componentDidMount() {
		//get pet schedule
		try {
			const pet = await axios.get("/pets/5b415dc0ece44d5eabd4eccc");
			this.setState({
				schedule: pet.data.schedule,
				petName: pet.data.name
			});
		} catch (error) {
			console.log(error);
		}

		this.getTodaysEntries();
	}

	getTodaysEntries = async () => {
		// get pet entries for today
		try {
			const entries = await axios.get("/entries/today");
			this.setState({
				today: entries.data
			});
		} catch (error) {
			console.log(error);
		}
	};

	openDialog = (name, description, time) => {
		this.setState({
			dialogIsOpen: true,
			dialogContents: description,
			dialogTitle: `${name} fed ${this.state.petName} at ${moment(time).format("h:mma")}`
		});
	};

	addEntry = async (pet, user, scheduledTime, time) => {
		time = time || moment();
		if (!moment(time).isBetween(moment(scheduledTime.startTime, "HHmm"), moment(scheduledTime.endTime, "HHmm"))) {
			toaster.warning(`Too Early`, { description: `Please wait until ${moment(scheduledTime.startTime, "HHmm").format("ha")}` });
		} else {
			try {
				await axios.post("/entries/add", { user, pet, time });
				this.getTodaysEntries();
			} catch (error) {
				console.error(error);
			}
		}
	};

	checkTime = scheduledTime => {
		const { today } = this.state;
		const match = today.filter(time =>
			moment(time.updatedAt).isBetween(moment(scheduledTime.startTime, "HHmm"), moment(scheduledTime.endTime, "HHmm"))
		);
		return !today.length ? false : match.length;
	};

	deleteEntry = async (x, entry) => {
		if (x <= -80) {
			try {
				await axios.delete(`/entries/${entry._id}`);
				console.log(`removed ${entry._id}`);
				const newState = await this.state.today.filter(item => item._id !== entry._id);
				await this.setState({ today: newState });
			} catch (error) {
				console.error(error);
			}
		}
	};

	opportunityPassed = scheduledTime => {
		return moment().isAfter(moment(scheduledTime.endTime, "HHmm"));
	};

	render() {
		const { today, schedule, dialogIsOpen, dialogContents, dialogTitle, petName, startCardDeletion } = this.state;
		// onClick={entry.description && (() => this.openDialog(entry.user.firstName, entry.description, entry.time))}
		return (
			<Fragment>
				<TodayContainer wrap>
					<Heading style={{ flexBasis: "100%", marginBottom: 10 }} size={600}>
						Today
					</Heading>
					{today.map((entry, i) => (
						<FlexItem order={moment(entry.updatedAt).format("H")}>
							<TodayCard
								key={entry._id}
								ref={entry._id}
								width={300}
								height={100}
								marginBottom={15}
								paddingX={17}
								paddingY={15}
								index={i}
								onDragEnd={() => {
									this.deleteEntry(this.x, entry);
								}}
								onValueChange={{ x: x => (this.x = x) }}
								{...full}>
								<Flex justifyBetween column full>
									<FlexItem>
										<Flex alignCenter>
											<IoIosCheckmark size={18} color="#47b881" />
											<Text marginLeft={5}>
												{entry.user.firstName} fed {petName}
											</Text>
										</Flex>
									</FlexItem>
									<Flex justifyBetween>
										<FlexItem>
											<TimeOfDay time={entry.updatedAt} format="" />
										</FlexItem>
										<FlexItem>
											<Text>{moment(entry.updatedAt).format("h:mma")}</Text>
										</FlexItem>
									</Flex>
								</Flex>
							</TodayCard>
						</FlexItem>
					))}
					{schedule &&
						schedule.map(
							(scheduledTime, i) =>
								!this.checkTime(scheduledTime) ? (
									<FlexItem full order={moment(scheduledTime.startTime, "HHmm").format("H")}>
										<PoseGroup animateOnMount={true}>
											{this.opportunityPassed(scheduledTime) ? (
												<EmptyCard key={scheduledTime._id} i={i} width={300} height={100} marginBottom={15} padding={15} paddingY={10} {...disabled}>
													<Flex full center column style={{ position: "relative" }}>
														<FlexItem>
															<IoIosClose size={28} color="#f36331" />
														</FlexItem>
														<FlexItem style={{ position: "absolute", bottom: 0, left: 0 }}>
															<TimeOfDay time={scheduledTime.startTime} format="HHmm" />
														</FlexItem>
													</Flex>
												</EmptyCard>
											) : (
												<EmptyCard
													key={scheduledTime._id}
													onClick={() => this.addEntry("5b415dc0ece44d5eabd4eccc", "5b43c12a667060aeb4d2478a", scheduledTime)}
													width={300}
													height={100}
													marginBottom={15}
													padding={15}
													paddingY={10}
													i={i}
													{...empty}>
													<Flex full center column style={{ position: "relative" }}>
														<FlexItem>
															<Flex alignCenter>
																<IoIosPlus size={28} color="#707070" />
															</Flex>
														</FlexItem>
														<FlexItem style={{ position: "absolute", bottom: 0, left: 0 }}>
															<TimeOfDay time={scheduledTime.startTime} format="HHmm" />
														</FlexItem>
													</Flex>
												</EmptyCard>
											)}
										</PoseGroup>
									</FlexItem>
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

	@media screen and (max-width: 767px) {
		display: grid;
		grid-gap: 10px;
		grid-template-areas: 1fr;
		justify-content: center;
	}
`;

const EmptyCard = styled(
	posed(Card)({
		enter: {
			opacity: 1,
			scale: 1,
			delay: ({ i }) => i * 150,
			transition: {
				opacity: {
					ease: "easeInOut",
					duration: 100
				},
				default: {
					type: "spring",
					stiffness: 200,
					damping: 10
				}
			}
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			delay: ({ i }) => i * 150 + 150,
			transition: {
				opacity: {
					ease: "easeInOut",
					duration: 100
				},
				default: {
					type: "spring",
					stiffness: 200,
					damping: 10
				}
			}
		}
	})
)`
	margin-right: 15px;

	@media screen and (max-width: 767px) {
		margin-right: 0;
	}
`;

const TodayCard = styled(
	posed(Card)({
		draggable: "x",
		dragBounds: { left: -100, right: 0 },
		onDragEnd: { display: "none" },
		passive: {
			opacity: ["x", v => (v <= -90 ? 0 : 1)],
			backgroundColor: ["x", v => (v <= -50 ? "#ffe5e5" : "#ffffff")]
		},
		enter: {
			opacity: 1,
			scale: 1,
			display: "block",
			transition: {
				default: {
					type: "spring",
					stiffness: 200,
					damping: 10
				}
			}
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			display: "none",
			transition: {
				default: {
					type: "spring",
					stiffness: 200,
					damping: 10
				}
			}
		}
	})
)`
	background-color: white;
	margin-right: 15px;
	transition: 300ms;

	@media screen and (max-width: 767px) {
		margin-right: 0;
	}
`;

const disabled = {
	appearance: "tint3",
	cursor: "default"
};

const empty = {
	cursor: "pointer",
	appearance: "tint3",
	interactive: true,
	hoverElevation: 1
};

const full = {
	cursor: "pointer",
	interactive: true,
	elevation: 2,
	hoverElevation: 3
};
