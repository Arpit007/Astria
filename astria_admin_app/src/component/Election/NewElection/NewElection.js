/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import { Button, Form, Header, Icon, Input } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import { formatDate } from "../../../util/format";

class NewElection extends Component {
	state = {
		startDate : formatDate(new Date()),
		endDate : formatDate(new Date())
	};
	
	handleChange = (event, { name, value }) => {
		if (this.state.hasOwnProperty(name)) {
			this.setState({ [ name ] : value });
		}
	};
	
	render() {
		return (
			<div>
				<Header as="h1" dividing>
					<Icon name="balance scale"/>
					<Header.Content>New Election</Header.Content>
				</Header>
				<Form>
					<Form.Field>
						<label>Election Name</label>
						<Input icon='balance scale' iconPosition='left'  placeholder="Election Name"/>
					</Form.Field>
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
					<Button type="submit" floated="right">Submit</Button>
				</Form>
			</div>
		);
	}
}

export default NewElection;

// Todo: Pickup form values and submit
