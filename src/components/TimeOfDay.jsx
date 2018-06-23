import React, { Fragment } from "react";
import { Text } from "evergreen-ui";
import moment from "moment";
import { IoIosSunny, IoIosMoon } from "react-icons/lib/io";

export const TimeOfDay = ({ time }) => (
	<Fragment>
		<Text>
			{moment(time, "HHmm").isBetween(moment("00", "HH"), moment("12", "HH"), "hour", "[)") ? (
				<Fragment>
					<IoIosSunny size={20} />
					<Text size={200} isUppercase>
						Morning
					</Text>
				</Fragment>
			) : (
				<Fragment>
					<IoIosMoon size={20} />
					<Text size={200} isUppercase>
						Evening
					</Text>
				</Fragment>
			)}
		</Text>
	</Fragment>
);
