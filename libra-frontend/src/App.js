import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import editPatient from './pages/editPatient';
// Components

import Patients from './components/patients.component';

import MatchmakerUIComponent from './components/MatchmakerUIComponent';


function App() {
  
  return (
    <div className="App">
      <Router>
        <Switch>
          {/* Insert Page routes here: */}
          {/*<Route path="/" component={}/>*/}
          <Route exact path="/editPatient" component={editPatient}/>
          <Route exact path="/matchmaker" component={MatchmakerUIComponent}/>
          <Route exact path="/managePatients" component={Patients}/>
        </Switch>
      </Router>
    </div>
  );          

}

export default App;