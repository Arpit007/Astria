/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import { Switch } from "react-router-dom";
import { Image } from "semantic-ui-react";
import { Redirect, Route } from "react-router";

import "./UserAuth.css";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import connect from "react-redux/es/connect/connect";

class UserAuth extends Component {
	
	render() {
		return this.props.loggedIn ?
			<Redirect to="/home"/>
			:
			(
				<div className="comp-body">
					<div className="container-login100 bg-img1">
						<div>
							
							<Image src="/logo_light.png" size="small" centered/>
							<Switch>
								<Route path="/auth/" exact component={SignIn}/>
								<Route path="/auth/signIn" component={SignIn}/>
								<Route path="/auth/signUp" component={SignUp}/>
							</Switch>
						
						</div>
					</div>
				</div>
			);
	}
}

function mapStateToProp(state) {
	return {
		loggedIn : !!state.auth_token
	};
}

export default connect(mapStateToProp, {})(UserAuth);