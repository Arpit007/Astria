/**
 * Created by Home Laptop on 23-Apr-19.
 */
import {connect} from "react-redux";
import React, { Component } from 'react';
import { Switch } from "react-router-dom";
import { Redirect, Route } from "react-router";
import { Container, Dimmer, Loader } from "semantic-ui-react";

import Home from "../Home/Home";
import NavBar from "../NavBar/NavBar";
import Profile from "../Profile/Profile";
import Election from "../Election/Election";
import { fetchAllElections } from "../../store/action/election";

import { fetchProfile } from "../../store/action/user";
import MyElection from "../Election/MyElection/MyElection";
import NewElection from "../Election/NewElection/NewElection";

class Main extends Component {
	
	componentDidMount() {
		this.props.fetchAllElections();
		this.props.fetchProfile();
	}
	
	displayPageOnLoad = () => {
		const loading = this.props.fetchingElections || this.props.fetchingProfile;
		
		return loading ?
			(
				<Dimmer active>
					<Loader active inline="centered">Loading</Loader>
				</Dimmer>
			)
			:
			(
				<Switch>
					<Route path="/" exact={true} component={Home}/>
					<Route path="/election/my" component={MyElection}/>
					<Route path="/election/new" component={NewElection}/>
					<Route path="/election/:electionId" component={Election}/>
					<Route path="/election" component={Home}/>
					<Route path="/home" component={Home}/>
					<Route path="/profile" component={Profile}/>
				</Switch>
			);
	};
	
	render() {
		return this.props.loggedIn ? (
				<div>
					<NavBar/>
					<Container text style={{ marginTop : '7em' }}>
						{this.displayPageOnLoad()}
					</Container>
				</div>
			)
			: <Redirect to="/auth"/>;
	}
}

function mapStateToProp(state) {
	return {
		loggedIn : !!state.auth_token.auth_token,
		fetchingElections : state.allElections.isLoading,
		fetchingProfile : state.profile.isLoading
	};
}

export default connect(mapStateToProp, { fetchAllElections, fetchProfile })(Main);