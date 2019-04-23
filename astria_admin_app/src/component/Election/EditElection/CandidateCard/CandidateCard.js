/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React from 'react';
import { Card, Header, Icon } from "semantic-ui-react";

const CandidateCard = (props) => {
	const { candidate } = props;
	return (
		<Card>
			<Card.Content>
				<Card.Header>{candidate.candidateName}</Card.Header>
			</Card.Content>
			<Card.Content extra={true}>
				<Card.Description>
					<Header as="h5">
						<Icon name="globe"/>
						<Header.Content>URL</Header.Content>
					</Header>
					{candidate.logoURI}
				</Card.Description>
			</Card.Content>
		</Card>
	);
};

export default CandidateCard;
