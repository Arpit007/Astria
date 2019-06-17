/**
 * Created by Home Laptop on 24-Apr-19.
 */
import { connect } from "react-redux";
import React, { Component } from 'react';
import { Button, Form, Header, Input, Modal, TextArea } from "semantic-ui-react";

import { publishElectionResult } from "../../../../store/action/election";

class PublishResultModal extends Component {
	
	state = {
		open : false,
		closeOnSuccess : false,
		adminKey : "",
		managerKeys : ""
	};
	
	close = () => this.setState({ open : false });
	
	handleChange = (event, { name, value }) => {
		if (this.state.hasOwnProperty(name)) {
			this.setState({ [ name ] : value });
		}
	};
	
	handleSubmit = (event) => {
		event.preventDefault();
		const { adminKey, managerKeys } = this.state;
		
		const managerKeyVals = managerKeys.length > 0 ? managerKeys.split("\n") : [];
		
		this.props.publishElectionResult(adminKey, managerKeyVals);
		this.setState({ closeOnSuccess : true });
	};
	
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.state.closeOnSuccess && !nextProps.loading) {
			this.setState({ adminKey : "", managerKeys : "" });
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
				trigger={<Button fluid={true} color="green" onClick={this.openModal} disabled={!this.props.enable}>
					Publish Result
				</Button>} closeIcon>
				<Header icon="lock open" content="Publish Result"/>
				<Modal.Content>
					<Form id="resultForm" onSubmit={this.handleSubmit}>
						<Form.Field>
							<label>Admin Key</label>
							<Input icon="key" iconPosition="left" name="adminKey"
							       placeholder="Admin Key"
							       value={this.state.adminKey} onChange={this.handleChange}/>
						</Form.Field>
						<Form.Field>
							<label>Manager Keys</label>
							<TextArea rows={2} placeholder="Manager Keys" name="managerKeys"
							          value={this.state.managerKeys} onChange={this.handleChange}/>
						</Form.Field>
					</Form>
				</Modal.Content>
				
				<Modal.Actions>
					<Button onClick={this.close} negative={true} disabled={this.props.loading}>
						Cancel
					</Button>
					<Button positive={true} form="resultForm" loading={this.props.loading} type="submit">
						Publish Result
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

function mapStateToProp(state) {
	return {
		loading : state.publishResult.isLoading
	};
}

export default connect(mapStateToProp, { publishElectionResult })(PublishResultModal);
