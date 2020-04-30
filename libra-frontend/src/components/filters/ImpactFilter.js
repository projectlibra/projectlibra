import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class ImpactFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {high: false, medium: false, low: false, modifier: false, summary: ""};

        this.handleChange = this.handleChange.bind(this);
        this.updateSummary = this.updateSummary.bind(this);
    }

    handleChange(event) {
        var summaryString = this.updateSummary(event);
        this.setState({...this.state, [event.target.name]: event.target.checked});
        this.props.handleFilterChange(summaryString);
    }

    updateSummary(event) {
        var summaryString = "";
        if (this.state.high && event.target.name !== "high") {
            summaryString = summaryString + "high ";
        }  
        if (this.state.medium && event.target.name !== "medium") {
            summaryString = summaryString + "medium ";
        }  
        if (this.state.low && event.target.name !== "low") {
            summaryString = summaryString + "low ";
        }  
        if (this.state.modifier && event.target.name !== "modifier") {
            summaryString = summaryString + "modifier ";
        }  
        if (event.target.checked) {
            summaryString = summaryString + event.target.name;
        }  

        return summaryString;
    }

    render() {
        return(
            <div>
                <FormControl component="fieldset" >
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox name="high" />}
                            checked={this.state.high}
                            onChange={this.handleChange}
                            label="HIGH"
                        />
                        <FormControlLabel
                            control={<Checkbox name="medium" />}
                            checked={this.state.medium}
                            onChange={this.handleChange}
                            label="MEDIUM"
                        />
                        <FormControlLabel
                            control={<Checkbox name="low" />}
                            checked={this.state.low}
                            onChange={this.handleChange}
                            label="LOW"
                        />
                        <FormControlLabel
                            control={<Checkbox name="modifier" />}
                            checked={this.state.modifier}
                            onChange={this.handleChange}
                            label="MODIFIER"
                        />
                    </FormGroup>
                </FormControl>
            </div>            
        );
    }
}


export default ImpactFilter;