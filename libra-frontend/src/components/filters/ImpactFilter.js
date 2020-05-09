import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';

const highImpactArray = ["frameshift", "splice_acceptor", "splice_donor", "start_lost", "stop_gained", "stop_lost"];
const medImpactArray = ["inframe_deletion", "inframe_insertion", "missense", "protein_altering", "splice_region"];
const lowImpactArray = ["_3_prime_UTR", "_5_prime_UTR", "coding_sequence", "downstream_gene", "intergenic", "intron", "mature_miRNA", 
    "non_coding_transcript_exon", "regulatory_region", "stop_retained", "synonymous", "upstream_gene"];

class ImpactFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highImpactSelectedOptions: [],
            medImpactSelectedOptions: [],
            lowImpactSelectedOptions: [],
            high: false, 
            medium: false, 
            low: false, 
            frameshift: false,
            splice_acceptor: false,
            splice_donor: false,
            start_lost: false, 
            stop_gained: false,
            stop_lost: false,
            inframe_deletion: false,
            inframe_insertion: false,
            missense: false,
            protein_altering: false,
            splice_region: false,
            _3_prime_UTR: false,
            _5_prime_UTR: false,
            coding_sequence: false,
            downstream_gene: false,
            intergenic: false,
            intron: false,
            mature_miRNA: false,
            non_coding_transcript_exon: false,
            regulatory_region: false,
            stop_retained: false,
            synonymous: false,
            upstream_gene: false,
            summary: ""            
        };

        this.handleChange = this.handleChange.bind(this);
        this.updateSummary = this.updateSummary.bind(this);
    }    

    handleChange(event) {
        if (event.target.name === "high" || event.target.name === "medium" || event.target.name === "low") {
            if (event.target.checked && event.target.name === "high") {
                console.log("here");
                var i;
                for (i = 0; i < highImpactArray.length; i++) {
                    this.setState({[highImpactArray[i]]: true});
                } 
                this.setState({highImpactSelectedOptions: highImpactArray, high: true}, this.props.handleFilterChange({highImpactArray: highImpactArray, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: this.state.lowImpactSelectedOptions}));
            }
            if (event.target.checked && event.target.name === "medium") {
                var i;
                for (i = 0; i < medImpactArray.length; i++) {
                    this.setState({[medImpactArray[i]]: true});
                } 
                this.setState({medImpactSelectedOptions: medImpactArray, medium: true}, this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: medImpactArray, 
                    lowImpactArray: this.state.lowImpactSelectedOptions}));
            }
            if (event.target.checked && event.target.name === "low") {
                var i;
                for (i = 0; i < lowImpactArray.length; i++) {
                    this.setState({[lowImpactArray[i]]: true});
                } 
                this.setState({lowImpactSelectedOptions: lowImpactArray, low: true}, this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: lowImpactArray}));
            }

            if (!event.target.checked && event.target.name === "high") {
                var i;
                for (i = 0; i < highImpactArray.length; i++) {
                    this.setState({[highImpactArray[i]]: false});
                } 
                this.setState({highImpactSelectedOptions: [], high: false}, this.props.handleFilterChange({highImpactArray: [], 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: this.state.lowImpactSelectedOptions}));                
            }
            
            if (!event.target.checked && event.target.name === "medium") {
                var i;
                for (i = 0; i < medImpactArray.length; i++) {
                    this.setState({[medImpactArray[i]]: false});
                } 
                this.setState({medImpactSelectedOptions: [], medium: false}, this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: [], 
                    lowImpactArray: this.state.lowImpactSelectedOptions}));                
            }

            if (!event.target.checked && event.target.name === "low") {
                var i;
                for (i = 0; i < lowImpactArray.length; i++) {
                    this.setState({[lowImpactArray[i]]: false});
                } 
                this.setState({lowImpactSelectedOptions: [], low: false}, this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: []}));                
            }
        } else {
            if (event.target.checked) {
                if (highImpactArray.includes(event.target.name)) {
                    var newHighImpactArray = [...this.state.highImpactSelectedOptions, event.target.name]
                    this.setState({highImpactSelectedOptions: newHighImpactArray,
                         [event.target.name]: true},
                         this.props.handleFilterChange({highImpactArray: newHighImpactArray, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: this.state.lowImpactSelectedOptions}));
                }

                if (medImpactArray.includes(event.target.name)) {
                    var newMedImpactArray = [...this.state.medImpactSelectedOptions, event.target.name];
                    this.setState({medImpactSelectedOptions: newMedImpactArray,
                         [event.target.name]: true},
                         this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: newMedImpactArray, 
                            lowImpactArray: this.state.lowImpactSelectedOptions}));
                }

                if (lowImpactArray.includes(event.target.name)) {
                    var newLowImpactArray = [...this.state.lowImpactSelectedOptions, event.target.name];
                    this.setState({lowImpactSelectedOptions: newLowImpactArray,
                         [event.target.name]: true},
                         this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: newLowImpactArray}));
                }
            } else {
                if (highImpactArray.includes(event.target.name)) {
                    var temp = [...this.state.highImpactSelectedOptions];
                    temp = temp.filter(e => e !== event.target.name);
                    this.setState({highImpactSelectedOptions: temp,
                         [event.target.name]: false},
                         this.props.handleFilterChange({highImpactArray: temp, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: this.state.lowImpactSelectedOptions}));
                }

                if (medImpactArray.includes(event.target.name)) {
                    var temp = [...this.state.medImpactSelectedOptions];
                    temp = temp.filter(e => e !== event.target.name);
                    this.setState({medImpactSelectedOptions: temp,
                         [event.target.name]: false},
                         this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: temp, 
                            lowImpactArray: this.state.lowImpactSelectedOptions}));
                }

                if (lowImpactArray.includes(event.target.name)) {
                    var temp = [...this.state.lowImpactSelectedOptions];
                    temp = temp.filter(e => e !== event.target.name);
                    this.setState({lowImpactSelectedOptions: temp,
                         [event.target.name]: false},
                         this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: temp}));
                }
            }
        }
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
                        <Container >
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox name="frameshift" />}
                                    checked={this.state.highImpactSelectedOptions.includes("frameshift")}
                                    onChange={this.handleChange}
                                    label="frameshift"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_acceptor" />}
                                    checked={this.state.highImpactSelectedOptions.includes("splice_acceptor")}
                                    onChange={this.handleChange}
                                    label="splice acceptor"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_donor" />}
                                    checked={this.state.highImpactSelectedOptions.includes("splice_donor")}
                                    onChange={this.handleChange}
                                    label="splice donor"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="start_lost" />}
                                    checked={this.state.highImpactSelectedOptions.includes("start_lost")}
                                    onChange={this.handleChange}
                                    label="start lost"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="stop_gained" />}
                                    checked={this.state.highImpactSelectedOptions.includes("stop_gained")}
                                    onChange={this.handleChange}
                                    label="stop gained"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="stop_lost" />}
                                    checked={this.state.highImpactSelectedOptions.includes("stop_lost")}
                                    onChange={this.handleChange}
                                    label="stop lost"
                                />
                            </FormGroup>
                        </Container>                        

                        <FormControlLabel
                            control={<Checkbox name="medium" />}
                            checked={this.state.medium}
                            onChange={this.handleChange}
                            label="MED"
                        />
                        <Container >
                            <FormGroup> 
                                <FormControlLabel
                                    control={<Checkbox name="inframe_deletion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("inframe_deletion")}
                                    onChange={this.handleChange}
                                    label="inframe deletion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="inframe_insertion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("inframe_insertion")}
                                    onChange={this.handleChange}
                                    label="inframe insertion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="missense" />}
                                    checked={this.state.medImpactSelectedOptions.includes("missense")}
                                    onChange={this.handleChange}
                                    label="missense"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="protein_altering" />}
                                    checked={this.state.medImpactSelectedOptions.includes("protein_altering")}
                                    onChange={this.handleChange}
                                    label="protein altering"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_region" />}
                                    checked={this.state.medImpactSelectedOptions.includes("splice_region")}
                                    onChange={this.handleChange}
                                    label="splice region"
                                />
                            </FormGroup>
                        </Container>                        

                        <FormControlLabel
                            control={<Checkbox name="low" />}
                            checked={this.state.low}
                            onChange={this.handleChange}
                            label="LOW"
                        />
                        <Container>
                            <FormGroup> 
                                <FormControlLabel
                                    control={<Checkbox name="_3_prime_UTR" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("_3_prime_UTR")}
                                    onChange={this.handleChange}
                                    label="3 prime UTR"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="_5_prime_UTR" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("_5_prime_UTR")}
                                    onChange={this.handleChange}
                                    label="5 prime UTR"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="coding_sequence" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("coding_sequence")}
                                    onChange={this.handleChange}
                                    label="coding sequence"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="downstream_gene" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("downstream_gene")}
                                    onChange={this.handleChange}
                                    label="downstream gene"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="intergenic" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("intergenic")}
                                    onChange={this.handleChange}
                                    label="intergenic"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="intron" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("intron")}
                                    onChange={this.handleChange}
                                    label="intron"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="mature_miRNA" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("mature_miRNA")}
                                    onChange={this.handleChange}
                                    label="mature miRNA"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="non_coding_transcript_exon" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("non_coding_transcript_exon")}
                                    onChange={this.handleChange}
                                    label="non coding transcript exon"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="regulatory_region" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("regulatory_region")}
                                    onChange={this.handleChange}
                                    label="regulatory region"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="stop_retained" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("stop_retained")}
                                    onChange={this.handleChange}
                                    label="stop retained"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="synonymous" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("synonymous")}
                                    onChange={this.handleChange}
                                    label="synonymous"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="upstream_gene" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("upstream_gene")}
                                    onChange={this.handleChange}
                                    label="upstream gene"
                                />
                            </FormGroup>
                        </Container>                        
                    </FormGroup>
                </FormControl>
            </div>            
        );
    }
}


export default ImpactFilter;