import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Login from './components/Login'
import Forgot from './components/Forgot'
import CreatePatientProfile from './components/CreatePatientProfile'
import { BrowserRouter as Router,  Switch,  Route,  Link} from "react-router-dom";


function App() {
  return (
    <div className="App">
    
  	<Router>
    	<Switch>
    		<Route exact path="/login">
				<Login />
			</Route>
			<Route exact path="/forgot">
				<Forgot />
			</Route>
			<Route exact path="/createPatientProfile">
				<CreatePatientProfile />
			</Route>
		</Switch>
		
    </Router>
    </div>
  );
}

export default App;
