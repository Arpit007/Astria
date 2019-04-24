/**
 * Created by Home Laptop on 24-Apr-19.
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchElection, getElectionCandidates } from "../../../store/action/election";
import { Button, Container, Dimmer, Dropdown, Form, Header, Icon, Input, Loader } from "semantic-ui-react";
import { castVote } from "../../../store/action/voter";

class CastVote extends Component {
	
	state = {
		candidateId : "",
		voterId : "",
		pin : ""
	};
	
	handleChange = (event, { name, value }) => {
		if (this.state.hasOwnProperty(name)) {
			this.setState({ [ name ] : value });
		}
	};
	
	handleSubmit = (event) => {
		event.preventDefault();
		
		const { candidateId, voterId, pin } = this.state;
		
		this.props.castVote(voterId, pin, candidateId);
		
	};
	
	componentDidMount() {
		const { electionId } = this.props.match.params;
		this.props.fetchElection(electionId);
		this.props.getElectionCandidates(electionId);
	}
	
	castVoteForm = () => {
		const options = this.props.candidates.map((candidate) => ({
			value : candidate.candidateId,
			text : candidate.candidateName
		}));
		
		return (
			<Form onSubmit={this.handleSubmit}>
				<Form.Field>
					<label>Candidate</label>
					<Dropdown
						options={options}
						placeholder="Candidate"
						name="candidateId"
						onChange={this.handleChange}
						fluid
						selection
						selectOnBlur={false}
					/>
				</Form.Field>
				<Form.Field>
					<label>Voter Id</label>
					<Input icon="address card outline" iconPosition="left" name="voterId"
					       placeholder="Voter Id"
					       value={this.state.voterId} onChange={this.handleChange}/>
				</Form.Field>
				<Form.Field>
					<label>PIN</label>
					<Input icon="key" iconPosition="left" name="pin"
					       placeholder="PIN" type="password"
					       value={this.state.pin} onChange={this.handleChange}/>
				</Form.Field>
				<Button type="submit" floated="right" loading={this.props.isLoading}>Cast Vote</Button>
			</Form>
		)
	};
	
	
	render() {
		const loading = this.props.isFetchingElection || this.props.isFetchingCandidates;
		
		if (loading) {
			return (
				<Dimmer active>
					<Loader active inline="centered">Loading</Loader>
				</Dimmer>
			);
		}
		
		const today = new Date().getTime();
		const endDate = this.props.election.endDate.getTime();
		const electionActive = this.props.election.freeze && today < endDate;
		
		return (
			<div>
				<br/><br/>
				<Header as="h1" dividing>
					<Icon name="hand point up outline"/>
					<Header.Content>Cast Vote</Header.Content>
				</Header>
				
				<br/>
				<Container>
					<Header as="h3" dividing>
						<Icon name="balance scale"/>
						<Header.Content>Election</Header.Content>
					</Header>
					<p>{this.props.election.electionName}</p>
					
					<br/><br/>
					
					{electionActive ? this.castVoteForm() :
						(
							<p>
								Can't vote right now :-(
							</p>
						)
					}
				</Container>
			</div>
		);
	}
}

function mapStateToProp(state) {
	return {
		election : state.election.election,
		candidates : state.candidates.candidates,
		isFetchingElection : state.election.isLoading,
		isFetchingCandidates : state.candidates.isLoading,
		isLoading : state.castVote.isLoading
	};
}

export default connect(mapStateToProp, { fetchElection, getElectionCandidates, castVote })(CastVote);
