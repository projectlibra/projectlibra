import React, {Component, setState} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

class TextfieldWithPublicity extends Component{
	
	constructor(props){
  	 super(props);
  	 this.state={
  	 field:props.field,
 	 text:"",
  	 publicityCheck:false
 	}
 	}
 	
 	render(){
		return(
		
			<div>
				<TextField 
					id={this.state.field.name}
					label={this.state.field.name}
					onChange = {(event,newValue) => this.setState({text:newValue})}
				/>
				<Checkbox
        				value="primary"
        				checked= {this.state.publicityCheck}
        				onChange = {(event,newValue) => this.setState({publicityCheck:newValue})}
               		/>
			</div>
		);
	}
}

export default TextfieldWithPublicity
