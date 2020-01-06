import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Patients from './components/patients.component';

// Components

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          {/* Insert Page routes here: */}
          {/*<Route path="/" component={}/>*/}
          <Route exact path="/managePatients" component={Patients}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;