import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from "react-router-dom";

import {connect} from "react-redux";
import {logout} from "../redux/actions/auth";

import { withRouter } from "react-router";


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#2E3B55'
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

const ButtonAppBar = (props) => {
  const classes = useStyles();
  const onFinish = () => {
    props.onLogOut();
    props.history.push('/');
  }

  if(props.token) {
    return (<div className={classes.root}>
      <AppBar position="static" className={classes.root} >
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={Link} to="/">
            <HomeIcon />
          </IconButton>
          <Typography color="inherit" variant="h6" className={classes.title}>
            LIBRA - Welcome {props.username}
          </Typography>
          {/*
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/vcfupload">VCF UPLOAD</Button>
          <Button color="inherit" component={Link} to="/buildquery">Query Builder</Button>
          <Button color="inherit" component={Link} to="/createPatientProfile">Create Patient</Button>
          <Button color="inherit" component={Link} to="/editPatient">Edit Patient</Button>
          <Button color="inherit" component={Link} to="/managePatients">Manage Patients</Button>
          <Button color="inherit" component={Link} to="/matchmaker">Matchmaker</Button>
          */}
          <Button color="inherit" component={Link} to="/projects">My Projects</Button>
          <Button color="inherit" component={Link} to="/patients">My Patients</Button>
          <Button color="inherit" component={Link} to="/userSettings">My Profile</Button>
          <Button color="inherit" onClick={onFinish}>Sign Out</Button>
        </Toolbar>
      </AppBar>
    </div>)
  }
  else {
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.root}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={Link} to="/">
              <HomeIcon />
            </IconButton>
            <Typography color="inherit" variant="h6" className={classes.title}>
              LIBRA 
            </Typography>
            {/*
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/vcfupload">VCF UPLOAD</Button>
            <Button color="inherit" component={Link} to="/buildquery">Query Builder</Button>
            <Button color="inherit" component={Link} to="/createPatientProfile">Create Patient</Button>
            <Button color="inherit" component={Link} to="/editPatient">Edit Patient</Button>
            <Button color="inherit" component={Link} to="/managePatients">Manage Patients</Button>
            <Button color="inherit" component={Link} to="/matchmaker">Matchmaker</Button>
            */}
            <Button color="inherit" component={Link} to="/login">Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    token: localStorage.getItem('token') 
  }
}
const mapDispatchToProps = dispatch => {
  return {
      onLogOut: () => dispatch(logout()) 
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ButtonAppBar));

