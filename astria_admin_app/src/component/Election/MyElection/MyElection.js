/**
 * Created by Home Laptop on 23-Apr-19.
 */
import { connect } from "react-redux";
import React, { Component } from 'react';
import { Card, Header, Icon } from "semantic-ui-react";

import ElectionCard from "../ElectionCard/ElectionCard";

class MyElection extends Component {
	filterElections = () => {
		const { userId } = this.props.profile;
		return this.props.allElections
			.filter((election) => (election.adminId === userId || election.managers.indexOf(userId) !== -1));
	};
	
	render() {
		return (
			<div>
				<Header as="h1" dividing>
					<Icon name="balance scale"/>
					<Header.Content>My Elections</Header.Content>
				</Header>
				
				{this.renderCards()}
			</div>
		);
	}
	
	renderCards = () => {
		const elections = this.filterElections();
		return elections.length === 0 ?
			(
				<p>
					No election is currently managed by you.<br/>
					Create One Now :-)
				</p>
			)
			:
			(
				<Card.Group>
					{elections.map((election) => <ElectionCard key={election.electionId}
					                                           election={election}/>)}
				</Card.Group>
			);
	}
}

function mapStateToProp(state) {
	return {
		allElections : state.allElections.elections,
		profile : state.profile.profile
	};
}

export default connect(mapStateToProp, {})(MyElection);
