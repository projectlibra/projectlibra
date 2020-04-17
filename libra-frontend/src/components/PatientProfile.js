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
    const hpo_tags = props.hpo_tag_names.split(',');
    const hpo_tag_ids = props.hpo_tag_ids.split(',');
    var list = [];
    for(var i = 0; i < hpo_tags.length; i++){
        var link = "/HPO/" + hpo_tag_ids[i];
        list.push(<ListItemLink href={link} >
            <ListItemText  primary={hpo_tags[i]} />
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
            {list}
            </List >
            
        </Card>
        </Link>
        </div>
    
  )
}

export default PatientProfile;