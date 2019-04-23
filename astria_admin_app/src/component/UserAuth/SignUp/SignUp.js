/**
 * Created by Home Laptop on 23-Apr-19.
 */
import { Link } from "react-router-dom";
import React, { Component } from 'react';
import { Form } from "semantic-ui-react";
import connect from "react-redux/es/connect/connect";
import { Button, Card, Input } from "semantic-ui-react";

import { registerUser } from "../../../store/action/auth";

class SignUp extends Component {
	
	state = {
		name : "",
		phone : "",
		email : "",
		password : ""
	};
	
	handleChange = (event, { name, value }) => {
		if (this.state.hasOwnProperty(name)) {
			this.setState({ [ name ] : value });
		}
	};
	
	handleSubmit = (event) => {
		event.preventDefault();
		const { name, phone, email, password } = this.state;
		this.props.registerUser(name, phone, email, password);
	};
	
	render() {
		return (
			<Card>
				<Card.Content>
					<Card.Header>Sign Up</Card.Header>
					<Card.Description>
						<Form onSubmit={this.handleSubmit}>
							<Form.Field>
								<Input icon="user" type="name" iconPosition="left" placeholder="Full Name" name="name"
								       value={this.state.name} onChange={this.handleChange}/>
							</Form.Field>
							<Form.Field>
								<Input icon="phone" type="phone" iconPosition="left" placeholder="Phone Number"
								       name="phone" value={this.state.phone} onChange={this.handleChange}/>
							</Form.Field>
							<Form.Field>
								<Input icon="mail" type="email" iconPosition="left" placeholder="Email" name="email"
								       value={this.state.email} onChange={this.handleChange}/>
							</Form.Field>
							<Form.Field>
								<Input icon="key" type="password" iconPosition="left" placeholder="Password"
								       name="password" value={this.state.password} onChange={this.handleChange}/>
							</Form.Field>
							<Button type="submit" fluid loading={this.props.loading}>Submit</Button>
						</Form>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<p className="text-center">
						Existing User?&nbsp;
						<Link to={"/auth/signIn"} className="a-blue">Sign In!</Link>
					</p>
				</Card.Content>
			</Card>
		);
	}
}

function mapStateToProp(state) {
	return {
		loading : state.auth_token.isLoading
	};
}

export default connect(mapStateToProp, { registerUser })(SignUp);
