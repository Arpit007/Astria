/**
 * Created by Home Laptop on 23-Apr-19.
 */
import moment from "moment";
import React, { Component } from 'react';
import { Header, Icon } from "semantic-ui-react";
import connect from "react-redux/es/connect/connect";

class ViewElection extends Component {
	render() {
		const { election } = this.props;
		const profile = election.admin;
		return (
			<div>
				<Header as="h1" dividing>
					<Icon name="balance scale"/>
					<Header.Content>Election</Header.Content>
				</Header>
				
				<Header as="h3">Election Name</Header>
				{election.electionName}
				
				<Header as="h3">Start Date</Header>
				{formatDate(election.startDate)}
				
				<Header as="h3">End Date</Header>
				{formatDate(election.endDate)}
				
				<Header as="h3" dividing>Administrator</Header>
				
				<Header as="h4">Name</Header>
				{profile.profile.name}
				
				<Header as="h4">Phone</Header>
				{profile.profile.phone}
				
				<Header as="h4">Email</Header>
				{profile.email}
			
			</div>
		);
	}
}

function formatDate(date) {
	const offset = new Date().getTimezoneOffset();
	return moment(date).utcOffset(offset).format('llll')
}

function mapStateToProp(state) {
	return {
		election : state.election
	};
}

export default connect(mapStateToProp, {})(ViewElection);
