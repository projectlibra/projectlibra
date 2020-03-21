import React, { Component } from 'react';
import Project from '../components/Project'

class Projects extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Project name="Hello"/>
      </div>
    )
  }
}

export default Projects;