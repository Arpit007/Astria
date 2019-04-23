import React, { Component } from 'react';
import { Route, Switch } from "react-router";

import 'semantic-ui-css/semantic.min.css'
import Main from "../component/Main/Main";
import UserAuth from "../component/UserAuth/UserAuth";

class App extends Component {
	
	componentDidMount() {
	}
	
	render() {
		return (
			<div>
				<Switch>
					<Route path="/auth" component={UserAuth}/>
					<Route path="/" component={Main}/>
				</Switch>
			</div>
		);
	}
}

export default App;