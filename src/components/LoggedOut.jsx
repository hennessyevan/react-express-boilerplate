import React, { Component, Fragment } from "react";
import { Login, SignUp } from "./";

export class LoggedOut extends Component {
	state = {
		signUpFlow: false
	};

	switchPane = () => {
		this.setState(prevState => ({
			signUpFlow: !prevState.signUpFlow
		}));
	};

	render() {
		const { signUpFlow } = this.state;
		return (
			<Fragment>
				{signUpFlow ? (
					<SignUp refresh={this.props.refresh} switchPane={() => this.switchPane} />
				) : (
					<Login refresh={this.props.refresh} isLoggingIn={this.props.isLoggingIn} switchPane={() => this.switchPane} />
				)}
			</Fragment>
		);
	}
}
