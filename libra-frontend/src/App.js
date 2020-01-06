import React from 'react';
import './App.css';
import BuildQuery from './components/BuildQuery';
import VCFDrop from './components/VCFDrop';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Button from '@material-ui/core/Button';

function App() {
  
  return (
    <div className="App">
      <Router>
        <Switch>
          {/* Insert Page routes here: */}
          {/*<Route path="/" component={}/>*/}
          <Route exact path="/buildquery" component={BuildQuery}/>
          <Route exact path="/vcfupload" component={VCFDrop}/>
          <Button
  variant="contained"
  component="label"
>
  Upload File
  <input
    type="file"
    style={{ display: "none" }}
  />
</Button>
        </Switch>
      </Router>
    </div>  
  );             
}

export default App;