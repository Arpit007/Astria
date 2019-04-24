import React, { Component } from 'react';
import { Route, Switch } from "react-router";

import 'semantic-ui-css/semantic.min.css'
import Main from "../component/Main/Main";
import UserAuth from "../component/UserAuth/UserAuth";
import Voter from "../component/Voter/Voter";
import CastVote from "../component/Voter/CastVote/CastVote";
import VerifyVote from "../component/Voter/VerifyVote/VerifyVote";

class App extends Component {
	
	componentDidMount() {
	}
	
	render() {
		return (
			<div>
				<Switch>
					<Route path="/auth" component={UserAuth}/>
					<Route path="/voter/:electionId" component={CastVote}/>
					<Route path="/verify/:electionId" component={VerifyVote}/>
					<Route path="/voter" component={Voter}/>
					<Route path="/" component={Main}/>
				</Switch>
			</div>
		);
	}
}

export default App;