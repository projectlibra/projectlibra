import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';
import BuildQuery from './components/BuildQuery';
import VCFUpload from './components/VCFUpload';
import ButtonAppBar from "./components/ButtonAppBar"
// Components
import editPatient from './pages/editPatient';
import Login from './components/Login'
import SignUp from './components/SignUp'
import Forgot from './components/Forgot'
import CreatePatientProfile from './components/CreatePatientProfile'
import MatchmakerUIComponent from './components/MatchmakerUIComponent';
import Homepage from './components/Homepage';
import VcfFiles from './components/VcfFiles';
import Projects from './pages/projects'
import WebSocketInstance from './websocket';
import Upload from './components/BasicVCFUpload';
import ProjectDetail from './components/ProjectDetail';
import Sider from './components/ProjectDetailContainer';
import DZUploader from './components/DZUploader';
import PatientProfiles from './components/PatientProfiles';
import HPO from './components/HPO';
import MatchMaker from './components/MatchMaker'

class App extends React.Component{

  

  constructor(props) {
      super(props);
      this.state = {
        ws: null
      };
      
      /*
      this.waitForSocketConnection(() => {
        //WebSocketInstance.sendMessage("{abc: abc}");
      });*/
  }

  componentDidMount(){
    //this.connect();
  }

  timeout = 250;

  connect = () => {
    const ws = new WebSocket("ws://139.179.21.17:8881");
    const that = this;
    let connectInterval;

    ws.onopen = () => {
      console.log("Connected to websocket!");
      this.setState({ws: ws});
      that.timeout = 250;
      clearTimeout(connectInterval);
      
    };

    ws.onclose = (e) => {
      console.log(
          `Socket is closed. Reconnect will be attempted in ${Math.min(
              10000 / 1000,
              (that.timeout + that.timeout) / 1000
          )} second.`,
          e.reason
      );

      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout));
    };

    ws.onerror = err => {
      console.error(
          "Socket encountered error: ",
          err.message,
          "Closing socket"
      );

      ws.close();
    };

    ws.onmessage = evt => {
      // listen to data sent from the websocket server
      const msg = JSON.parse(evt.data)
      this.setState({ws_data: msg})
      console.log(msg)
    };

  };

  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
  };
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
      <div className="App" >
        <Router>
          <ButtonAppBar />
          
          
          <br></br>
          <div style={{paddingLeft: '20px', paddingRight: '20px'}}>
          <Switch >
            {/* Insert Page routes here: */}
            {/*<Route path="/" component={}/>*/}
            <Route exact path="/drop" component={Upload} />
            <Route exact path="/editPatient" component={editPatient} />
            <Route exact path="/matchmaker/:id" component={MatchMaker} />
            <Route exact path="/buildquery" component={BuildQuery} />
            <Route exact path="/vcfupload" component={VCFUpload} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/forgot" component={Forgot} />
            <Route exact path="/createPatientProfile" component={CreatePatientProfile} />
            <Route exact path="/patients" component={PatientProfiles} />
            <Route exact path="/projects" component={Projects} />
            <Route exact path="/projects/:id" component={ProjectDetail} />
            <Route exact path="/HPO/:id" component={HPO} />
            <Route exact path="/" component={Homepage} />
            <Route exact path="/hpo/:id" component={HPO} />
            {/*correct way to Route with props*/ }
            <Route exact path="/list-files" 
            render={ (props) =><VcfFiles {...props} ws={this.state.ws} ws_data={this.state.ws_data}  />} />
          </Switch>
          </div>
        </Router>
      </div>
    );   
  }
}

export default App;