import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, List, Checkbox, Typography } from 'antd';
import axios from 'axios';
import Autocomplete from 'react-autocomplete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const menuStyle = {
	borderRadius: '3px',
	boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
	background: 'rgba(255, 255, 255, 0.9)',
	padding: '2px 0',
    fontSize: '100%',
    position: "relative",
	overflow: 'auto',
	maxHeight: '100%', // TODO: don't cheat, let it flow to the bottom
  };


class MatchMaker extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fetchedPatientsByHPOID: [],
            fetchedPatientsByHPOMetric: [],
            fetchedPatientsByGOMetric: [],
            currentValues: [],
            unselectedValues: [],
            unselectedIDs: [],
            buttonList: [],
            currentIDs: [],
            autocompleteData: [],
            hpoMetricResults:[],
            currentPatient: [],
            refresher: []
        };
        // Bind `this` context to functions of the class
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.getItemValue = this.getItemValue.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.retrieveDataAsynchronously = this.retrieveDataAsynchronously.bind(this);
        this.onHPOTagChecked = this.onHPOTagChecked.bind(this);
        this.onManualMatchMakerClicked = this.onManualMatchMakerClicked.bind(this);
        this.onHPOMatchMakerClicked = this.onHPOMatchMakerClicked.bind(this);
        this.onGOMatchMakerClicked = this.onGOMatchMakerClicked.bind(this);
        this.fetch_patients_by_hpo = this.fetch_patients_by_hpo.bind(this);
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
                this.state.buttonList.push(<Checkbox name={data[i].id} defaultChecked={true} onChange={this.onHPOTagChecked}>{data[i].name}</Checkbox>);
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

    fetch_patients_by_hpo(cur_hpo_id) {
        axios.get(`http://localhost:5000/matchmakerresults/${cur_hpo_id}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            var newPatientList = this.state.fetchedPatientsByHPOID;
            res.data.forEach(element => {
                console.log(this.state.fetchedPatientsByHPOID);
                var doesExist = false;
                this.state.fetchedPatientsByHPOID.forEach(patient => {
                    if (patient.id == element.id)
                    doesExist = true;
                })
                if(!doesExist)
                    newPatientList.push(element)
            });
            this.setState({
                fetchedPatientsByHPOID: newPatientList
            });
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

    

    fetch_patient_by_metric(patient_id, isHPO){
        axios.get(`http://localhost:5000/patientprofile/${patient_id}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            if(isHPO){
                this.state.fetchedPatientsByHPOMetric.push(res.data)
            }
            else{
                this.state.fetchedPatientsByGOMetric.push(res.data)
            }
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

    

    fetch_hpo_patients(currentPatientID){
        axios.get(`http://localhost:5000/matchmakerhpo/${currentPatientID}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            console.log(res.data);
            this.setState({
                hpoMetricResults: res.data
            })
            res.data.forEach(element => {
                this.fetch_patient_by_metric(element.patient_id,true)
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
    fetch_go_patients(currentPatientID){  
        axios.get(`http://localhost:5000/matchmakergo/${currentPatientID}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            console.log(res.data);
            this.setState({
                goMetricResults: res.data
            })
            res.data.forEach(element => {
                    this.fetch_patient_by_metric(element.patient_id,false)
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
    componentDidMount() {
        const {id} = this.props.match.params;
        
        var mountedPatientHPOtags = [];
        axios.get(`http://localhost:5000/gethpotags/${id}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            console.log("Here:");
            console.log(res.data);
            mountedPatientHPOtags = res.data
            mountedPatientHPOtags.map(HPOtag => {
                console.log(HPOtag )
                this.state.currentIDs =  this.state.currentIDs.concat( [HPOtag.hpo_tag_id]); 
                this.state.currentValues = this.state.currentValues.concat( [HPOtag.hpo_tag_name]); 
                this.state.buttonList.push(<Checkbox name={HPOtag.hpo_tag_id} defaultChecked={true} onChange={this.onHPOTagChecked}>{HPOtag.hpo_tag_name}</Checkbox>);
                console.log(this.state.currentIDs )
            })
            this.setState({
                unselectedIDs:[]
            });
            
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
        axios.get(`http://localhost:5000/patientprofile/${id}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            this.setState({
                currentPatient: res.data
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
    onHPOTagChecked(e){
        console.log(e.target.name)
        if(e.target.checked === false){
            console.log(e.target.checked)
            console.log(this.state.currentIDs)
            const index = this.state.currentIDs.indexOf(e.target.name);
            if (index > -1) {
                this.state.unselectedIDs.push(this.state.currentIDs.splice(index, 1)[0])
                this.state.unselectedIDs.push(this.state.currentValues.splice(index, 1)[0])
            }

        }
        else
        {
            console.log(e.target.checked)
            const index = this.state.unselectedIDs.indexOf(e.target.name);
            console.log(index)
            if (index > -1) {
                this.state.currentIDs.push(this.state.unselectedIDs.splice(index, 1)[0])
                this.state.currentValues.push(this.state.unselectedIDs.splice(index, 1)[0])
            }
            console.log(this.state.currentIDs)
        }
        
    }
    onManualMatchMakerClicked(){
        this.setState({
            fetchedPatientsByHPOID : []
        })
        if(typeof this.state.currentIDs !== 'undefined'){
            this.state.currentIDs.forEach(element => {
                this.fetch_patients_by_hpo(element)
            });
        }
    }
    onHPOMatchMakerClicked(){
        this.setState({
            fetchedPatientsByHPOMetric : []
        })
        this.fetch_hpo_patients(this.state.currentPatient.id);
    }
    onGOMatchMakerClicked(){
        this.setState({
            fetchedPatientsByGOMetric : []
        })
        console.log(this.state.currentPatient);
        if(this.state.currentPatient.go_tag_ids.length > 0){
            this.fetch_go_patients(this.state.currentPatient.id);
        }
    }
    render() {
        const classes = {
            table: {
              minWidth: 650,
            },
          }
        const { Title } = Typography;
        const {fetchedPatientsByHPOID, fetchedPatientsByHPOMetric, fetchedPatientsByGOMetric, hpoMetricResults, goMetricResults, currentPatient} = this.state
        return (
            <div>
                <Title level={3}>MatchMaker For Patient: {currentPatient.name}</Title>
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
               <div style={{width: "100%", overflow: "hidden"}}>
                    <div style={{width: "600px", height: "250px", float: "left"}}> 
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
                    </div>
                    <div style={{marginLeft: "620px"}}>
                         
                        <List  itemLayout="horizontal"
                            header={<div>Selected Phenotypes:</div>}
                            dataSource={this.state.buttonList}
                            renderItem={item=> (
                                <List.Item>
                                    {item}
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
                <Button type="primary" onClick={this.onManualMatchMakerClicked}>Run Manual MatchMaker</Button>
                
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                    Manual MatchMaker Results
                </Divider>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Patient Contact</TableCell>
                            <TableCell align="right">Diagnosis</TableCell>
                            <TableCell align="right">Phenotypes</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {fetchedPatientsByHPOID.map(patient => (
                            <TableRow>
                            <TableCell component="th" scope="row">
                                {patient.patient_contact}
                            </TableCell>
                            <TableCell align="right">{patient.diagnosis}</TableCell>
                            <TableCell align="right">{patient.hpo_tag_names}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                    
                </Divider>
                <Button type="primary" onClick={this.onHPOMatchMakerClicked}>Run HPO MatchMaker</Button>
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                    HPO MatchMaker Results
                </Divider>

                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Patient Contact</TableCell>
                            <TableCell align="right">Diagnosis</TableCell>
                            <TableCell align="right">Genotypes</TableCell>
                            <TableCell align="right">Phenotypes</TableCell>
                            <TableCell align="right">HPO Similarty Percentage</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {fetchedPatientsByHPOMetric.map(patient => (
                            <TableRow>
                            <TableCell component="th" scope="row">
                                {patient.patient_contact}
                            </TableCell>
                            <TableCell align="right">{patient.diagnosis}</TableCell>
                            <TableCell align="right">{patient.go_tag_ids}</TableCell>
                            <TableCell align="right">{patient.hpo_tag_names}</TableCell>
                            <TableCell align="right">{hpoMetricResults.filter(function(v) {
                                return v.patient_id == patient.id;
                            })[0].similarity}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                    
                </Divider>
                <Button type="primary" onClick={this.onGOMatchMakerClicked}>Run GO MatchMaker</Button>
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                    GO MatchMaker Results
                </Divider>

                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Patient Contact</TableCell>
                            <TableCell align="right">Diagnosis</TableCell>
                            <TableCell align="right">Genotypes</TableCell>
                            <TableCell align="right">Phenotypes</TableCell>
                            <TableCell align="right">GO Similarty Percentage</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {fetchedPatientsByGOMetric.map(patient => (
                            <TableRow>
                            <TableCell component="th" scope="row">
                                {patient.patient_contact}
                            </TableCell>
                            <TableCell align="right">{patient.diagnosis}</TableCell>
                            <TableCell align="right">{patient.go_tag_ids}</TableCell>
                            <TableCell align="right">{patient.hpo_tag_names}</TableCell>
                            <TableCell align="right">{goMetricResults.filter(function(v) {
                                return v.patient_id == patient.id;
                            })[0].similarity}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        )
    }
}
export default MatchMaker;