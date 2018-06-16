import React, { Component, Fragment } from "react";
import axios from "axios";

class App extends Component {
	state = {
		healthcheck: "",
		login: {}
	};
	async componentDidMount() {
		try {
			const healthcheck = await axios.get("/healthcheck");
			this.setState({ healthcheck: healthcheck.data });
		} catch (error) {
			console.log(error);
		}

		try {
			const login = await axios.post("/login");
			this.setState({ login: login.data });
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return (
			<Fragment>
				<pre>Get Healthcheck: {this.state.healthcheck}</pre>
				<pre>Login response: {JSON.stringify(this.state.login)}</pre>
			</Fragment>
		);
	}
}

export default App;
