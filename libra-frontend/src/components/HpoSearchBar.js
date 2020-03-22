import React from 'react';

// Import the Autocomplete Component
import Autocomplete from 'react-autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';




export default class HpoSearchBar extends React.Component {

    constructor(props, context) {
        super(props, context);

        // Set initial State
        this.state = {
            // Current value of the select field
            value: "",
            currentIDs: [],
            // Data that will be rendered in the autocomplete
            // As it is asynchronous, it is initially empty
            autocompleteData: []
        };

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

            if (status == 200) {

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
			}
		}
		this.setState({
            value: val
        });
        console.log( val);
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
            <div style={{ background: isHighlighted ? 'lightgray' : 'black' }}>
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
    
    handleClick(id){
    	console.log(id)
    	let data = this.state.currentIDs;
    	for( var i = 0; i < data.length; i++){
			if( data[i] === id){
				this.state.currentIDs.splice(i,1); 
			}
		}
		console.log(this.state.currentIDs);
    }

    render() {
        return (
        <div style ={{display : 'inline-block'}} >
            <div style = {{float:'left'}}>            
                <Autocomplete
                	multiple
                    getItemValue={this.getItemValue}
                    items={this.state.autocompleteData}
                    renderItem={this.renderItem}
                    value={this.state.value}
                    onChange={this.onChange}
                    onSelect={this.onSelect}
                />
             </div>
             <div style = {{float:'right'}}>
                <List  component="nav" >
                {this.state.currentIDs.map( id => 
                	<ListItem onClick={e => this.handleClick(e.target.textContent)} button>
                		{id}
                		 
                	</ListItem>																			               
                )}
                </List >
            </div>
        </div>
        );
    }
}

