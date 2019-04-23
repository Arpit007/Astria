/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import { Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { Redirect, Route } from "react-router";

import Home from "../Home/Home";
import NavBar from "../NavBar/NavBar";
import Profile from "../Profile/Profile";
import Election from "../Election/Election";
import MyElection from "../Election/MyElection/MyElection";
import NewElection from "../Election/NewElection/NewElection";
import connect from "react-redux/es/connect/connect";

class Main extends Component {
	
	render() {
		return this.props.loggedIn ? (
				<div>
					<NavBar/>
					<Container text style={{ marginTop : '7em' }}>
						<Switch>
							<Route path="/" exact={true} component={Home}/>
							<Route path="/election/my" component={MyElection}/>
							<Route path="/election/new" component={NewElection}/>
							<Route path="/election/:electionId" component={Election}/>
							<Route path="/election" component={Home}/>
							<Route path="/home" component={Home}/>
							<Route path="/profile" component={Profile}/>
						</Switch>
					</Container>
				</div>
			)
			:
			<Redirect to="/auth"/>;
	}
}

function mapStateToProp(state) {
	return {
		loggedIn : !!state.auth_token
	};
}

export default connect(mapStateToProp, {})(Main);

// Todo: Load Profile, Load all elections