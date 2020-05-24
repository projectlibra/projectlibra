import React, { Component } from 'react';
import { Button, Divider } from 'antd';
import PatientProfile from './PatientProfile';

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

const style = {display: 'flex', flexWrap: 'wrap'}

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

class PatientProfiles extends Component{
    constructor(props) {
        super(props);
        this.state = {
            create_open: false,
            edit_open: false,
            edit_patient: {},
            patients: [],
            go_names: {},
            value: "",
            currentIDs: [],
            currentValues:[],
            hpo_tags:[],
            hpo_tag_names: [],
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
        this.fetchGONames = this.fetchGONames.bind(this);
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

    openCreateDialog = () => {
        this.setState({create_open: true});
    }
    closeCreateDialog = () => {
        this.cleanTags();
        this.setState({create_open: false});
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

    componentDidMount() {
        this.fetchPatients();       
    }

    fetchPatients = () => {
        axios.get(host + '/patientprofile',{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            this.setState({
            patients: res.data
            })
            res.data.map(patient =>{
                this.fetchGONames(patient.id)
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
            this.state.go_names[patient_id] = []
            res.data.forEach(element => {
                this.state.go_names[patient_id].push(element.gene_name)
            });
            this.setState({
                refresher: []
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

    handleChange = (e) => {
        let {id, value} = e.target;
        this.setState({
        [id]: value
        });
    }

    submitDialog = () => {
        axios.post(host + '/createPatientProfile',{
        name: this.state.name,
        diagnosis: this.state.diagnosis,
        hpo_tag_ids: this.state.currentIDs,
        hpo_tag_names: this.state.currentValues
        },{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            console.log("Here:");
            console.log(res.data);
            this.setState({
            patients: res.data,
            open: false
            });
            this.fetchPatients();
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
        this.closeCreateDialog();
    }
    editDialog=() => {
        axios.post(`${host}/editPatientProfile/${this.state.edit_patient.patient_id}`,{
        name: this.state.name,
        diagnosis: this.state.diagnosis,
        hpo_tag_ids: this.state.currentIDs,
        hpo_tag_names: this.state.currentValues
        },{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            console.log("Here:");
            console.log(res.data);
            this.setState({
            edit_open: false
            });
            this.fetchPatients();
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
        this.closeCreateDialog();
    }
    
    render() {
        const {patients, go_names} = this.state
        const patientList = patients.length ? (
        patients.map(patient => {
            const edit_patient = {
                patient_id: patient.id,
                name: patient.name,
                diagnosis: patient.diagnosis,
                hpo_tag_names: patient.hpo_tag_names
            }
            
            console.log(go_names[patient.id])
            return (
            <div key={patient.id}>
                <PatientProfile patient_id={patient.id} name={patient.name} diagnosis={patient.diagnosis} hpo_tag_names={patient.hpo_tag_names} go_names={go_names[patient.id]} hpo_tag_ids={patient.hpo_tag_ids}/>
                
            </div>
            )
        })
        )
        :
        (
        <div> Loading Patients </div>
        )
        return (
        <div>
            <Button onClick={this.openCreateDialog}>Create New Patient</Button>
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
            Your Patients
            </Divider>
            
            <div style={style}>
            {patientList}
            </div>

            <Dialog open={this.state.create_open}  fullWidth={true} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create New Patient</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill the following content related to the patient:
                </DialogContentText>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Patient Name"
                fullWidth
                onChange={this.handleChange}
                />
                <TextField
                margin="dense"
                id="diagnosis"
                label="Diagnosis"
                fullWidth
                multiline
                onChange={this.handleChange}
                />
                <List  component="nav" >
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
                <Button onClick={this.closeCreateDialog} color="primary">
                Cancel
                </Button>
                <Button onClick={this.submitDialog} color="primary">
                Create
                </Button>
            </DialogActions>
            </Dialog>
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

export default PatientProfiles;