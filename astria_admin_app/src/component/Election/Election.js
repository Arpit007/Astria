/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import EditElection from "./EditableElection/EditElection";
import ViewElection from "./ViewElection/ViewElection";

class Election extends Component {
	// Todo: Load Election
	
	componentDidMount() {
		const { electionId } = this.props.match.params;
	}
	
	render() {
		return (this.props.election.adminId === this.props.profile.userId) ? <EditElection/> : <ViewElection/>;
	}
}

function mapStateToProp(state) {
	return {
		election : state.election,
		profile : state.profile
	};
}

export default connect(mapStateToProp, {})(Election);
