/**
 * Created by Home Laptop on 24-Apr-19.
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchElection } from "../../../store/action/election";
import { Button, Container, Dimmer, Form, Header, Icon, Input, Loader } from "semantic-ui-react";
import { verifyVote } from "../../../store/action/voter";

class VerifyVote extends Component {
	
	state = {
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
		
		const { voterId, pin } = this.state;
		this.props.verifyVote(voterId, pin);
	};
	
	componentDidMount() {
		const { electionId } = this.props.match.params;
		this.props.fetchElection(electionId);
	}
	
	verifyVoteForm = () => {
		return (
			<Form onSubmit={this.handleSubmit}>
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
				<Button type="submit" floated="right" loading={this.props.isLoading}>Verify Vote</Button>
			</Form>
		)
	};
	
	
	render() {
		const loading = this.props.isFetchingElection;
		
		if (loading) {
			return (
				<Dimmer active>
					<Loader active inline="centered">Loading</Loader>
				</Dimmer>
			);
		}
		
		const {voteDecKey} = this.props.election;
		const electionComplete = voteDecKey !== undefined && voteDecKey.length > 0;
		
		return (
			<div>
				<br/><br/>
				<Header as="h1" dividing>
					<Icon name="hand point up outline"/>
					<Header.Content>Verify Vote</Header.Content>
				</Header>
				
				<br/>
				<Container>
					<Header as="h3" dividing>
						<Icon name="balance scale"/>
						<Header.Content>Election</Header.Content>
					</Header>
					<p>{this.props.election.electionName}</p>
					
					<br/><br/>
					
					{electionComplete ? this.verifyVoteForm() :
						(
							<p>
								Can't verify vote right now :-(
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
		isFetchingElection : state.election.isLoading,
		isLoading : state.verifyVote.isLoading
	};
}

export default connect(mapStateToProp, { fetchElection, verifyVote })(VerifyVote);
