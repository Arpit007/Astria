/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Card, Header, Icon } from "semantic-ui-react";

import ElectionCard from "../Election/ElectionCard/ElectionCard";

class Home extends Component {
	render() {
		return (
			<div>
				<Header as="h1" dividing>
					<Icon name="balance scale"/>
					<Header.Content>All Elections</Header.Content>
				</Header>
				
				<Card.Group>
					{this.props.allElections.map((election, i) => <ElectionCard key={i} election={election}/>)}
				</Card.Group>
			</div>
		);
	}
}

function mapStateToProp(state) {
	return {
		allElections : state.allElections
	};
}

export default connect(mapStateToProp, {})(Home);
