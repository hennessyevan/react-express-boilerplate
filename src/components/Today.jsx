import axios from "axios";
import { Card, Dialog, Heading, Text, toaster, colors } from "evergreen-ui";
import moment from "moment";
import React, { Component, Fragment } from "react";
import { IoIosCheckmark, IoIosClose, IoIosPlus } from "react-icons/lib/io";
import posed, { PoseGroup } from "react-pose";
import { transform, spring, value } from "popmotion";
import styled from "styled-components";
import Flex, { FlexItem } from "styled-flex-component";
import { TimeOfDay, Ellipsis } from "./";
import { getToken } from "../tokenservice";

export class Today extends Component {
	constructor(props) {
		super(props);
		this.state = {
			today: [],
			schedule: props.user.pet && props.user.pet.schedule,
			petName: props.user.pet && props.user.pet.name,
			dialogIsOpen: false,
			deleteDialog: false,
			entryToBeDeleted: "",
			dialogContents: "",
			startCardDeletion: false
		};
	}

	async componentDidMount() {
		//get pet schedule
		try {
			this.getTodaysEntries();
		} catch (error) {
			toaster.danger(`Unable to load data`, { description: "Please refresh the page" });
		}
	}

	getTodaysEntries = async () => {
		// get pet entries for today
		try {
			const token = getToken();
			const entries = await axios.get(`/entries?time=today&pet=${this.props.pet}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			this.setState({
				today: entries.data
			});
		} catch (error) {
			toaster.danger(`Unable to load data`, { description: "Please refresh the page" });
		}
	};

	openDialog = (name, description, time) => {
		this.setState({
			dialogIsOpen: true,
			dialogContents: description,
			dialogTitle: `${name} fed ${this.state.petName} at ${moment(time).format("h:mma")}`
		});
	};

	addEntry = async (petID, userID, scheduledTime) => {
		const time = new Date();
		if (!moment(time).isBetween(moment(scheduledTime.startTime, "HHmm"), moment(scheduledTime.endTime, "HHmm"))) {
			toaster.warning(`Too Early`, {
				description: `Please wait until ${moment(scheduledTime.startTime, "HHmm").format("ha")}`
			});
		} else {
			try {
				const token = await getToken();
				await axios.post(
					"/entries",
					{ user: userID, pet: petID },
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);
				this.getTodaysEntries();
			} catch (error) {
				toaster.danger(`Unable to save entry`, { description: "Please try again later" });
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

	confirmDelete = (x, entry) => {
		if (x <= -200) {
			this.setState({ deleteDialog: true, entryToBeDeleted: entry._id });
		}
	};

	deleteEntry = async () => {
		const { entryToBeDeleted } = this.state;
		try {
			const token = getToken();
			await axios.delete(`/entries/${entryToBeDeleted}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const newState = await this.state.today.filter(item => item._id !== entryToBeDeleted);
			await this.setState({ today: newState });
		} catch (error) {
			toaster.danger(`Unable to delete entry`);
		}
	};

	opportunityPassed = scheduledTime => {
		return moment().isAfter(moment(scheduledTime.endTime, "HHmm"));
	};

	render() {
		const { today, schedule, dialogIsOpen, dialogContents, dialogTitle, petName, deleteDialog } = this.state;
		return (
			<Fragment>
				<TodayContainer wrap>
					<Heading style={{ flexBasis: "100%", marginBottom: 10 }} size={600}>
						Today
					</Heading>
					{today.map((entry, i) => (
						<FlexItem key={entry._id} order={moment(entry.updatedAt).format("H")}>
							<CardContainer>
								<DeleteIndicator full alignCenter justifyEnd>
									<DeleteIcon column center>
										<IoIosClose size={32} color="white" />
										<Text size={200} color="white">
											Delete
										</Text>
									</DeleteIcon>
								</DeleteIndicator>
								<TodayCard
									key={entry._id}
									ref={entry._id}
									width={300}
									height={100}
									paddingX={17}
									paddingY={15}
									position="relative"
									index={i}
									pose={moment(entry.updatedAt).diff(moment(), "minutes", true) >= -5 ? "expired" : "default"}
									onDragEnd={() => {
										this.confirmDelete(this.x, entry);
									}}
									onValueChange={{ x: x => (this.x = x) }}
									{...full}>
									<Flex justifyBetween column full>
										{entry.description && (
											<Ellipsis
												size={16}
												onClick={() =>
													this.openDialog(entry.user.firstName, entry.description, entry.updatedAt, entry.pet.name)
												}
											/>
										)}
										<FlexItem>
											<Flex alignCenter>
												<IoIosCheckmark size={18} color={colors.green[500]} />
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
							</CardContainer>
						</FlexItem>
					))}
					{schedule &&
						schedule.map(
							(scheduledTime, i) =>
								!this.checkTime(scheduledTime) ? (
									<FlexItem key={scheduledTime._id} full order={moment(scheduledTime.startTime, "HHmm").format("H")}>
										<PoseGroup animateOnMount={true}>
											{this.opportunityPassed(scheduledTime) ? (
												<EmptyCard
													key={scheduledTime._id}
													i={i}
													width={300}
													height={100}
													marginBottom={15}
													padding={15}
													paddingY={10}
													{...disabled}>
													<Flex full center column style={{ position: "relative" }}>
														<FlexItem>
															<IoIosClose size={28} color={colors.red[500]} />
														</FlexItem>
														<FlexItem style={{ position: "absolute", bottom: 0, left: 0 }}>
															<TimeOfDay time={scheduledTime.startTime} format="HHmm" />
														</FlexItem>
													</Flex>
												</EmptyCard>
											) : (
												<EmptyCard
													key={scheduledTime._id}
													onClick={() => this.addEntry(this.props.user.pet._id, this.props.user._id, scheduledTime)}
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
																<IoIosPlus size={28} color={colors.neutral[300]} />
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
					isShown={deleteDialog}
					type="danger"
					hasHeader={false}
					confirmLabel="Delete"
					onCloseComplete={() =>
						this.setState({
							deleteDialog: false
						})
					}
					onConfirm={close => {
						this.deleteEntry();
						close();
					}}>
					<Text>Are you sure you want to delete this entry?</Text>
				</Dialog>
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
		dragBounds: { left: -275, right: 0 },
		onDragEnd: { display: "none" },
		dragEnd: {
			transition: ({ from, to, velocity }) => spring({ from, to, velocity, stiffness: 750, damping: 50 })
		},
		enter: {
			opacity: 1,
			scale: 1,
			zIndex: 999,
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
		}
	})
)`
	background-color: white;
	z-index: 3;

	@media screen and (max-width: 767px) {
		margin-right: 0;
	}
`;

const CardContainer = styled.div`
	background-color: ${colors.red[400]};
	border-radius: 5px;
	position: relative;
	z-index: 1;
`;

const DeleteIndicator = Flex.extend`
	position: absolute;
	z-index: 2;
`;

const DeleteIcon = Flex.extend`
	margin-right: 25px;
`;

const disabled = {
	appearance: "tint3",
	cursor: "default"
};

const empty = {
	cursor: "pointer",
	appearance: "tint3",
	interactive: "true",
	hoverElevation: 1
};

const full = {
	cursor: "pointer",
	interactive: true,
	elevation: 2,
	hoverElevation: 3
};
