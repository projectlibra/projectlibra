import React, {Component} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class ScenarioFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            genotype: ""
        }
    }



    render() {
        return(
            <FormControl component="fieldset">
                <RadioGroup aria-label="gender" name="gender1" >
                    <FormControlLabel value="none" control={<Radio />} label="none" />
                    <FormControlLabel value="dominant" control={<Radio />} label="dominant" />
                    <FormControlLabel value="recessive" control={<Radio />} label="de novo" />
                    <FormControlLabel value="compund het" control={<Radio />} label="compund het" />
                    <FormControlLabel value="x linked" control={<Radio />} label="x linked" />
                </RadioGroup>
            </FormControl>
        );
    }
}

export default ScenarioFilter;