/**
 * Created by Home Laptop on 23-Apr-19.
 */
import { connect } from "react-redux";
import React, { Component } from 'react';
import { DateTimeInput } from "semantic-ui-calendar-react";
import { Button, Card, Divider, Form, Header, Icon } from "semantic-ui-react";

import { formatDate } from "../../../util/format";
import ManagerCard from "./ManagerCard/ManagerCard";
import AddVoterModal from "./AddVoterModal/AddVoterModal";
import CandidateCard from "./CandidateCard/CandidateCard";
import AddCandidateModal from "./AddCandidateModal/AddCandidateModal";
import { modifyElectionDates } from "../../../store/action/election";


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
	
	handleSubmit = (event) => {
		event.preventDefault();
		const { startDate, endDate } = this.state;
		
		this.props.modifyElectionDates(new Date(startDate), new Date(endDate));
	};
	
	componentDidMount() {
		const { election } = this.props;
		const isAdmin = election.adminId === this.props.profile.userId;
		this.setState({ isAdmin, startDate : formatDate(election.startDate), endDate : formatDate(election.endDate) });
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
				
				<Form onSubmit={this.handleSubmit}>
					<Form.Field>
						<label>Start Date</label>
						<DateTimeInput
							name="startDate"
							placeholder="Start Date"
							value={this.state.startDate}
							iconPosition="left"
							dateTimeFormat="llll"
							minDate={new Date()}
							closable={true}
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
							dateTimeFormat="llll"
							minDate={new Date()}
							closable={true}
							onChange={this.handleChange}
						/>
					</Form.Field>
					<Button type="submit" floated="right" loading={this.props.modifyDateLoading}>Update Dates</Button>
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
				<AddCandidateModal/>
				
				<br/><br/>
				<Divider/>
				
				<Header as="h3">
					<Icon name="users"/>
					<Header.Content>Voters</Header.Content>
				</Header>
				
				<br/>
				<AddVoterModal/>
				
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
		election : state.election.election,
		profile : state.profile.profile,
		managers : state.managers.managers,
		candidates : state.candidates.candidates,
		modifyDateLoading : state.modifyDates.isLoading
	};
}

export default connect(mapStateToProp, { modifyElectionDates })(EditElection);

// Todo: Implement editing
