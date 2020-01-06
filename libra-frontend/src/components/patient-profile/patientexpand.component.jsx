import React from 'react';
import './patient.styles.css';


export default class PatientExpand extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        // toggle box is closed initially
        opened: false,
      };
      // http://egorsmirnov.me/2015/08/16/react-and-es6-part3.html
      this.toggleBox = this.toggleBox.bind(this);
    }
    
    toggleBox() {
      // check if box is currently opened
      const { opened } = this.state;
      this.setState({
        // toggle value of `opened`
        opened: !opened,
      });
    }
    
    render() {
      const { title, children } = this.props;
      const { opened } = this.state;
      return (
        <div className="patientparent">
            <div className="patient">
                <div className="patient_title" onClick={this.toggleBox}>
                    {title}
                </div>
            </div>
            {opened && (
                <div class="boxContent">
                {children}
                </div>
            )}
        </div>
      );
    }
  }