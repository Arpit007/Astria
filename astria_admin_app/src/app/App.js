import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";

import 'semantic-ui-css/semantic.min.css'
import Main from "../component/Main/Main";
import UserAuth from "../component/UserAuth/UserAuth";
import { Route, Switch } from "react-router";

class App extends Component {
	
	componentDidMount() {
	}
	
	render() {
		return (
			<div>
				<Switch>
					<Route path="/auth" component={UserAuth}/>
					<Route path="/" component={Main}/>
				</Switch>
			</div>
		);
	}
}

function mapStateToProp(state) {
	return {
		loggedIn : !!state.auth_token
	};
}

export default connect(mapStateToProp, {})(App);