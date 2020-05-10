import React, { Component } from "react";
import "./Progress.css";

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="ProgressBar">
        <div
          className="Progress"
          style={{ width: this.props.progress + "%", height: "100%" }}
        >
          <span style={{float: 'right', color:'white'}}>%{this.props.progress}</span>
        </div>
        
      </div>
    );
  }
}

export default Progress;
