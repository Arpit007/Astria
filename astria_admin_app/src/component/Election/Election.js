/**
 * Created by Home Laptop on 23-Apr-19.
 */
import { connect } from "react-redux";
import React, { Component } from 'react';
import { Dimmer, Loader } from "semantic-ui-react";

import EditElection from "./EditElection/EditElection";
import ViewElection from "./ViewElection/ViewElection";
import { fetchElection, getElectionCandidates, getElectionManagers } from "../../store/action/election";

class Election extends Component {
	componentDidMount() {
		const { electionId } = this.props.match.params;
		this.props.fetchElection(electionId);
		this.props.getElectionCandidates(electionId);
		this.props.getElectionManagers(electionId);
	}
	
	render() {
		const loading = this.props.isFetchingElection || this.props.isFetchingCandidates || this.props.isFetchingManagers;
		
		if (loading) {
			return (
				<Dimmer active>
					<Loader active inline="centered">Loading</Loader>
				</Dimmer>
			)
		} else {
			const { election, profile } = this.props;
			return (election.adminId === profile.userId || election.managers.indexOf(profile.userId) !== -1) ?
				<EditElection/> : <ViewElection/>;
		}
	}
}

function mapStateToProp(state) {
	return {
		election : state.election.election,
		profile : state.profile.profile,
		isFetchingElection : state.election.isLoading,
		isFetchingCandidates : state.candidates.isLoading,
		isFetchingManagers : state.managers.isLoading
	};
}

export default connect(mapStateToProp, { fetchElection, getElectionManagers, getElectionCandidates })(Election);
