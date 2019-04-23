import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css'
import connect from "react-redux/es/connect/connect";

class App extends Component {
	
	componentDidMount() {
	}
	
	render() {
		return (
			<div>
				<div className="container">
					<Switch>
						{/*<Route path={"some"} exact={false} component={null}/>*/}
					</Switch>
				</div>
			</div>
		);
	}
}

export default connect(null, {})(App);