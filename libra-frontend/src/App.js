import React from 'react';
import { BrowserRouter as Router,  Switch,  Route,  Link} from "react-router-dom";
import './App.css';
import BuildQuery from './components/BuildQuery';
import VCFDrop from './components/VCFDrop';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Button from '@material-ui/core/Button';

import ButtonAppBar from "./components/ButtonAppBar"
// Components

import Patients from './components/patients.component';
import editPatient from './pages/editPatient';
import Login from './components/Login'
import Forgot from './components/Forgot'
import CreatePatientProfile from './components/CreatePatientProfile'
import MatchmakerUIComponent from './components/MatchmakerUIComponent';



function App() {
  
  return (
    <div className="App">
      <ButtonAppBar />
      <br></br>
      <Router>
        <Switch>
          {/* Insert Page routes here: */}
          {/*<Route path="/" component={}/>*/}
          <Route exact path="/editPatient" component={editPatient}/>
          <Route exact path="/matchmaker" component={MatchmakerUIComponent}/>
          <Route exact path="/managePatients" component={Patients}/>
          <Route exact path="/buildquery" component={BuildQuery}/>
          <Route exact path="/vcfupload" component={VCFDrop}/>
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