/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Button, Divider, Form, Header, Icon, Input } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import { formatDate } from "../../../util/format";

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
	
	render() {
		const { election } = this.props;
		return (
			<div>
				<Header as="h1" dividing>
					<Icon name="balance scale"/>
					<Header.Content>Edit Election</Header.Content>
				</Header>
				
				<Header as="h5">Election Name</Header>
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
				<br/>
				<br/>
				
				<Divider/>
			
			</div>
		);
	}
}

function mapStateToProp(state) {
	return {
		election : state.election,
		profile : state.profile
	};
}

export default connect(mapStateToProp, {})(EditElection);

// Todo: Fetch Managers and candidates
