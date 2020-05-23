import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, List, Checkbox, Typography } from 'antd';
import axios from 'axios';
import Autocomplete from 'react-autocomplete';
import { Input,Col, Row } from 'antd';
import host from '../host';
import TextField from '@material-ui/core/TextField';
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


class EditPatient extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentValues: [],
            unselectedValues: [],
            unselectedIDs: [],
            buttonList: [],
            currentIDs: [],
            name: '',
            nameErrorMessage:'This field cannot be empty',
            diagnosis:'',
            autocompleteData: [],
            currentPatient: [],
            nameBackgroundColor:"white",
            refresher: []
        };
        // Bind `this` context to functions of the class
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.getItemValue = this.getItemValue.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.retrieveDataAsynchronously = this.retrieveDataAsynchronously.bind(this);
        this.onHPOTagChecked = this.onHPOTagChecked.bind(this);
        
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
        var tmp_currentIDs = this.state.currentIDs;
        var tmp_currentValues = this.state.currentValues;
        var tmp_buttonList = this.state.buttonList;
		for( var i = 0; i < data.length; i++){
			if( data[i].name === val){
                tmp_currentIDs.push( data[i].id);
                tmp_currentValues.push( data[i].name);
                tmp_buttonList.push(<Checkbox name={data[i].id} defaultChecked={true} onChange={this.onHPOTagChecked}>{data[i].name}</Checkbox>);
			}
        }
		this.setState({
            currentIDs: tmp_currentIDs,
            currentValues: tmp_currentValues, 
            buttonList: tmp_buttonList,
            value: val
        });
        console.log(this.state.currentValues)
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
    
    handleNameChange = (e) => {
        if(e.target.value.length ===0)
        {
            this.setState({
                nameBackgroundColor: "red"
            })
        }
        else{
            this.setState({
                nameBackgroundColor: "white"
            })
        }
        
        this.setState({
            name : e.target.value
        });        
    }  
    handleDiagnosisChange = (e) => {
        this.setState({
            diagnosis : e.target.value
        });        
    } 
    componentDidMount() {
        const {id} = this.props.match.params;
        
        var tmp_currentIDs = this.state.currentIDs;
        var tmp_currentValues = this.state.currentValues;
        var tmp_buttonList = this.state.buttonList;
        axios.get(`http://localhost:5000/gethpotags/${id}`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(res => {
            res.data.map(HPOtag => {
                tmp_currentIDs.push( HPOtag.hpo_tag_id);
                tmp_currentValues.push( HPOtag.hpo_tag_name);
                tmp_buttonList.push(<Checkbox name={HPOtag.hpo_tag_id} defaultChecked={true} onChange={this.onHPOTagChecked}>{HPOtag.hpo_tag_name}</Checkbox>);
            })
            this.setState({
                currentIDs: tmp_currentIDs,
                currentValues: tmp_currentValues, 
                buttonList: tmp_buttonList,
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
                currentPatient: res.data,
                name: res.data.name,
                diagnosis: res.data.diagnosis
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
        if(e.target.checked === false){
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
            if (index > -1) {
                this.state.currentIDs.push(this.state.unselectedIDs.splice(index, 1)[0])
                this.state.currentValues.push(this.state.unselectedIDs.splice(index, 1)[0])
            }
            console.log(this.state.currentIDs)
        }
        
    }
    editDialog=() => {
        const {id} = this.props.match.params;
        if(this.state.name.length==0)
        {
            this.setState({
                nameBackgroundColor: "red"
            })
        }
        else{
            axios.post(`${host}/editPatientProfile/${id}`,{
                name: this.state.name,
                diagnosis: this.state.diagnosis,
                hpo_tag_ids: this.state.currentIDs,
                hpo_tag_names: this.state.currentValues
                },{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
                .then(res=>{
                    this.props.history.push('/patients');
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
        }
        
    }
    
    render() {
        const classes = {
            table: {
              minWidth: 650,
            },
          }
        const { Title } = Typography;
        const { TextArea } = Input;
        const { currentPatient, buttonList, name,diagnosis} = this.state
        return (
            <div style={{textAlign: 'center'}}>
                <Title level={3}>Edit Patient: {currentPatient.name}</Title>
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                <h3>Patient Name</h3>
                <TextArea 
                id="name" style={{ width: '30%', backgroundColor: this.state.nameBackgroundColor }} 
                value={name}  
                placeholder={this.state.nameErrorMessage}
                onChange={this.handleNameChange} 
                autoSize={{ minRows: 1, maxRows: 1 }}
                />
                
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                <h3>Diagnosis</h3>
                <TextArea
                    style={{ width: '30%' }}
                    onChange={this.handleDiagnosisChange}
                    id="diagnosis"
                    value={diagnosis}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                />
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
                            header={<div>Select Phenotypes to Edit Phenotype List of Patient:</div>}
                            dataSource={buttonList}
                            renderItem={item=> (
                                <List.Item>
                                    {item}
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
                <Button onClick={this.editDialog} color="primary">
                Edit
                </Button>
            </div>

        )
    }
}
export default EditPatient;