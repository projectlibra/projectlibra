import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';

import Patients from './components/patients.component';

import MatchmakerUIComponent from './components/MatchmakerUIComponent';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';


function App() {
  
  return (
    <div className="App">
      <Router>
        <Switch>
          {/* Insert Page routes here: */}
          {/*<Route path="/" component={}/>*/}

           <Route exact path="/matchmaker" component={MatchmakerUIComponent}/>
           <Route exact path="/managePatients" component={Patients}/>
        </Switch>
      </Router>
    </div>
  );

          
        </Switch>
      </Router>
    </div>  
  );             

}

export default App;