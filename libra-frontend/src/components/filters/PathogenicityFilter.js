import React, { Component } from "react";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Container from '@material-ui/core/Container';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';

class PathogenicityFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            polyphen_pred: false,
            probably_damaging: false,
            possibly_damaging: false,
            benign: false,
            unknown: false,
            no_value: false,
            sift_pred: false,
            deleterious: false,
            deleterious_low_confidence: false,
            tolerated_low_confidence: false,
            tolerated: false,
            no_value_sift: false, 
            polyphen_score: "0",
            sift_score: "1"
        }

        this.handleChange = this.handleChange.bind(this);
        this.onChangePolyphen = this.onChangePolyphen.bind(this);
        this.onChangeSift = this.onChangeSift.bind(this);
    }

    handleChange() {

    }

    onChangePolyphen(event) {
        this.setState({polyphen_score: event.target.value});
    }    

    onChangeSift(event) {
        this.setState({sift_score: event.target.value});
    }

    render() {
        return(
            <div>
                <FormControl component="fieldset">
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox name="polyphen_pred" />}
                            checked={this.state.polyphen_pred}
                            onChange={this.handleChange}
                            label="Polyphen pred"
                        />
                        <Container >
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox name="probably_damaging" />}
                                    checked={this.state.polyphen_pred || this.state.probably_damaging}
                                    onChange={this.handleChange}
                                    label="probably damaging"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="possibly_damaging" />}
                                    checked={this.state.polyphen_pred || this.state.possibly_damaging}
                                    onChange={this.handleChange}
                                    label="possibly damaging"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="benign" />}
                                    checked={this.state.polyphen_pred || this.state.benign}
                                    onChange={this.handleChange}
                                    label="benign"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="unknown" />}
                                    checked={this.state.polyphen_pred || this.state.unknown}
                                    onChange={this.handleChange}
                                    label="unknown"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="no_value" />}
                                    checked={this.state.polyphen_pred || this.state.no_value}
                                    onChange={this.handleChange}
                                    label="no value"
                                />
                            </FormGroup>
                        </Container>
                        <FormControlLabel
                            control={<Checkbox name="sift_pred" />}
                            checked={this.state.sift_pred}
                            onChange={this.handleChange}
                            label="Sift pred"
                        />
                        <Container>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox name="deleterious" />}
                                    checked={this.state.sift_pred || this.state.deleterious}
                                    onChange={this.handleChange}
                                    label="deleterious"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="deleterious_low_confidence" />}
                                    checked={this.state.sift_pred || this.state.deleterious_low_confidence}
                                    onChange={this.handleChange}
                                    label="deleterious low confidence"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="tolerated_low_confidence" />}
                                    checked={this.state.sift_pred || this.state.tolerated_low_confidence}
                                    onChange={this.handleChange}
                                    label="tolerated low confidence"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="tolerated" />}
                                    checked={this.state.sift_pred || this.state.tolerated}
                                    onChange={this.handleChange}
                                    label="tolerated"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="no_value_sift" />}
                                    checked={this.state.sift_pred || this.state.no_value_sift}
                                    onChange={this.handleChange}
                                    label="no value"
                                />
                            </FormGroup>
                        </Container>

                        <FormLabel component="legend">Polyphen score</FormLabel>
                        <RadioGroup aria-label="polyphen_score" name="polyphen_score" value={this.state.polyphen_score} onChange={this.onChangePolyphen}>
                            <FormControlLabel value="0" control={<Radio />} label="0" />
                            <FormControlLabel value="0.001" control={<Radio />} label="1‰" />
                            <FormControlLabel value="0.01" control={<Radio />} label="1%" />
                            <FormControlLabel value="0.05" control={<Radio />} label="5%" />
                            <FormControlLabel value="1" control={<Radio />} label="1" />
                        </RadioGroup>

                        <FormLabel component="legend">Sift score</FormLabel>
                        <RadioGroup aria-label="sift_score" name="sift_score" value={this.state.sift_score} onChange={this.onChangeSift}>
                            <FormControlLabel value="0" control={<Radio />} label="0" />
                            <FormControlLabel value="0.001" control={<Radio />} label="1‰" />
                            <FormControlLabel value="0.01" control={<Radio />} label="1%" />
                            <FormControlLabel value="0.05" control={<Radio />} label="5%" />
                            <FormControlLabel value="1" control={<Radio />} label="1" />
                        </RadioGroup>
                    </FormGroup>
                </FormControl>
            </div>
        );
    }
}

export default PathogenicityFilter;