/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import { Form } from "semantic-ui-react";
import { Button, Card, Input } from "semantic-ui-react";
import { Link } from "react-router-dom";

class SignIn extends Component {
	render() {
		return (
			<Card>
				<Card.Content>
					<Card.Header>Sign In</Card.Header>
					<Card.Description>
						<Form>
							<Form.Field>
								<Input icon="mail" type="email" iconPosition="left" placeholder="Email"/>
							</Form.Field>
							<Form.Field>
								<Input icon="key" type="password" iconPosition="left"
								       placeholder="Password"/>
							</Form.Field>
							<Button type="submit" fluid>Submit</Button>
						</Form>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<p className="text-center">
						New User?&nbsp;
						<Link to="/auth/signUp" className="a-blue">Sign Up!</Link>
					</p>
				</Card.Content>
			</Card>
		);
	}
}

export default SignIn;

// Todo: Fill Form, and Sign In