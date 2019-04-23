/**
 * Created by Home Laptop on 23-Apr-19.
 */
import React, { Component } from 'react';
import { Button, Card, Input } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Link } from "react-router-dom";

class SignUp extends Component {
	render() {
		return (
			<Card>
				<Card.Content>
					<Card.Header>Sign Up</Card.Header>
					<Card.Description>
						<Form>
							<Form.Field>
								<Input icon="user" type="name" iconPosition="left" placeholder="Name"/>
							</Form.Field>
							<Form.Field>
								<Input icon="phone" type="phone" iconPosition="left" placeholder="Phone"/>
							</Form.Field>
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
						Existing User?&nbsp;
						<Link to={"/auth/signIn"} className="a-blue">Sign In!</Link>
					</p>
				</Card.Content>
			</Card>
		);
	}
}

export default SignUp;
