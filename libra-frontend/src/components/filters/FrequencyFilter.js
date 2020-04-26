import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class FrequencyFilter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <FormControl component="fieldset">
                <FormLabel component="legend">In dbsnp</FormLabel>
                <RadioGroup aria-label="dbsnp" name="dbsnp" >
                    <FormControlLabel value="yes" control={<Radio />} label="yes" />
                    <FormControlLabel value="no" control={<Radio />} label="no" />
                    <FormControlLabel value="any" control={<Radio />} label="any" />
                </RadioGroup>

                <FormLabel component="legend">In 1k genome</FormLabel>
                <RadioGroup aria-label="1kgenome" name="1kgenome" >
                    <FormControlLabel value="yes" control={<Radio />} label="yes" />
                    <FormControlLabel value="no" control={<Radio />} label="no" />
                    <FormControlLabel value="any" control={<Radio />} label="any" />
                </RadioGroup>
            </FormControl>
        );
    }
}

export default FrequencyFilter;