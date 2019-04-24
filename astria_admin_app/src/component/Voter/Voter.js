/**
 * Created by Home Laptop on 24-Apr-19.
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchAllElections } from "../../store/action/election";
import { Card, Container, Dimmer, Header, Icon, Loader } from "semantic-ui-react";
import ElectionCard from "../Election/ElectionCard/ElectionCard";

class Voter extends Component {
	componentDidMount() {
		this.props.fetchAllElections();
	}
	
	renderCards = () => {
		return this.props.allElections.length === 0 ?
			(
				<p>
					No Elections Available.
				</p>
			)
			:
			(
				<Card.Group>
					{this.props.allElections.map((election) => (
						<ElectionCard key={election.electionId} election={election} vote={true}/>
					))}
				</Card.Group>
			);
	};
	
	render() {
		const loading = this.props.fetchingElections;
		return loading ?
			(
				<Dimmer active>
					<Loader active inline="centered">Loading</Loader>
				</Dimmer>
			)
			:
			(
				<div>
					<br/>
					<Container>
						<Header as="h1" dividing>
							<Icon name="balance scale"/>
							<Header.Content>All Elections</Header.Content>
						</Header>
						
						{this.renderCards()}
					</Container>
				</div>
			);
	}
}

function mapStateToProp(state) {
	return {
		fetchingElections : state.allElections.isLoading,
		allElections : state.allElections.elections
	};
}

export default connect(mapStateToProp, { fetchAllElections })(Voter);
