/**
 * Created by Home Laptop on 23-Apr-19.
 */
import { connect } from "react-redux";
import React, { Component } from 'react';
import { Card, Divider, Header, Icon } from "semantic-ui-react";

import { formatDate } from "../../../util/format";
import CandidateCard from "../EditElection/CandidateCard/CandidateCard";

class ViewElection extends Component {
	
	showResult = () => {
		return this.props.election.voteDecKey ? (
				<div>
					<Header as="h3">
						<Icon name="envelope open outline"/>
						<Header.Content>Results</Header.Content>
					</Header>
					<Divider/>
					
					<Card.Group>
						{
							this.props.result.map((candidateResult) => (
								<CandidateCard key={candidateResult.candidate.candidateId}
								               candidate={candidateResult.candidate} showVotes={true}
								               voteCount={candidateResult.voteCount}/>
							))
						}
					</Card.Group>
				</div>
			)
			: null;
	};
	
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
				
				<br/><br/>
				<Header as="h3" dividing>Administrator</Header>
				
				<Header as="h4">Name</Header>
				{profile.profile.name}
				
				<Header as="h4">Phone</Header>
				{profile.profile.phone}
				
				<Header as="h4">Email</Header>
				{profile.email}
				
				
				<br/><br/>
				
				<Header as="h3">
					<Icon name="users"/>
					<Header.Content>Candidates</Header.Content>
				</Header>
				<Divider/>
				
				<Card.Group>
					{
						this.props.candidates.length === 0 ?
							(
								<p>
									No Candidates Available<br/>
									Add one now :-)
								</p>
							)
							:
							this.props.candidates.map((candidate) => <CandidateCard key={candidate.candidateId}
							                                                        candidate={candidate}/>)
					}
				</Card.Group>
				
				<br/><br/>
				
				{this.showResult()}
			</div>
		);
	}
}

function mapStateToProp(state) {
	return {
		election : state.election.election,
		candidates : state.candidates.candidates,
		result : state.result.result
	};
}

export default connect(mapStateToProp, {})(ViewElection);
