import React, { Component } from 'react';
import {  Divider,Card, Row, Col  } from 'antd';
import Button from '@material-ui/core/Button';
import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
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
            hpo_tags:[],
            hpo_tag_names: [],
            phenotype_list : [],
            genotype_list : []
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
            const hpo_tags = res.data.hpo_tag_names === null ? []: res.data.hpo_tag_names.split(',');
            const hpo_tag_ids = res.data.hpo_tag_ids === null ? []: res.data.hpo_tag_ids.split(',');
            var tmp_arr = this.state.phenotype_list
            for(var i = 0; i < hpo_tags.length; i++){
                var link = "/HPO/" + hpo_tag_ids[i];
                tmp_arr.push(<ListItemLink href={link} >
                    <ListItemText  primary={hpo_tags[i]} />
                </ListItemLink>	);
            }
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
            this.setState({
                genotype_list : res.data
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
                
            <Button href={"/editpatient/"+patient.id} style={{ float:"right" }} variant="contained">Edit Patient</Button>
            
           
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
            <Card title={"Patient Name: " + patient.name} extra={<a href={`/matchmaker/${patient.id}`}>Go Manual Matchmaker</a>} style={{ backgroundColor:"#FAFAFA", marginRight: '20px', marginBottom: '10px', boxShadow: '5px 5px' }}>
            <p><b>Patient ID:</b> {patient.id}</p>
            <p><b>Patient Diagnosis</b></p>
            <p>{patient.diagnosis}</p>
            <Row>
            <Col span={12}>
            <List  component="nav" >
            <Row>
            <Col span={9}>
            <h2>Disease Related Phenotypes</h2>
            </Col>
            <Col span={3}>
                <Tooltip disableFocusListener title="Disease Related Phenotypes can be altered by manually in edit patient page with the HPO(Human Phenotype Ontology) terminolagy.">
                    
                    <IconButton  color="primary" component="span">
                        <HelpIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Col>
            </Row>
            {phenotype_list.length ? phenotype_list : <h1>Loading Phenotypes</h1>}
            </List >
            </Col>
            <Col span={12}>
            <List  component="nav" >
            <Row>
            <Col span={6}>
            <h2>Affected Gene Names</h2>
            </Col>
            <Col span={6}>
            <Tooltip disableFocusListener title="Affected Gene Names are generated by taking the gene names that have high impact from the annotated VCF.">
                    <IconButton color="primary" component="span">
                        <HelpIcon fontSize="large" />
                    </IconButton>
            </Tooltip>
            </Col>
            </Row>
            {genotype_list.map(function(element, idx){
                return (<ListItemLink key={idx} href={"https://www.ncbi.nlm.nih.gov/gene/?term=" + element.gene_name} >
                            <ListItemText  key={idx} primary={element.gene_name} />
                        </ListItemLink>)
            })}
            
            </List >
            </Col>
            </Row>
            </Card>
            
            </div>
            
        )
    }
}
export default PatientDetail