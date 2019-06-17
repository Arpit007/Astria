/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Card, Header, Icon } from "semantic-ui-react";

import ElectionCard from "../Election/ElectionCard/ElectionCard";

class Home extends Component {
	render() {
		return (
			<div>
				<Header as="h1" dividing>
					<Icon name="balance scale"/>
					<Header.Content>All Elections</Header.Content>
				</Header>
				
				{this.renderCards()}
			</div>
		);
	}
	
	renderCards = () => {
		return this.props.allElections.length === 0 ?
			(
				<p>
					No Elections Available.<br/>
					Create One Now :-)
				</p>
			)
			:
			(
				<Card.Group>
					{this.props.allElections.map((election) => (
						<ElectionCard key={election.electionId} election={election}/>
					))}
				</Card.Group>
			);
	}
}

function mapStateToProp(state) {
	return {
		allElections : state.allElections.elections
	};
}

export default connect(mapStateToProp, { })(Home);
