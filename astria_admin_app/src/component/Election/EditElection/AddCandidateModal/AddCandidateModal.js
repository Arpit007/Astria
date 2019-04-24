/**
 * Created by Home Laptop on 24-Apr-19.
 */
import { connect } from "react-redux";
import React, { Component } from 'react';
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";

import { createElectionCandidate } from "../../../../store/action/election";

class AddCandidateModal extends Component {
	
	state = {
		open : false,
		closeOnSuccess : false,
		candidateName : "",
		logoURI : ""
	};
	
	close = () => this.setState({ open : false });
	
	handleChange = (event, { name, value }) => {
		if (this.state.hasOwnProperty(name)) {
			this.setState({ [ name ] : value });
		}
	};
	
	handleSubmit = (event) => {
		event.preventDefault();
		const { candidateName, logoURI } = this.state;
		
		this.props.createElectionCandidate(candidateName, logoURI);
		this.setState({ closeOnSuccess : true });
	};
	
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.state.closeOnSuccess && !nextProps.loading) {
			this.setState({ candidateName : "", logoURI : "" });
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
				trigger={<Button floated="right" onClick={this.openModal}>Add Candidate</Button>} closeIcon>
				<Header icon="add user" content="Add Candidate"/>
				<Modal.Content>
					<Form id="candidateForm" onSubmit={this.handleSubmit}>
						<Form.Field>
							<label>Name</label>
							<Input icon="user" iconPosition="left" name="candidateName"
							       placeholder="Candidate's Name"
							       value={this.state.candidateName} onChange={this.handleChange}/>
						</Form.Field>
						<Form.Field>
							<label>URI</label>
							<Input icon="globe" iconPosition="left" name="logoURI"
							       placeholder="Candidate's URI"
							       value={this.state.logoURI} onChange={this.handleChange}/>
						</Form.Field>
					</Form>
				</Modal.Content>
				
				<Modal.Actions>
					<Button onClick={this.close} negative={true} disabled={this.props.loading}>
						Cancel
					</Button>
					<Button positive={true} form="candidateForm" loading={this.props.loading} type="submit">
						Add Candidate
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

function mapStateToProp(state) {
	return {
		loading : state.createCandidate.isLoading
	};
}

export default connect(mapStateToProp, { createElectionCandidate })(AddCandidateModal);
