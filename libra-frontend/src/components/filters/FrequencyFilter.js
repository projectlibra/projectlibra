import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class FrequencyFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {dbsnp: "any", _1kgenome: "any", _1kfrequency: "1"};

        this.onChangeDbsnp = this.onChangeDbsnp.bind(this);
        this.onChange1k = this.onChange1k.bind(this);
        this.onChange1kfrequency = this.onChange1kfrequency.bind(this);
    }

    onChangeDbsnp(event) {
        this.setState({dbsnp: event.target.value},
            this.props.handleFilterChange({filterDbsnp: event.target.value, 
            filter1k: this.state._1kgenome, 
            _1kfrequency: this.state._1kfrequency})
            );    
    }

    onChange1k(event) {
        this.setState({_1kgenome: event.target.value},
            this.props.handleFilterChange({filterDbsnp: this.state.dbsnp, 
            filter1k: event.target.value, 
            _1kfrequency: this.state._1kfrequency})
            );
    }

    onChange1kfrequency(event) {
        this.setState({_1kfrequency: event.target.value}, 
            this.props.handleFilterChange({filterDbsnp: this.state.dbsnp, 
            filter1k: this.state._1kgenome, 
            _1kfrequency: event.target.value})
            );
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

                <FormLabel component="legend">1000G Frequency</FormLabel>
                <RadioGroup aria-label="1kfrequency" name="_1kfrequency" value={this.state._1kfrequency} onChange={this.onChange1kfrequency}>
                    <FormControlLabel value="0" control={<Radio />} label="0" />
                    <FormControlLabel value="0.001" control={<Radio />} label="1‰" />
                    <FormControlLabel value="0.01" control={<Radio />} label="1%" />
                    <FormControlLabel value="0.05" control={<Radio />} label="5%" />
                    <FormControlLabel value="1" control={<Radio />} label="1" />
                </RadioGroup>
            </FormControl>
        );
    }
}

export default FrequencyFilter;