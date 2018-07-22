import styled from "styled-components";
import { IoIosMore, IoIosInformation } from "react-icons/lib/io";
import { colors } from "evergreen-ui";

export const Ellipsis = styled(IoIosMore)`
	position: absolute;
	top: 15px;
	right: 17px;
	border-radius: 100%;
	padding: 2px;
	background: ${colors.neutral[15]};
	color: ${colors.neutral[400]};

	&:hover {
		background: ${colors.neutral[20]};
	}
`;

export const EllipsisInfo = styled(IoIosInformation)`
	position: absolute;
	top: 15px;
	right: 17px;
	color: ${colors.neutral[125]};
`;
