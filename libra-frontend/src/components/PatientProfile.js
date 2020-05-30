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
    
    return (
        <div>
        
        <Card title={props.name} extra={<a href={`/patients/${props.patient_id}`}>Detail</a>} style={{ backgroundColor:"#FAFAFA", width: 300, marginRight: '20px', marginBottom: '10px', boxShadow: '5px 5px' }}>
            <p><b>Patient ID:</b> {props.patient_id}</p>
            <p><b>Patient Diagnosis</b></p>
            <p>{props.diagnosis}</p>
            
        </Card>
        </div>
    
  )
}

export default PatientProfile;