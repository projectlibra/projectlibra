import React from 'react';
import './App.css';
import BuildQuery from './components/BuildQuery';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
  
  return (
    <div className="App">
      <Router>
        <Switch>
          {/* Insert Page routes here: */}
          {/*<Route path="/" component={}/>*/}
          <Route exact path="/buildquery" component={BuildQuery}/>
        </Switch>
      </Router>
    </div>  
  );             
}

export default App;