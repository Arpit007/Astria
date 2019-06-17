/**
 * Created by Home Laptop on 23-Apr-19.
 */
import { connect } from "react-redux";
import { Redirect } from "react-router";
import React, { Component } from 'react';
import { DateTimeInput } from "semantic-ui-calendar-react";
import { Button, Form, Header, Icon, Input } from "semantic-ui-react";

import { createElection } from "../../../store/action/election";
import { formatDate } from "../../../util/format";


class NewElection extends Component {
	state = {
		electionName : "",
		startDate : formatDate(new Date()),
		endDate : formatDate(new Date()),
		redirectOnSuccess : false
	};
	
	handleChange = (event, { name, value }) => {
		if (this.state.hasOwnProperty(name)) {
			this.setState({ [ name ] : value });
		}
	};
	
	handleSubmit = (event) => {
		event.preventDefault();
		
		this.setState({ redirectOnSuccess : true });
		const { electionName, startDate, endDate } = this.state;
		
		this.props.createElection(electionName, new Date(startDate), new Date(endDate));
	};
	
	componentWillReceiveProps(nextProps, nextContext) {
		
		if (this.state.redirectOnSuccess && nextProps.err) {
			this.setState({ redirectOnSuccess : false });
		}
	}
	
	render() {
		
		const redirect = !this.props.isLoading && this.state.redirectOnSuccess && !this.props.err;
		
		return redirect ? <Redirect to="/home"/> :
			(
				<div>
					<Header as="h1" dividing>
						<Icon name="balance scale"/>
						<Header.Content>New Election</Header.Content>
					</Header>
					<Form onSubmit={this.handleSubmit}>
						<Form.Field>
							<label>Election Name</label>
							<Input icon="balance scale" iconPosition="left" name="electionName"
							       placeholder="Election Name"
							       value={this.state.electionName} onChange={this.handleChange}/>
						</Form.Field>
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
						<Button type="submit" floated="right" loading={this.props.isLoading}>Submit</Button>
					</Form>
				</div>
			);
	}
}

function mapStateToProp(state) {
	return {
		isLoading : state.createElection.isLoading,
		redirect : state.createElection.redirect,
		err : state.createElection.err
	};
}

export default connect(mapStateToProp, { createElection })(NewElection);
