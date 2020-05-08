import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class FrequencyFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {dbsnp: "any", _1kgenome: "any"};

        this.onChangeDbsnp = this.onChangeDbsnp.bind(this);
        this.onChange1k = this.onChange1k.bind(this);
    }

    onChangeDbsnp(event) {
        this.setState({dbsnp: event.target.value});

        //if (event.target.value !== "any") {            
        this.props.handleFrequencyFilterChange(["In dbsnp: " + event.target.value,"In 1k genome: " +  this.state._1kgenome]);
        console.log([event.target.value, this.state._1kgenome]);
            //console.log(event.target.value);
        //} else {
        //    this.props.handleFilterChange("any");
        //}       
    }

    onChange1k(event) {
        this.setState({_1kgenome: event.target.value});

        //if (event.target.value !== "any") {            
            this.props.handleFrequencyFilterChange(["In dbsnp: " + this.state.dbsnp,"In 1k genome: " + event.target.value]);
            console.log([this.state.dbsnp, event.target.value]);
            //console.log(event.target.value);
        //} else {
        //    this.props.handleFilterChange("any");
        //} 
    }

    render() {
        return(
            <FormControl component="fieldset">
                <FormLabel component="legend">In dbsnp</FormLabel>
                <RadioGroup aria-label="dbsnp" name="dbsnp" value={this.state.dbsnp} onChange={this.onChangeDbsnp}>
                    <FormControlLabel value="yes" control={<Radio />} label="yes" />
                    <FormControlLabel value="no" control={<Radio />} label="no" />
                    <FormControlLabel value="any" control={<Radio />} label="any" />
                </RadioGroup>

                <FormLabel component="legend">In 1k genome</FormLabel>
                <RadioGroup aria-label="1kgenome" name="_1kgenome" value={this.state._1kgenome} onChange={this.onChange1k}>
                    <FormControlLabel value="yes" control={<Radio />} label="yes" />
                    <FormControlLabel value="no" control={<Radio />} label="no" />
                    <FormControlLabel value="any" control={<Radio />} label="any" />
                </RadioGroup>
            </FormControl>
        );
    }
}

export default FrequencyFilter;