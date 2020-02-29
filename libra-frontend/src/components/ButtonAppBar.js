import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const ButtonAppBar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={Link} to="/">
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            LIBRA
          </Typography>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/vcfupload">VCF UPLOAD</Button>
          <Button color="inherit" component={Link} to="/buildquery">Query Builder</Button>
          <Button color="inherit" component={Link} to="/createPatientProfile">Create Patient</Button>
          <Button color="inherit" component={Link} to="/editPatient">Edit Patient</Button>
          <Button color="inherit" component={Link} to="/managePatients">Manage Patients</Button>
          <Button color="inherit" component={Link} to="/matchmaker">Matchmaker</Button>
          <Button color="inherit">Sign Out</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default ButtonAppBar;