import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const DatabaseSelectCheckbox = ()  => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    DECIPHER: true,
    GeneMatcher: false,
    matchbox: false,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const { DECIPHER, GeneMatcher, matchbox } = state;
  const error = [ DECIPHER, GeneMatcher, matchbox].filter(v => v).length !== 2;

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Select Database</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={DECIPHER} onChange={handleChange('DECIPHER')} value="DECIPHER" />}
            label="DECIPHER (UK)"
          />
          <FormControlLabel
            control={<Checkbox checked={GeneMatcher} onChange={handleChange('GeneMatcher')} value="GeneMatcher" />}
            label="GeneMatcher (USA)"
          />
          <FormControlLabel
            control={
              <Checkbox checked={matchbox} onChange={handleChange('matchbox')} value="matchbox" />
            }
            label="matchbox (USA)"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
}

export default DatabaseSelectCheckbox;