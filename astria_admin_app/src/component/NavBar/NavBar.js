/**
 * Created by Home Laptop on 22-Apr-19.
 */
import { connect } from "react-redux";
import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom";
import { Container, Dropdown, Image, Menu } from "semantic-ui-react";

import { APP_NAME } from "../../data/config";
import { logoutUser } from "../../store/action/user";

class NavBar extends Component {
	render() {
		return (
			<Menu fixed="top" inverted>
				<Container>
					
					<Menu.Item as={Link} to="/" header>
						<Image size="mini" src="/logo_light.png" style={{ marginRight : '1.5em' }}/>
						{APP_NAME}
					</Menu.Item>
					
					<Menu.Item as={Link} to="/home">Home</Menu.Item>
					
					<Dropdown floating item simple text="Election">
						<Dropdown.Menu>
							<Dropdown.Item icon="save" text="My Elections" as={NavLink} to="/election/my"/>
							<Dropdown.Item icon="plus" text="New Elections" as={NavLink} to="/election/new"/>
						</Dropdown.Menu>
					</Dropdown>
					
					<Menu.Menu position="right">
						<Dropdown floating item simple text={this.props.profile.profile.name}>
							<Dropdown.Menu>
								<Dropdown.Item icon="user" text="Profile" as={NavLink} to="/profile"/>
								<Dropdown.Item icon="sign-out" text="Logout" onClick={() => this.props.logoutUser()}/>
							</Dropdown.Menu>
						</Dropdown>
					</Menu.Menu>
				</Container>
			</Menu>
		);
	}
}

function mapStateToProp(state) {
	return {
		profile : state.profile.profile
	};
}

export default connect(mapStateToProp, { logoutUser })(NavBar);
