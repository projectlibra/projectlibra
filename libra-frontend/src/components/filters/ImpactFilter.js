import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';

const highImpactArray = ["chromosome_number_variation", "exon_loss_variant", "frameshift_variant", "rare_amino_acid_variant", "splice_acceptor_variant", "splice_donor_variant", "start_lost", "stop_gained", "stop_lost", "transcript_ablation"];
const medImpactArray = ["3_prime_UTR_truncation&exon_loss", "5_prime_UTR_truncation&exon_loss_variant", "coding_sequence_variant", "conservative_inframe_deletion", "conservative_inframe_insertion", "disruptive_inframe_deletion", "disruptive_inframe_insertion", "missense_variant", "regulatory_region_ablation", "splice_region_variant", "TFBS_albation"];
const lowImpactArray = ["5_prime_UTR_premature_start_codon_gain_variant", "initiator_codon_variant", "splice_region_variant", "start_retained", "stop_retained_variant", "synonymous_variant"];

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

    // I apologize to everybody that will have a look at this atrocious method
    handleChange(event) {
        if (event.target.name === "high" || event.target.name === "medium" || event.target.name === "low") {
            if (event.target.checked && event.target.name === "high") {
                console.log("here");
                var i;
                for (i = 0; i < highImpactArray.length; i++) {
                    this.setState({[highImpactArray[i]]: true});
                } 
                this.setState({highImpactSelectedOptions: highImpactArray, high: true}, 
                    this.props.handleFilterChange({highImpactArray: highImpactArray, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: this.state.lowImpactSelectedOptions}));
            }
            if (event.target.checked && event.target.name === "medium") {
                var i;
                for (i = 0; i < medImpactArray.length; i++) {
                    this.setState({[medImpactArray[i]]: true});
                } 
                this.setState({medImpactSelectedOptions: medImpactArray, medium: true}, 
                    this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: medImpactArray, 
                    lowImpactArray: this.state.lowImpactSelectedOptions}));
            }
            if (event.target.checked && event.target.name === "low") {
                var i;
                for (i = 0; i < lowImpactArray.length; i++) {
                    this.setState({[lowImpactArray[i]]: true});
                } 
                this.setState({lowImpactSelectedOptions: lowImpactArray, low: true}, 
                    this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: lowImpactArray}));
            }

            if (!event.target.checked && event.target.name === "high") {
                var i;
                for (i = 0; i < highImpactArray.length; i++) {
                    this.setState({[highImpactArray[i]]: false});
                } 
                this.setState({highImpactSelectedOptions: [], high: false}, 
                    this.props.handleFilterChange({highImpactArray: [], 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: this.state.lowImpactSelectedOptions}));                
            }
            
            if (!event.target.checked && event.target.name === "medium") {
                var i;
                for (i = 0; i < medImpactArray.length; i++) {
                    this.setState({[medImpactArray[i]]: false});
                } 
                this.setState({medImpactSelectedOptions: [], medium: false}, 
                    this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: [], 
                    lowImpactArray: this.state.lowImpactSelectedOptions}));                
            }

            if (!event.target.checked && event.target.name === "low") {
                var i;
                for (i = 0; i < lowImpactArray.length; i++) {
                    this.setState({[lowImpactArray[i]]: false});
                } 
                this.setState({lowImpactSelectedOptions: [], low: false}, 
                    this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
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
                                    control={<Checkbox name="frameshift_variant" />}
                                    checked={this.state.highImpactSelectedOptions.includes("frameshift_variant")}
                                    onChange={this.handleChange}
                                    label="frameshift_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_acceptor_variant" />}
                                    checked={this.state.highImpactSelectedOptions.includes("splice_acceptor_variant")}
                                    onChange={this.handleChange}
                                    label="splice_acceptor_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_donor_variant" />}
                                    checked={this.state.highImpactSelectedOptions.includes("splice_donor_variant")}
                                    onChange={this.handleChange}
                                    label="splice_donor_variant"
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
                                    control={<Checkbox name="coding_sequence_variant" />}
                                    checked={this.state.medImpactSelectedOptions.includes("coding_sequence_variant")}
                                    onChange={this.handleChange}
                                    label="coding_sequence_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="disruptive_inframe_deletion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("disruptive_inframe_deletion")}
                                    onChange={this.handleChange}
                                    label="disruptive_inframe_deletion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="conservative_inframe_deletion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("conservative_inframe_deletion")}
                                    onChange={this.handleChange}
                                    label="conservative_inframe_deletion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="disruptive_inframe_insertion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("disruptive_inframe_insertion")}
                                    onChange={this.handleChange}
                                    label="disruptive_inframe_insertion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="conservative_inframe_insertion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("conservative_inframe_insertion")}
                                    onChange={this.handleChange}
                                    label="conservative_inframe_insertion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="missense_variant" />}
                                    checked={this.state.medImpactSelectedOptions.includes("missense_variant")}
                                    onChange={this.handleChange}
                                    label="missense_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="regulatory_region_ablation" />}
                                    checked={this.state.medImpactSelectedOptions.includes("regulatory_region_ablation")}
                                    onChange={this.handleChange}
                                    label="regulatory_region_ablation"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_region_variant" />}
                                    checked={this.state.medImpactSelectedOptions.includes("splice_region_variant")}
                                    onChange={this.handleChange}
                                    label="splice_region_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="TFBS_albation" />}
                                    checked={this.state.medImpactSelectedOptions.includes("TFBS_albation")}
                                    onChange={this.handleChange}
                                    label="TFBS_albation"
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
                                    control={<Checkbox name="initiator_codon_variant" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("initiator_codon_variant")}
                                    onChange={this.handleChange}
                                    label="initiator_codon_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="start_retained" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("start_retained")}
                                    onChange={this.handleChange}
                                    label="start_retained"
                                />
                                
                                <FormControlLabel
                                    control={<Checkbox name="stop_retained_variant" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("stop_retained_variant")}
                                    onChange={this.handleChange}
                                    label="stop_retained_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="synonymous_variant" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("synonymous_variant")}
                                    onChange={this.handleChange}
                                    label="synonymous_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_region_variant" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("splice_region_variant")}
                                    onChange={this.handleChange}
                                    label="splice_region_variant"
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