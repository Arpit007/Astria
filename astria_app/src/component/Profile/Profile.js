/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Header, Icon } from "semantic-ui-react";

class Profile extends Component {
	render() {
		const {profile} = this.props;
		return (
			<div>
				<Header as="h1" dividing>
					<Icon name="user"/>
					<Header.Content>Profile</Header.Content>
				</Header>
				
				<Header as="h3">Name</Header>
				{profile.profile.name}
				
				<Header as="h3">Phone</Header>
				{profile.profile.phone}
				
				<Header as="h3">Email</Header>
				{profile.email}
			</div>
		);
	}
}

function mapStateToProp(state) {
	return {
		profile : state.profile.profile
	};
}

export default connect(mapStateToProp, {})(Profile);
