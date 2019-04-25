/**
 * Created by Home Laptop on 25-Apr-19.
 */
import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Header, Modal } from "semantic-ui-react";
import { closeErrorModal } from "../../store/action/error";

class ErrorModal extends Component {
	close = () => {
		this.props.closeErrorModal();
	};
	
	render() {
		return (
			<Modal
				open={this.props.openModal}
				closeOnEscape={true}
				closeOnDimmerClick={false}
				onClose={this.close} closeIcon>
				<Header icon="warning sign" content="Error"/>
				<Modal.Content>
					<p>
						{this.props.err}
					</p>
				</Modal.Content>
			</Modal>
		);
	}
}

function mapStateToProp(state) {
	return {
		err : state.error.err,
		openModal : state.error.openModal
	};
}

export default connect(mapStateToProp, { closeErrorModal })(ErrorModal);
