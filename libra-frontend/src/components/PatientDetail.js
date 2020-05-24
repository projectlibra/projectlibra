import React, { Component } from 'react';
import { Button, Divider,Card } from 'antd';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Autocomplete from 'react-autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import host from '../host';
import ListItemText from '@material-ui/core/ListItemText';

const menuStyle = {
	borderRadius: '3px',
	boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
	background: 'rgba(255, 255, 255, 0.9)',
	padding: '2px 0',
	fontSize: '100%',
	position: 'fixed',
	overflow: 'auto',
	maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
	"zIndex": 100,
  };

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

class PatientDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            patient: [],
            go_names: {},
            hpo_tags:[],
            hpo_tag_names: [],
            phenotype_list : [],
            genotype_list : [],
            // Data that will be rendered in the autocomplete
            // As it is asynchronous, it is initially empty
            
        }
        // Bind `this` context to functions of the class
        
        
    }
    
    componentDidMount() {
        const {id} = this.props.match.params;
        this.fetchPatient(id);
        this.fetchGONames(id);
    }
    fetchPatient = (id) => {
        axios.get(host + `/patientprofile/${id}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            console.log(res.data)
            
            const hpo_tags = res.data.hpo_tag_names === null ? []: res.data.hpo_tag_names.split(',');
            const hpo_tag_ids = res.data.hpo_tag_ids === null ? []: res.data.hpo_tag_ids.split(',');
            var tmp_arr = this.state.phenotype_list
            for(var i = 0; i < hpo_tags.length; i++){
                var link = "/HPO/" + hpo_tag_ids[i];
                tmp_arr.push(<ListItemLink href={link} >
                    <ListItemText  primary={hpo_tags[i]} />
                </ListItemLink>	);
            }
            console.log(this.state.phenotype_list)
            this.setState({
                phenotype_list : tmp_arr,
                patient: res.data
            })
        })
        .catch(err =>  {
            if(err.response) {
            console.log(axios.defaults.headers.common)
            console.log(err.response.data)
            if(err.response.status === 401) {
                this.props.history.push('/');
            }
            }
        })
    
    }
    fetchGONames = (patient_id) => {
        axios.get(host + `/getgonames/${patient_id}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            var tmp_arr = this.state.genotype_list;
            res.data.forEach(element => {
                var link = "https://www.ncbi.nlm.nih.gov/gene/?term=" + element.gene_name;
                tmp_arr.push(<ListItemLink href={link} >
                    <ListItemText  primary={element.gene_name} />
                </ListItemLink>);
            
            });
            console.log(tmp_arr)
            this.setState({
                genotype_list : tmp_arr
            })
        })
        .catch(err =>  {
            if(err.response) {
            console.log(axios.defaults.headers.common)
            console.log(err.response.data)
            if(err.response.status === 401) {
                this.props.history.push('/');
            }
            }
        })
    }
    
    
    render()
    {
        const{patient, phenotype_list, genotype_list} = this.state;
        
        
        return(
            <div key={patient.id}>
                
            <Button href={"/editpatient/"+patient.id}>Edit Patient</Button>
            
           
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
            <Card title={patient.name} extra={<a href={`/matchmaker/${patient.id}`}>matchmaker</a>} >
            <p>
                {patient.diagnosis}
            </p>
            <List  component="nav" >
            <h2>Phenotypes</h2>
            {phenotype_list.length ? phenotype_list : <h1>Loading Phenotypes</h1>}
            <h2>Genotypes</h2>
            {genotype_list.length ? genotype_list : <h1>Loading Genotypes</h1>}
            </List >
            </Card>
            
            </div>
            
        )
    }
}
export default PatientDetail