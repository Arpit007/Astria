/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React from 'react';
import { Card, Header, Icon } from "semantic-ui-react";
import { formatDate } from "../../../util/format";
import { Link } from "react-router-dom";

const ElectionCard = (props) => {
	const { election } = props;
	return (
		<Card as={Link} to={`/election/${election.electionId}`}>
			<Card.Content>
				<Card.Header>{election.electionName}</Card.Header>
			</Card.Content>
			<Card.Content extra={true}>
				<Card.Description>
					<Header as="h5">
						<Icon name="calendar outline"/>
						<Header.Content>Start Date</Header.Content>
					</Header>
					{formatDate(election.startDate)}
					<Header as="h5">
						<Icon name="calendar outline"/>
						<Header.Content>End Date</Header.Content>
					</Header>
					{formatDate(election.endDate)}
				</Card.Description>
			</Card.Content>
		</Card>
	);
};

export default ElectionCard;
