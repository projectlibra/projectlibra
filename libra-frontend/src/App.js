import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import editPatient from './pages/editPatient';

// Components

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          {/* Insert Page routes here: */}
          {/*<Route path="/" component={}/>*/}
          <Route exact path="/editPatient" component={editPatient}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
