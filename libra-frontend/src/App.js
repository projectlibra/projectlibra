import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';
import BuildQuery from './components/BuildQuery';
import VCFUpload from './components/VCFUpload';
import ButtonAppBar from "./components/ButtonAppBar"
// Components
import Patients from './components/patients.component';
import editPatient from './pages/editPatient';
import Login from './components/Login'
import SignUp from './components/SignUp'
import Forgot from './components/Forgot'
import CreatePatientProfile from './components/CreatePatientProfile'
import MatchmakerUIComponent from './components/MatchmakerUIComponent';
import Homepage from './components/Homepage';
import VcfFiles from './components/VcfFiles';

import WebSocketInstance from './websocket';

class App extends React.Component{

  componentDidMount(){
    WebSocketInstance.connect();
  }

  constructor(props) {
      super(props);
      this.state = {}
      
      this.waitForSocketConnection(() => {
        //WebSocketInstance.sendMessage("{abc: abc}");
      });
  }

  waitForSocketConnection(callback) {
      const component = this;
      setTimeout(
          function () {
          if (WebSocketInstance.state() === 1) {
              console.log("Connection is made")
              callback();
              return;
          } else {
              console.log("wait for connection...")
              component.waitForSocketConnection(callback);
          }
      }, 100);
  }

  render() {
    return (
      <div className="App">
        <Router>
          <ButtonAppBar />
          <br></br>
          <Switch>
            {/* Insert Page routes here: */}
            {/*<Route path="/" component={}/>*/}
  
            <Route exact path="/editPatient" component={editPatient} />
            <Route exact path="/matchmaker" component={MatchmakerUIComponent} />
            <Route exact path="/managePatients" component={Patients} />
            <Route exact path="/buildquery" component={BuildQuery} />
            <Route exact path="/vcfupload" component={VCFUpload} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/forgot" component={Forgot} />
            <Route exact path="/createPatientProfile" component={CreatePatientProfile} />
            <Route exact path="/list-files" component={VcfFiles} />
            <Route exact path="/" component={Homepage} />
          </Switch>
        </Router>
      </div>
    );   
  }
}

export default App;