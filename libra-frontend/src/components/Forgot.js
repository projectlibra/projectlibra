import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class Forgot extends Component{

	
	constructor(props){
  	 super(props);
 	}
 	
 	render(){
		return(
		
			<div>
				<h1> Forgot Password </h1>
				<TextField 
					id="name" 
					label="Username"
					onChange = {(event,newValue) => this.setState({username:newValue})}
				/>
               <br />
               <Button variant="contained">Submit</Button>
			</div>
		);
	}
}

export default Forgot
