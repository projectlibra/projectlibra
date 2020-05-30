import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';

const highImpactArray = ["chromosome_number_variation", "exon_loss_variant", "frameshift_variant", "rare_amino_acid_variant", 
    "splice_acceptor_variant", "splice_donor_variant", "start_lost", "stop_gained", "stop_lost", "transcript_ablation"];
const medImpactArray = ["5_prime_UTR_truncation+exon_loss_variant", "3_prime_UTR_truncation+exon_loss",
    "coding_sequence_variant_moderate", "conservative_inframe_deletion", "conservative_inframe_insertion", "disruptive_inframe_deletion",
    "disruptive_inframe_insertion", "missense_variant", "regulatory_region_ablation", "splice_region_variant_moderate", "TFBS_ablation"];
    // coding_sequence_variant - splice_region_variant
const lowImpactArray = [ "5_prime_UTR_premature_start_codon_gain_variant", "initiator_codon_variant", "splice_region_variant_low", "start_retained",
    "stop_retained_variant", "synonymous_variant"];
    // splice_region_variant
const modifierImpactArray = ["3_prime_UTR_variant", "5_prime_UTR_variant", "coding_sequence_variant_modifier", "conserved_intergenic_variant",
    "conserved_intron_variant", "downstream_gene_variant",  "exon_variant", "feature_elongation", "feature_truncation", "gene_variant",
     "intergenic_region", "intragenic_variant", "intron_variant", "mature_miRNA_variant", "miRNA", "NMD_transcript_variant", 
     "non_coding_transcript_exon_variant", "non_coding_transcript_variant", "regulatory_region_amplification", "regulatory_region_variant",
     "TF_binding_site_variant", "TFBS_amplification", "transcript_amplification", "transcript_variant", "upstream_gene_variant"];
     // coding_sequence_variant

class ImpactFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highImpactSelectedOptions: [],
            medImpactSelectedOptions: [],
            lowImpactSelectedOptions: [],
            modifierImpactSelectedOptions: [],
            high: false, 
            medium: false, 
            low: false, 
            modifier: false
        };

        this.handleChange = this.handleChange.bind(this);
    }    

    // I apologize to everybody that will have a look at this atrocious method
    handleChange(event) {
        if (event.target.name === "high" || event.target.name === "medium" || event.target.name === "low" || event.target.name === "modifier") {
            if (event.target.checked && event.target.name === "high") {
                this.setState({highImpactSelectedOptions: highImpactArray, high: true}, 
                    this.props.handleFilterChange({highImpactArray: highImpactArray, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: this.state.lowImpactSelectedOptions,
                    modifierImpactArray: this.state.modifierImpactSelectedOptions
                }));
            }
            if (event.target.checked && event.target.name === "medium") {
                this.setState({medImpactSelectedOptions: medImpactArray, medium: true}, 
                    this.props.handleFilterChange({highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: medImpactArray, 
                    lowImpactArray: this.state.lowImpactSelectedOptions,
                    modifierImpactArray: this.state.modifierImpactSelectedOptions
                }));
            }
            if (event.target.checked && event.target.name === "low") {
                this.setState({lowImpactSelectedOptions: lowImpactArray, low: true}, 
                    this.props.handleFilterChange({
                    highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: lowImpactArray,
                    modifierImpactArray: this.state.modifierImpactSelectedOptions
                }));
            }

            if (event.target.checked && event.target.name === "modifier") {
                this.setState({modifierImpactSelectedOptions: modifierImpactArray, modifier: true}, 
                    this.props.handleFilterChange({
                    highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: this.state.lowImpactSelectedOptions,
                    modifierImpactArray: modifierImpactArray
                }));
            }

            if (!event.target.checked && event.target.name === "high") {
                this.setState({highImpactSelectedOptions: [], high: false}, 
                    this.props.handleFilterChange({
                    highImpactArray: [], 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: this.state.lowImpactSelectedOptions,
                    modifierImpactArray: this.state.modifierImpactSelectedOptions
                }));                
            }
            
            if (!event.target.checked && event.target.name === "medium") {
                this.setState({medImpactSelectedOptions: [], medium: false}, 
                    this.props.handleFilterChange({
                    highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: [], 
                    lowImpactArray: this.state.lowImpactSelectedOptions,
                    modifierImpactArray: this.state.modifierImpactSelectedOptions
                }));                
            }

            if (!event.target.checked && event.target.name === "low") {
                this.setState({lowImpactSelectedOptions: [], low: false}, 
                    this.props.handleFilterChange({
                    highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: [],
                    modifierImpactArray: this.state.modifierImpactSelectedOptions
                }));                
            }

            if (!event.target.checked && event.target.name === "modifier") {
                this.setState({modifierImpactSelectedOptions: [], modifier: false}, 
                    this.props.handleFilterChange({
                    highImpactArray: this.state.highImpactSelectedOptions, 
                    medImpactArray: this.state.medImpactSelectedOptions, 
                    lowImpactArray: this.state.lowImpactSelectedOptions,
                    modifierImpactArray: []
                }));                
            }
        } else {
            if (event.target.checked) {
                if (highImpactArray.includes(event.target.name)) {
                    var newHighImpactArray = [...this.state.highImpactSelectedOptions, event.target.name]
                    this.setState({highImpactSelectedOptions: newHighImpactArray},
                         this.props.handleFilterChange({
                            highImpactArray: newHighImpactArray, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: this.state.lowImpactSelectedOptions,
                            modifierImpactArray: this.state.modifierImpactSelectedOptions
                        }));
                }

                if (medImpactArray.includes(event.target.name)) {
                    var newMedImpactArray = [...this.state.medImpactSelectedOptions, event.target.name];
                    this.setState({medImpactSelectedOptions: newMedImpactArray},
                         this.props.handleFilterChange({
                            highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: newMedImpactArray, 
                            lowImpactArray: this.state.lowImpactSelectedOptions,
                            modifierImpactArray: this.state.modifierImpactSelectedOptions
                        }));
                }

                if (lowImpactArray.includes(event.target.name)) {
                    var newLowImpactArray = [...this.state.lowImpactSelectedOptions, event.target.name];
                    this.setState({lowImpactSelectedOptions: newLowImpactArray},
                         this.props.handleFilterChange({
                            highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: newLowImpactArray,
                            modifierImpactArray: this.state.modifierImpactSelectedOptions
                        }));
                }

                if (modifierImpactArray.includes(event.target.name)) {
                    var newModifierImpactArray = [...this.state.modifierImpactSelectedOptions, event.target.name];
                    this.setState({modifierImpactSelectedOptions: newModifierImpactArray},
                         this.props.handleFilterChange({
                            highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: this.state.lowImpactSelectedOptions,
                            modifierImpactArray: newModifierImpactArray
                        }));
                }
            } else {
                if (highImpactArray.includes(event.target.name)) {
                    var temp = [...this.state.highImpactSelectedOptions];
                    temp = temp.filter(e => e !== event.target.name);
                    this.setState({highImpactSelectedOptions: temp},
                         this.props.handleFilterChange({
                            highImpactArray: temp, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: this.state.lowImpactSelectedOptions,
                            modifierImpactArray: this.state.modifierImpactSelectedOptions
                        }));
                }

                if (medImpactArray.includes(event.target.name)) {
                    var temp = [...this.state.medImpactSelectedOptions];
                    temp = temp.filter(e => e !== event.target.name);
                    this.setState({medImpactSelectedOptions: temp},
                         this.props.handleFilterChange({
                            highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: temp, 
                            lowImpactArray: this.state.lowImpactSelectedOptions,
                            modifierImpactArray: this.state.modifierImpactSelectedOptions
                        }));
                }

                if (lowImpactArray.includes(event.target.name)) {
                    var temp = [...this.state.lowImpactSelectedOptions];
                    temp = temp.filter(e => e !== event.target.name);
                    this.setState({lowImpactSelectedOptions: temp},
                         this.props.handleFilterChange({
                            highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: temp,
                            modifierImpactArray: this.state.modifierImpactSelectedOptions
                        }));
                }

                if (modifierImpactArray.includes(event.target.name)) {
                    var temp = [...this.state.modifierImpactSelectedOptions];
                    temp = temp.filter(e => e !== event.target.name);
                    this.setState({modifierImpactSelectedOptions: temp},
                         this.props.handleFilterChange({
                            highImpactArray: this.state.highImpactSelectedOptions, 
                            medImpactArray: this.state.medImpactSelectedOptions, 
                            lowImpactArray: temp,
                            modifierImpactArray: this.state.modifierImpactSelectedOptions
                        }));
                }
            }
        }
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
                                    control={<Checkbox name="chromosome_number_variation" />}
                                    checked={this.state.highImpactSelectedOptions.includes("chromosome_number_variation")}
                                    onChange={this.handleChange}
                                    label="chromosome number variation"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="exon_loss_variant" />}
                                    checked={this.state.highImpactSelectedOptions.includes("exon_loss_variant")}
                                    onChange={this.handleChange}
                                    label="exon loss variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="frameshift_variant" />}
                                    checked={this.state.highImpactSelectedOptions.includes("frameshift_variant")}
                                    onChange={this.handleChange}
                                    label="frameshift variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="rare_amino_acid_variant" />}
                                    checked={this.state.highImpactSelectedOptions.includes("rare_amino_acid_variant")}
                                    onChange={this.handleChange}
                                    label="rare amino acid variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_acceptor_variant" />}
                                    checked={this.state.highImpactSelectedOptions.includes("splice_acceptor_variant")}
                                    onChange={this.handleChange}
                                    label="splice acceptor variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_donor_variant" />}
                                    checked={this.state.highImpactSelectedOptions.includes("splice_donor_variant")}
                                    onChange={this.handleChange}
                                    label="splice donor variant"
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
                                <FormControlLabel
                                    control={<Checkbox name="transcript_ablation" />}
                                    checked={this.state.highImpactSelectedOptions.includes("transcript_ablation")}
                                    onChange={this.handleChange}
                                    label="transcript ablation"
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
                                    control={<Checkbox name="5_prime_UTR_truncation+exon_loss_variant" />}
                                    checked={this.state.medImpactSelectedOptions.includes("5_prime_UTR_truncation+exon_loss_variant")}
                                    onChange={this.handleChange}
                                    label="5 prime UTR truncation & exon loss variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="3_prime_UTR_truncation+exon_loss" />}
                                    checked={this.state.medImpactSelectedOptions.includes("3_prime_UTR_truncation+exon_loss")}
                                    onChange={this.handleChange}
                                    label="3 prime UTR truncation & exon loss"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="coding_sequence_variant_moderate" />}
                                    checked={this.state.medImpactSelectedOptions.includes("coding_sequence_variant_moderate")}
                                    onChange={this.handleChange}
                                    label="coding sequence variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="conservative_inframe_deletion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("conservative_inframe_deletion")}
                                    onChange={this.handleChange}
                                    label="conservative inframe deletion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="conservative_inframe_insertion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("conservative_inframe_insertion")}
                                    onChange={this.handleChange}
                                    label="conservative inframe insertion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="disruptive_inframe_deletion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("disruptive_inframe_deletion")}
                                    onChange={this.handleChange}
                                    label="disruptive inframe deletion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="disruptive_inframe_insertion" />}
                                    checked={this.state.medImpactSelectedOptions.includes("disruptive_inframe_insertion")}
                                    onChange={this.handleChange}
                                    label="disruptive inframe insertion"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="missense_variant" />}
                                    checked={this.state.medImpactSelectedOptions.includes("missense_variant")}
                                    onChange={this.handleChange}
                                    label="missense variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="regulatory_region_ablation" />}
                                    checked={this.state.medImpactSelectedOptions.includes("regulatory_region_ablation")}
                                    onChange={this.handleChange}
                                    label="regulatory region ablation"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_region_variant_moderate" />}
                                    checked={this.state.medImpactSelectedOptions.includes("splice_region_variant_moderate")}
                                    onChange={this.handleChange}
                                    label="splice region variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="TFBS_ablation" />}
                                    checked={this.state.medImpactSelectedOptions.includes("TFBS_ablation")}
                                    onChange={this.handleChange}
                                    label="TFBS ablation"
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
                                    control={<Checkbox name="5_prime_UTR_premature_start_codon_gain_variant" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("5_prime_UTR_premature_start_codon_gain_variant")}
                                    onChange={this.handleChange}
                                    label="5 prime UTR premature start codon gain variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="initiator_codon_variant" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("initiator_codon_variant")}
                                    onChange={this.handleChange}
                                    label="initiator codon variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="splice_region_variant_low" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("splice_region_variant_low")}
                                    onChange={this.handleChange}
                                    label="splice region variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="start_retained" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("start_retained")}
                                    onChange={this.handleChange}
                                    label="start retained"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="stop_retained_variant" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("stop_retained_variant")}
                                    onChange={this.handleChange}
                                    label="stop retained variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="synonymous_variant" />}
                                    checked={this.state.lowImpactSelectedOptions.includes("synonymous_variant")}
                                    onChange={this.handleChange}
                                    label="synonymous variant"
                                />                               
                            </FormGroup>
                        </Container>   

                        <FormControlLabel
                            control={<Checkbox name="modifier" />}
                            checked={this.state.modifier}
                            onChange={this.handleChange}
                            label="MODIFIER"
                        />            
                        <Container>
                            <FormGroup>    
                                <FormControlLabel
                                    control={<Checkbox name="3_prime_UTR_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("3_prime_UTR_variant")}
                                    onChange={this.handleChange}
                                    label="3 prime UTR variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="5_prime_UTR_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("5_prime_UTR_variant")}
                                    onChange={this.handleChange}
                                    label="5 prime UTR variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="coding_sequence_variant_modifier" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("coding_sequence_variant_modifier")}
                                    onChange={this.handleChange}
                                    label="coding sequence variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="conserved_intergenic_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("conserved_intergenic_variant")}
                                    onChange={this.handleChange}
                                    label="conserved intergenic variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="conserved_intron_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("conserved_intron_variant")}
                                    onChange={this.handleChange}
                                    label="conserved intron variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="downstream_gene_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("downstream_gene_variant")}
                                    onChange={this.handleChange}
                                    label="downstream gene variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="exon_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("exon_variant")}
                                    onChange={this.handleChange}
                                    label="exon variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="feature_elongation" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("feature_elongation")}
                                    onChange={this.handleChange}
                                    label="feature elongation"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="feature_truncation" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("feature_truncation")}
                                    onChange={this.handleChange}
                                    label="feature truncation"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="gene_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("gene_variant")}
                                    onChange={this.handleChange}
                                    label="gene variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="intergenic_region" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("intergenic_region")}
                                    onChange={this.handleChange}
                                    label="intergenic region"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="intragenic_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("intragenic_variant")}
                                    onChange={this.handleChange}
                                    label="intragenic variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="intron_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("intron_variant")}
                                    onChange={this.handleChange}
                                    label="intron variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="mature_miRNA_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("mature_miRNA_variant")}
                                    onChange={this.handleChange}
                                    label="mature miRNA variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="miRNA" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("miRNA")}
                                    onChange={this.handleChange}
                                    label="miRNA"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="NMD_transcript_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("NMD_transcript_variant")}
                                    onChange={this.handleChange}
                                    label="NMD_transcript_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="non_coding_transcript_exon_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("non_coding_transcript_exon_variant")}
                                    onChange={this.handleChange}
                                    label="non coding transcript exon variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="non_coding_transcript_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("non_coding_transcript_variant")}
                                    onChange={this.handleChange}
                                    label="non_coding_transcript_variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="regulatory_region_amplification" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("regulatory_region_amplification")}
                                    onChange={this.handleChange}
                                    label="regulatory region amplification"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="regulatory_region_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("regulatory_region_variant")}
                                    onChange={this.handleChange}
                                    label="regulatory region variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="TF_binding_site_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("TF_binding_site_variant")}
                                    onChange={this.handleChange}
                                    label="TF binding site variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="TFBS_amplification" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("TFBS_amplification")}
                                    onChange={this.handleChange}
                                    label="TFBS amplification"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="transcript_amplification" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("transcript_amplification")}
                                    onChange={this.handleChange}
                                    label="transcript amplification"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="transcript_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("transcript_variant")}
                                    onChange={this.handleChange}
                                    label="transcript variant"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="upstream_gene_variant" />}
                                    checked={this.state.modifierImpactSelectedOptions.includes("upstream_gene_variant")}
                                    onChange={this.handleChange}
                                    label="upstream gene variant"
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