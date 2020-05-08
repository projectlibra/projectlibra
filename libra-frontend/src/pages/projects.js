import React, { Component } from 'react';
import { Button, Row, Col, Divider } from 'antd';
import Project from '../components/Project';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import host from '../host';

const style = {display: 'flex', flexWrap: 'wrap'}



class Projects extends Component{
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      projects: []  
    }
  }

  openDialog = () => {
    this.setState({open: true});
  }
  closeDialog = () => {
    this.setState({open: false});
  }

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = () => {
    axios.get(host + '/project',{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        this.setState({
          projects: res.data
        })
      })
      .catch(err =>  {
        if(err.response) {
          console.log(axios.defaults.headers.common)
          console.log(err.response.data)
          if(err.response.status == 401) {
            this.props.history.push('/');
          }
        }
      })
  }

  handleChange = (e) => {
    let {id, value} = e.target;
    this.setState({
      [id]: value
    });
  }

  submitDialog = () => {
    axios.post(host + '/project',{
      name: this.state.name,
      desc: this.state.desc
    },{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        this.setState({
          projects: res.data,
          open: false
        });
        this.fetchProjects();
      })
      .catch(err =>  {
        if(err.response) {
          console.log(axios.defaults.headers.common)
          console.log(err.response.data)
          if(err.response.status == 401) {
            this.props.history.push('/');
          }
        }
      });
      
  }
  
  render() {
    const {projects} = this.state
    const projectList = projects.length ? (
      projects.map(project => {
        return (
          <div key={project.id}>
            <Project name={project.name} desc={project.desc} id={project.id} project={project}/>
          </div>
        )
      })
    )
    :
    (
      <div> Loading Projects </div>
    )
    return (
      <div>
        <Button onClick={this.openDialog}>Create New Project</Button>
        <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
          Your Projects
        </Divider>
        
        <div style={style}>
        {projectList}
        </div>

        <Dialog open={this.state.open}  aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Create New Project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill the following content related to the project:
          </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Project Name"
              fullWidth
              onChange={this.handleChange}
            />
            <TextField
              margin="dense"
              id="desc"
              label="Project Description"
              fullWidth
              multiline
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.submitDialog} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default Projects;