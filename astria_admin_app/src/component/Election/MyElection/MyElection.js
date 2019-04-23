/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Card, Header, Icon } from "semantic-ui-react";
import ElectionCard from "../ElectionCard/ElectionCard";

class MyElection extends Component {
	filterElections() {
		const { userId } = this.props.profile;
		return this.props.allElections
			.filter((election) => (election.adminId === userId || election.managers.indexOf(userId) !== -1));
	}
	
	render() {
		return (
			<div>
				<Header as="h1" dividing>
					<Icon name="balance scale"/>
					<Header.Content>My Elections</Header.Content>
				</Header>
				
				<Card.Group>
					{this.filterElections().map((election) => <ElectionCard key={election.electionId} election={election}/>)}
				</Card.Group>
			</div>
		);
	}
}

function mapStateToProp(state) {
	return {
		allElections : state.allElections,
		profile : state.profile
	};
}

export default connect(mapStateToProp, {})(MyElection);
