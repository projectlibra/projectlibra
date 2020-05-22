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
            edit_open: false,
            edit_patient: {},
            patient: [],
            go_names: {},
            value: "",
            currentIDs: [],
            currentValues:[],
            hpo_tags:[],
            hpo_tag_names: [],
            phenotype_list : [],
            genotype_list : [],
            // Data that will be rendered in the autocomplete
            // As it is asynchronous, it is initially empty
            autocompleteData: [],
            refresher: []
        }
        // Bind `this` context to functions of the class
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.getItemValue = this.getItemValue.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.retrieveDataAsynchronously = this.retrieveDataAsynchronously.bind(this);
        
    }
        /**
     * Updates the state of the autocomplete data with the remote data obtained via AJAX.
     * 
     * @param {String} searchText content of the input that will filter the autocomplete data.
     * @return {Nothing} The state is updated but no value is returned
     */
    retrieveDataAsynchronously(searchText){
        let _this = this;

        // Url of your website that process the data and returns a
        let url = 'https://hpo.jax.org/api/hpo/search/?q='.concat(searchText);
        
        // Configure a basic AJAX request to your server side API
        // that returns the data according to the sent text
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let status = xhr.status;

            if (status === 200) {

                // Update the state with the remote data and that's it !
                _this.setState({
                    autocompleteData: xhr.response.terms
                });

                // Show response of your server in the console
                console.log(xhr.response.terms);
                
            } else {
                console.error("Cannot load data from remote source");
            }
        };

        xhr.send();
    }
    
    /**
     * Callback triggered when the user types in the autocomplete field
     * 
     * @param {Event} e JavaScript Event
     * @return {Event} Event of JavaScript can be used as usual.
     */
    onChange(e){
        this.setState({
            value: e.target.value
        });

        /**
         * Handle the remote request with the current text !
         */
        this.retrieveDataAsynchronously(e.target.value);

        console.log("The Input Text has changed to ", e.target.value);
    }

    /**
     * Callback triggered when the autocomplete input changes.
     * 
     * @param {Object} val Value returned by the getItemValue function.
     * @return {Nothing} No value is returned
     */
    onSelect(val){
        let data = this.state.autocompleteData;

		for( var i = 0; i < data.length; i++){
			if( data[i].name === val){
                this.state.currentIDs =  this.state.currentIDs.concat( [data[i].id]); 
                this.state.currentValues = this.state.currentValues.concat( [data[i].name]); 
			}
		}
		this.setState({
            value: val
        });
    }

    /**
     * Define the markup of every rendered item of the autocomplete.
     * 
     * @param {Object} item Single object from the data that can be shown inside the autocomplete
     * @param {Boolean} isHighlighted declares wheter the item has been highlighted or not.
     * @return {Markup} Component
     */
    renderItem(item, isHighlighted){
        return (
            <div style={{ background: isHighlighted ? '#3f51b5' : 'lightgray' }}>
                {item.name}
            </div>   
        ); 
    }

    /**
     * Define which property of the autocomplete source will be show to the user.
     * 
     * @param {Object} item Single object from the data that can be shown inside the autocomplete
     * @return {String} val
     */
    getItemValue(item){
        return item.name ;
    }
    
    getID(item){
    	return item.id
    }
    componentDidMount() {
        const {id} = this.props.match.params;
        this.fetchPatient(id);
        this.fetchGONames(id);
        this.setState({
            refresher: []
        })
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
    openEditDialog = param => e => {
        this.state.edit_patient = {
            patient_id: param.patient_id,
            name: param.name,
            diagnosis: param.diagnosis,
            hpo_tag_names: param.hpo_tag_names
        }
        this.setState({edit_open: true});
    }
    closeEditDialog = () => {
        this.cleanTags();
        this.setState({edit_open: false});
    }
    cleanTags = () =>{
        this.setState({value: ""});
        this.setState({currentIDs: []});
        this.setState({currentValues:[]});
        this.setState({autocompleteData: []});
    }
    editDialog=() => {
        axios.post(`${host}/editPatientProfile/${this.state.edit_patient.patient_id}`,{
        name: this.state.name,
        diagnosis: this.state.diagnosis,
        hpo_tag_ids: this.state.currentIDs,
        hpo_tag_names: this.state.currentValues
        },{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            this.setState({
            edit_open: false
            });
            this.fetchPatient(this.state.edit_patient.patient_id);
        })
        .catch(err =>  {
            if(err.response) {
            console.log(axios.defaults.headers.common)
            console.log(err.response.data)
            if(err.response.status === 401) {
                this.props.history.push('/');
            }
            }
        });
        this.cleanTags();
        this.closeEditDialog();
    }
    handleChange = (e) => {
        let {id, value} = e.target;
        this.setState({
        [id]: value
        });
    }
    render()
    {
        const{patient, phenotype_list, genotype_list} = this.state;
        
        
        const edit_patient = {
            patient_id: patient.id,
            name: patient.name,
            diagnosis: patient.diagnosis,
            hpo_tag_names: patient.hpo_tag_names
        }
        return(
            <div key={patient.id}>
                
            <Button onClick={this.openEditDialog(edit_patient)}>Edit Patient</Button>
            
           
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
            <Dialog open={this.state.edit_open}  fullWidth={true} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit Patient</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill the following content related to the patient:
                </DialogContentText>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={this.state.edit_patient.name}
                fullWidth
                onChange={this.handleChange}
                />
                <TextField
                margin="dense"
                id="diagnosis"
                label={this.state.edit_patient.diagnosis}
                fullWidth
                multiline
                onChange={this.handleChange}
                />
                
                <List  component="nav" >
                    Previous Phenotypes:
                    <ListItem  >
                        {this.state.edit_patient.hpo_tag_names}
                    </ListItem>	
                    Selected Phenotypes:
                    {this.state.currentValues.map( value => 
                    <ListItem  >
                        {value}
                    </ListItem>																			               
                )}
                </List >
                <Autocomplete
							multiple
							getItemValue={this.getItemValue}
							items={this.state.autocompleteData}
							renderItem={this.renderItem}
							value={this.state.value}
							onChange={this.onChange}
							onSelect={this.onSelect}
							inputProps={{ style: menuStyle },{ placeholder: 'HPO Tags' }}
							
                />
                
            </DialogContent>
            <DialogActions>
                <Button onClick={this.cleanTags} color="primary">
                Clean Tags
                </Button>
                <Button onClick={this.closeEditDialog} color="primary">
                Cancel
                </Button>
                <Button onClick={this.editDialog} color="primary">
                Edit
                </Button>
            </DialogActions>
            </Dialog>
            </div>
            
        )
    }
}
export default PatientDetail