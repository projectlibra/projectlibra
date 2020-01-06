import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Link } from 'react-router-dom';

class Login extends Component{

	
	constructor(props){
  	 super(props);
 	 this.state={
 	 username:"",
  	 password:"",
  	 remember:false
 	}
 	}
 	

	render(){
		return(
			<div>
				<h1> Login </h1>
				<TextField 
					id="name" 
					label="Username"
					onChange = {(event,newValue) => this.setState({username:newValue})}
				/>
				<br />
				<TextField
               		type="password"
              		label="Password"
               		onChange = {(event,newValue) => this.setState({password:newValue})}
               />
               <br />
               <FormControlLabel
               control = {
               		<Checkbox
        				value="primary"
        				checked= {this.state.remember}
        				onChange = {(event,newValue) => this.setState({remember:newValue})}
               		/>
               }
        		label="Remember Me"
        	    />
               <br />
               <Link to="/forgot"> 
               	Forgot password?
               </Link>
               <br />
               <Button variant="contained">Login</Button>
			</div>
		);
	}
}

export default Login;
