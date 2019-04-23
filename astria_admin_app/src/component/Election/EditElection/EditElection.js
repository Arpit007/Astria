/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Button, Card, Divider, Form, Header, Icon } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import { formatDate } from "../../../util/format";
import ManagerCard from "./ManagerCard/ManagerCard";
import CandidateCard from "./CandidateCard/CandidateCard";

class EditElection extends Component {
	state = {
		isAdmin : false,
		startDate : null,
		endDate : null
	};
	
	handleChange = (event, { name, value }) => {
		if (this.state.hasOwnProperty(name)) {
			this.setState({ [ name ] : value });
		}
	};
	
	componentDidMount() {
		const { election } = this.props;
		const isAdmin = election.adminId === this.props.profile.userId;
		this.setState({ isAdmin });
		this.setState({ startDate : formatDate(election.startDate) });
		this.setState({ endDate : formatDate(election.endDate) });
	}
	
	freezeElectionSection() {
		return (
			<div>
				<Header as="h3">
					<Icon name="lock"/>
					<Header.Content>Freeze Election</Header.Content>
				</Header>
				
				<br/>
				<Button fluid={true} color="red" disabled={!this.state.isAdmin}>Freeze Election</Button>
			</div>
		);
	}
	
	publishResults() {
		const today = new Date().getTime();
		const endDate = this.props.election.endDate.getTime();
		return (today < endDate) ? null : (
			<div>
				<Header as="h3">
					<Icon name="users"/>
					<Header.Content>Publish Results</Header.Content>
				</Header>
				
				<br/>
				<Button fluid={true} color="green" disabled={!this.state.isAdmin}>Publish Result</Button>
			</div>
		);
	}
	
	render() {
		const { election } = this.props;
		return (
			<div>
				<Header as="h1" dividing>
					<Icon name="balance scale"/>
					<Header.Content>Edit Election</Header.Content>
				</Header>
				
				<Header as="h4">Election Name</Header>
				<Icon name="balance scale"/>
				&nbsp;{election.electionName}
				
				<Divider/>
				
				<Form>
					<Form.Field>
						<label>Start Date</label>
						<DateTimeInput
							name="startDate"
							placeholder="Start Date"
							value={this.state.startDate}
							iconPosition="left"
							onChange={this.handleChange}
						/>
					</Form.Field>
					<Form.Field>
						<label>End Date</label>
						<DateTimeInput
							name="endDate"
							placeholder="End Date"
							value={this.state.endDate}
							iconPosition="left"
							onChange={this.handleChange}
						/>
					</Form.Field>
					<Button type="submit" floated="right" disabled={!this.state.isAdmin}>Update Dates</Button>
				</Form>
				
				<br/><br/>
				<Divider/>
				
				<Header as="h3">
					<Icon name="sitemap"/>
					<Header.Content>Managers</Header.Content>
				</Header>
				
				<Card.Group>
					{this.props.managers.map((manager) => <ManagerCard key={manager.userId} manager={manager}/>)}
				</Card.Group>
				
				<br/>
				<Button floated="right" disabled={!this.state.isAdmin}>Add Managers</Button>
				
				<br/><br/>
				<Divider/>
				
				<Header as="h3">
					<Icon name="users"/>
					<Header.Content>Candidates</Header.Content>
				</Header>
				
				<Card.Group>
					{this.props.candidates.map((candidate) => <CandidateCard key={candidate.candidateId}
					                                                         candidate={candidate}/>)}
				</Card.Group>
				
				<br/>
				<Button floated="right" disabled={!this.state.isAdmin}>Add Candidate</Button>
				
				<br/><br/>
				<Divider/>
				
				<Header as="h3">
					<Icon name="users"/>
					<Header.Content>Voters</Header.Content>
				</Header>
				
				<br/>
				<Button floated="right" disabled={!this.state.isAdmin}>Add Voters</Button>
				
				<br/><br/>
				<Divider/>
				
				{election.freeze ? this.publishResults() : this.freezeElectionSection()}
				
				<br/><br/>
			</div>
		);
	}
}

function mapStateToProp(state) {
	return {
		election : state.election,
		profile : state.profile,
		managers : state.managers,
		candidates : state.candidates
	};
}

export default connect(mapStateToProp, {})(EditElection);

// Todo: Fetch Managers and candidates
// Todo: Implement editing
