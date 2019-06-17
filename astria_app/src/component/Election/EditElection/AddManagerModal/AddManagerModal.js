/**
 * Created by Home Laptop on 24-Apr-19.
 */
import { connect } from "react-redux";
import React, { Component } from 'react';
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";

import { addElectionManager } from "../../../../store/action/election";

class AddManagerModal extends Component {
	
	state = {
		open : false,
		closeOnSuccess : false,
		email : ""
	};
	
	close = () => this.setState({ open : false });
	
	handleChange = (event, { name, value }) => {
		if (this.state.hasOwnProperty(name)) {
			this.setState({ [ name ] : value });
		}
	};
	
	handleSubmit = (event) => {
		event.preventDefault();
		const { email } = this.state;
		
		this.props.addElectionManager(email);
		this.setState({ closeOnSuccess : true });
	};
	
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.state.closeOnSuccess && !nextProps.loading) {
			this.setState({ email : "" });
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
				trigger={<Button floated="right" onClick={this.openModal} disabled={!this.props.enable}>Add Manager</Button>} closeIcon>
				<Header icon="sitemap" content="Add Manager"/>
				<Modal.Content>
					<Form id="managerForm" onSubmit={this.handleSubmit}>
						<Form.Field>
							<label>Email</label>
							<Input icon="mail" iconPosition="left" name="email"
							       placeholder="Manager's Email"
							       value={this.state.email} onChange={this.handleChange}/>
						</Form.Field>
					</Form>
				</Modal.Content>
				
				<Modal.Actions>
					<Button onClick={this.close} negative={true} disabled={this.props.loading}>
						Cancel
					</Button>
					<Button positive={true} form="managerForm" loading={this.props.loading} type="submit">
						Add Manager
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

function mapStateToProp(state) {
	return {
		loading : state.addManager.isLoading
	};
}

export default connect(mapStateToProp, { addElectionManager })(AddManagerModal);
