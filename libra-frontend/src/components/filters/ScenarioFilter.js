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
            genotype: "none"
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({genotype: event.target.value});

        if (event.target.value !== "none") {            
            this.props.handleFilterChange(event.target.value);
            console.log(event.target.value);
        } else {
            this.props.handleFilterChange("");
        }        
    }

    render() {
        return(
            <FormControl component="fieldset">
                <RadioGroup aria-label="genotype" name="genotype" value={this.state.genotype} onChange={this.handleChange} >
                    <FormControlLabel value="none" control={<Radio />} label="none" />
                    <FormControlLabel value="dominant" control={<Radio />} label="dominant" />
                    <FormControlLabel value="recessive" control={<Radio />} label="recessive" />
                    <FormControlLabel value="de novo" control={<Radio />} label="de novo" />
                    <FormControlLabel value="compund het" control={<Radio />} label="compund het" />
                    <FormControlLabel value="x linked" control={<Radio />} label="x linked" />
                </RadioGroup>
            </FormControl>
        );
    }
}

export default ScenarioFilter;