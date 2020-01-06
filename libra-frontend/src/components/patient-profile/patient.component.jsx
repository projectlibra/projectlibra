import React from 'react';
import './patient.styles.css';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';

export default class Patient extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // toggle box is closed initially
      checked: props.isPrivate,
    };
    this.checkBox = this.checkBox.bind(this);
  }
  checkBox() {
    // check if box is currently opened
    const { checked} = this.state;
    this.setState({
      // toggle value of `opened`
      checked: !checked,
    });
  }
  render(){
    const { name, surname, nationalID, nationality, VCFfile, phenotypes, genotypes, images} = this.props;
    const{checked} = this.state;
    return(
      <div className="patient" >
        <p className = "arrow-icon" ><Button title = "Edit"><EditIcon  fontSize="large" color = "action"/></Button> <Button title = "Go to MatchMaker"><ArrowForwardIcon fontSize="large" color = "action"/></Button></p>
        
        <h1 className="patient_title">{name} {surname} </h1>
      
        <p className="nationalID">National ID: {parseInt(nationalID)}</p>
        <p className="nationality">Nationality: {nationality}</p>
        <p className="VCFfile">VCF File Name: {VCFfile}</p>
        
              <Checkbox  onClick = {this.checkBox} defaultChecked = {checked} inputProps={{ 'aria-label': 'Checkbox A' }} />
              {checked && (
                
                <p className="VCFfile"> Private </p>
                
            )}
              {!checked && (
                <p className="VCFfile"> Public </p>
            )}
        <h2>Phenotype:</h2>
        <div className="phenotypes">
          {phenotypes.map((phenotype) => (
            <li className="phenotype">
              <i className="fas fa-caret-right" /> #{phenotype}
            </li>
          ))}
        </div>
        <h2>Genotype:</h2>
        <div className="genotypes">
          {genotypes.map((genotype) => (
            <li className="genotype" >
              <i className="fas fa-caret-right" /> #{genotype}
            </li>
          ))}
        </div>
        <div className="images">
          <div className="row">
            {images.map((image)=> (
              <div class="column">
                  <img className="image" src={image} alt="" />
                </div>
            ))}
          </div>
        </div>
      </div>

    );
  }
}


