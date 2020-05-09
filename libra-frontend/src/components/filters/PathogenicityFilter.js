import React, { Component } from "react";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Container from '@material-ui/core/Container';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';

const polyphenArray = ["probably_damaging", "possibly_damaging", "benign", "unknown", "no_value"];
const siftArray = ["deleterious", "deleterious_low_confidence", "tolerated_low_confidence", "tolerated", "no_value_sift"];

class PathogenicityFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            polyphenSelectedOptions: [],
            siftSelectedOptions: [],
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
            polyphenScore: "0",
            siftScore: "1"
        }

        this.handleChange = this.handleChange.bind(this);
        this.onChangePolyphen = this.onChangePolyphen.bind(this);
        this.onChangeSift = this.onChangeSift.bind(this);
    }

    handleChange(event) {
        if (event.target.name === "polyphen_pred" || event.target.name === "sift_pred") { 
            if (event.target.checked && event.target.name === "polyphen_pred") {
                var i;
                for (i = 0; i < polyphenArray.length; i++) {
                    this.setState({[polyphenArray[i]]: true});
                } 
                this.setState({polyphenSelectedOptions: polyphenArray, polyphen_pred: true}, 
                    this.props.handleFilterChange({polyphenArray: polyphenArray, 
                    siftArray: this.state.siftSelectedOptions,
                    polyphenScore: this.state.polyphenScore, 
                    siftScore: this.state.siftScore}));
            }

            if (event.target.checked && event.target.name === "sift_pred") {
                var i;
                for (i = 0; i < siftArray.length; i++) {
                    this.setState({[siftArray[i]]: true});
                } 
                this.setState({siftSelectedOptions: siftArray, sift_pred: true}, 
                    this.props.handleFilterChange({polyphenArray: this.state.polyphenSelectedOptions, 
                    siftArray: siftArray,
                    polyphenScore: this.state.polyphenScore, 
                    siftScore: this.state.siftScore}));
            }

            if (!event.target.checked && event.target.name === "polyphen_pred") {
                var i;
                for (i = 0; i < polyphenArray.length; i++) {
                    this.setState({[polyphenArray[i]]: false});
                } 
                this.setState({polyphenSelectedOptions: [], polyphen_pred: false}, 
                    this.props.handleFilterChange({polyphenArray: [], 
                    siftArray: this.state.siftSelectedOptions,
                    polyphenScore: this.state.polyphenScore, 
                    siftScore: this.state.siftScore}));
            }

            if (!event.target.checked && event.target.name === "sift_pred") {
                var i;
                for (i = 0; i < siftArray.length; i++) {
                    this.setState({[siftArray[i]]: false});
                } 
                this.setState({siftSelectedOptions: [], sift_pred: false}, 
                    this.props.handleFilterChange({polyphenArray: this.state.polyphenSelectedOptions, 
                    siftArray: [],
                    polyphenScore: this.state.polyphenScore, 
                    siftScore: this.state.siftScore}));
            }
        } else {
            if (event.target.checked) {
                if (polyphenArray.includes(event.target.name)) {
                    var newPolyphenSelections = [...this.state.polyphenSelectedOptions, event.target.name];
                    this.setState({polyphenSelectedOptions: newPolyphenSelections,
                        [event.target.name]: true},
                        this.props.handleFilterChange({polyphenArray: newPolyphenSelections, 
                        siftArray: this.state.siftSelectedOptions,
                        polyphenScore: this.state.polyphenScore, 
                        siftScore: this.state.siftScore}));
                }

                if (siftArray.includes(event.target.name)) {
                    var newSiftSelections = [...this.state.siftSelectedOptions, event.target.name];
                    this.setState({siftSelectedOptions: newSiftSelections,
                        [event.target.name]: true},
                        this.props.handleFilterChange({polyphenArray: this.state.polyphenSelectedOptions, 
                        siftArray: newSiftSelections,
                        polyphenScore: this.state.polyphenScore, 
                        siftScore: this.state.siftScore}));
                }
            } else {
                if (polyphenArray.includes(event.target.name)) {
                    var temp = [...this.state.polyphenSelectedOptions];
                    temp = temp.filter(e => e !== event.target.name);
                    this.setState({polyphenSelectedOptions: temp,
                        [event.target.name]: false},
                        this.props.handleFilterChange({polyphenArray: temp, 
                        siftArray: this.state.siftSelectedOptions,
                        polyphenScore: this.state.polyphenScore, 
                        siftScore: this.state.siftScore}));
                }

                if (siftArray.includes(event.target.name)) {
                    var temp = [...this.state.siftSelectedOptions];
                    temp = temp.filter(e => e !== event.target.name);
                    this.setState({siftSelectedOptions: temp,
                        [event.target.name]: false},
                        this.props.handleFilterChange({polyphenArray: this.state.polyphenSelectedOptions, 
                        siftArray: temp,
                        polyphenScore: this.state.polyphenScore, 
                        siftScore: this.state.siftScore}));
                }
            }
        }
    }

    onChangePolyphen(event) {
        this.setState({polyphenScore: event.target.value}, 
            this.props.handleFilterChange({polyphenArray: this.state.polyphenSelectedOptions, 
            siftArray: this.state.siftSelectedOptions,
            polyphenScore: event.target.value, 
            siftScore: this.state.siftScore}));
    }    

    onChangeSift(event) {
        this.setState({siftScore: event.target.value}, this.props.handleFilterChange({polyphenArray: this.state.polyphenSelectedOptions, 
            siftArray: this.state.siftSelectedOptions,
            polyphenScore: this.state.polyphenScore, 
            siftScore: event.target.value}));
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
                                    checked={this.state.polyphenSelectedOptions.includes("probably_damaging")}
                                    onChange={this.handleChange}
                                    label="probably damaging"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="possibly_damaging" />}
                                    checked={this.state.polyphenSelectedOptions.includes("possibly_damaging")}
                                    onChange={this.handleChange}
                                    label="possibly damaging"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="benign" />}
                                    checked={this.state.polyphenSelectedOptions.includes("benign")}
                                    onChange={this.handleChange}
                                    label="benign"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="unknown" />}
                                    checked={this.state.polyphenSelectedOptions.includes("unknown")}
                                    onChange={this.handleChange}
                                    label="unknown"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="no_value" />}
                                    checked={this.state.polyphenSelectedOptions.includes("no_value")}
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
                                    checked={this.state.siftSelectedOptions.includes("deleterious")}
                                    onChange={this.handleChange}
                                    label="deleterious"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="deleterious_low_confidence" />}
                                    checked={this.state.siftSelectedOptions.includes("deleterious_low_confidence")}
                                    onChange={this.handleChange}
                                    label="deleterious low confidence"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="tolerated_low_confidence" />}
                                    checked={this.state.siftSelectedOptions.includes("tolerated_low_confidence")}
                                    onChange={this.handleChange}
                                    label="tolerated low confidence"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="tolerated" />}
                                    checked={this.state.siftSelectedOptions.includes("tolerated")}
                                    onChange={this.handleChange}
                                    label="tolerated"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="no_value_sift" />}
                                    checked={this.state.siftSelectedOptions.includes("no_value_sift")}
                                    onChange={this.handleChange}
                                    label="no value"
                                />
                            </FormGroup>
                        </Container>

                        <FormLabel component="legend">Polyphen score</FormLabel>
                        <RadioGroup aria-label="polyphen_score" name="polyphen_score" value={this.state.polyphenScore} onChange={this.onChangePolyphen}>
                            <FormControlLabel value="0" control={<Radio />} label="0" />
                            <FormControlLabel value="0.001" control={<Radio />} label="1‰" />
                            <FormControlLabel value="0.01" control={<Radio />} label="1%" />
                            <FormControlLabel value="0.05" control={<Radio />} label="5%" />
                            <FormControlLabel value="1" control={<Radio />} label="1" />
                        </RadioGroup>

                        <FormLabel component="legend">Sift score</FormLabel>
                        <RadioGroup aria-label="sift_score" name="sift_score" value={this.state.siftScore} onChange={this.onChangeSift}>
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