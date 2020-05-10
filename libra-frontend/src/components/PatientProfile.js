import React, { Component } from 'react'
import {Card} from 'antd'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from "react-router-dom";

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }
const PatientProfile= (props) => {
    const hpo_tags = props.hpo_tag_names === null ? []: props.hpo_tag_names.split(',');
    const hpo_tag_ids = props.hpo_tag_ids === null ? []: props.hpo_tag_ids.split(',');
    const go_names = props.go_names === undefined ? [] : props.go_names;
    var phenotype_list = [];
    for(var i = 0; i < hpo_tags.length; i++){
        var link = "/HPO/" + hpo_tag_ids[i];
        phenotype_list.push(<ListItemLink href={link} >
            <ListItemText  primary={hpo_tags[i]} />
        </ListItemLink>	);
    }
    var genotype_list = [];
    for(var i = 0; i < go_names.length; i++){
        var link = "https://www.ncbi.nlm.nih.gov/gene/?term=" + go_names[i];
        genotype_list.push(<ListItemLink href={link} >
            <ListItemText  primary={go_names[i]} />
        </ListItemLink>	);
    }
    return (
        <div>
        <Link to={`/matchmaker/${props.patient_id}`}>
        <Card title={props.name} extra={<a href={'/matchmaker'}>More</a>} style={{ width: 300, marginRight: '20px', marginBottom: '10px' }}>
            <p>
                {props.diagnosis}
            </p>
            <List  component="nav" >
                <h2>Phenotypes</h2>
            {phenotype_list}
            <h2>Genotypes</h2>
            {genotype_list}
            </List >
            
        </Card>
        </Link>
        </div>
    
  )
}

export default PatientProfile;