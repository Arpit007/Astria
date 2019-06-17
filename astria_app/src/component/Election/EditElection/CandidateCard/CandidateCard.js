/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React from 'react';
import { Card, Header, Icon } from "semantic-ui-react";

const showVotesSection = (showVotes, voteCount) => {
	return showVotes ? (
		<div>
			<Header as="h5">
				<Icon name="archive"/>
				<Header.Content>Votes</Header.Content>
			</Header>
			{voteCount}
		</div>
	) : null;
};

const CandidateCard = (props) => {
	const { candidate } = props;
	return (
		<Card>
			<Card.Content>
				<Card.Header>{candidate.candidateName}</Card.Header>
			</Card.Content>
			<Card.Content extra={true}>
				<Card.Description>
					{showVotesSection(props.showVotes, props.voteCount)}
					<Header as="h5">
						<Icon name="globe"/>
						<Header.Content>URI</Header.Content>
					</Header>
					{candidate.logoURI}
				</Card.Description>
			</Card.Content>
		</Card>
	);
};

export default CandidateCard;
