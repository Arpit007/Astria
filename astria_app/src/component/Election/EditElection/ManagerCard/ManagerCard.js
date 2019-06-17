/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React from 'react';
import { Card, Header, Icon } from "semantic-ui-react";

const ManagerCard = (props) => {
	const { manager } = props;
	return (
		<Card>
			<Card.Content>
				<Card.Header>{manager.profile.name}</Card.Header>
			</Card.Content>
			<Card.Content extra={true}>
				<Card.Description>
					<Header as="h5">
						<Icon name="phone"/>
						<Header.Content>Phone</Header.Content>
					</Header>
					{manager.profile.phone}
					<Header as="h5">
						<Icon name="mail"/>
						<Header.Content>Email</Header.Content>
					</Header>
					{manager.email}
				</Card.Description>
			</Card.Content>
		</Card>
	);
};

export default ManagerCard;
