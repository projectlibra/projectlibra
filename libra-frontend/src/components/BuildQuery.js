import React from 'react';
import BasicQuery from "./BasicQuery";
// import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function BuildQuery() {

  const classes = useStyles();
  const [state, setState] = React.useState({
    qb: false,
    opt1: false,
    opt2: false,
    opt3: false,
    opt4: false,
    opt5: false,
    opt6: false,
    opt7: false,
    opt8: false,
    opt9: false,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };


  const handleClick = () => {
    setState({
      qb: true
    })
  }
  const { opt1, opt2, opt3, opt4, opt5, opt6, opt7, opt8, opt9 } = state;
  var basicQuery = null;
  if (state.qb) {
    basicQuery = (
      <div>
        <BasicQuery />
      </div>
    )
  }
  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Choose the filters you want to use: </FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={opt1} onChange={handleChange('opt1')} value="opt1" />}
            label="Filter on genotypes"
          />
          <FormControlLabel
            control={<Checkbox checked={opt2} onChange={handleChange('opt2')} value="opt2" />}
            label="Find out which samples have a variant"
          />
          <FormControlLabel
            control={
              <Checkbox checked={opt3} onChange={handleChange('opt3')} value="opt3" />
            }
            label="Provide a flattened view of samples"
          />
          <FormControlLabel
            control={
              <Checkbox checked={opt4} onChange={handleChange('opt4')} value="opt4" />
            }
            label="Find out which families have a variant"
          />
          <FormControlLabel
            control={
              <Checkbox checked={opt5} onChange={handleChange('opt5')} value="opt5" />
            }
            label="Restrict query to a specific region"
          />
          <FormControlLabel
            control={
              <Checkbox checked={opt6} onChange={handleChange('opt6')} value="opt6" />
            }
            label="Restrict query to specified samples"
          />
          <FormControlLabel
            control={
              <Checkbox checked={opt7} onChange={handleChange('opt7')} value="opt7" />
            }
            label="Change the sample list delimiter"
          />
          <FormControlLabel
            control={
              <Checkbox checked={opt8} onChange={handleChange('opt8')} value="opt8" />
            }
            label="Report query output in an alternate format"
          />
          <FormControlLabel
            control={
              <Checkbox checked={opt9} onChange={handleChange('opt9')} value="opt9" />
            }
            label="Summarize carrier status"
          />
        </FormGroup>
      </FormControl>
      <Button width="25%" height="25%" variant="contained" color="primary" onClick={handleClick}>Build a Query</Button>
      {basicQuery}
    </div>
  );
}
