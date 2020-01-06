import React from 'react';
import './App.css';
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
        </Switch>
      </Router>
    </div>  
  );             
}

export default App;
