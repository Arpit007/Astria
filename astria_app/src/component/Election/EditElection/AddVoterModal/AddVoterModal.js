/**
 * Created by Home Laptop on 24-Apr-19.
 */
import { connect } from "react-redux";
import React, { Component } from 'react';
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";

import { addElectionVoter } from "../../../../store/action/election";

class AddVoterModal extends Component {
	
	state = {
		open : false,
		closeOnSuccess : false,
		voterId : ""
	};
	
	close = () => this.setState({ open : false });
	
	handleChange = (event, { name, value }) => {
		if (this.state.hasOwnProperty(name)) {
			this.setState({ [ name ] : value });
		}
	};
	
	handleSubmit = (event) => {
		event.preventDefault();
		const { voterId } = this.state;
		
		this.props.addElectionVoter(voterId);
		this.setState({ closeOnSuccess : true });
	};
	
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.state.closeOnSuccess && !nextProps.loading) {
			this.setState({ voterId : "" });
			this.close();
		}
	}
	
	openModal = () => {
		this.setState({ open : true });
	};
	
	render() {
		return (
			<Modal
				open={this.state.open}
				closeOnEscape={true}
				closeOnDimmerClick={false}
				onClose={this.close}
				trigger={<Button floated="right" onClick={this.openModal} disabled={!this.props.enable}>Add Voter</Button>} closeIcon>
				<Header icon="add user" content="Add Voter"/>
				<Modal.Content>
					<Form id="voterForm" onSubmit={this.handleSubmit}>
						<Form.Field>
							<label>Voter ID</label>
							<Input icon="address card outline" iconPosition="left" name="voterId"
							       placeholder="Voter ID"
							       value={this.state.voterId} onChange={this.handleChange}/>
						</Form.Field>
					</Form>
				</Modal.Content>
				
				<Modal.Actions>
					<Button onClick={this.close} negative={true} disabled={this.props.loading}>
						Cancel
					</Button>
					<Button positive={true} form="voterForm" loading={this.props.loading} type="submit">
						Add Voter
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

function mapStateToProp(state) {
	return {
		loading : state.addVoter.isLoading
	};
}

export default connect(mapStateToProp, { addElectionVoter })(AddVoterModal);
