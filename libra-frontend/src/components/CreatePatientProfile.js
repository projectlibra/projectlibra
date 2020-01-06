import React, {Component,useState, useContext} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import TextfieldWithPublicity from "./TextfieldWithPublicity";

	
function CreatePatientProfile()  {

const [fields, setFields] = useState([
		{
			name:'Name',
			text:'',
			checked:'false'
		},
		{
			name:'Surname',
			text:'',
			checked:'false'
		},
		{
			name:'Nationality',
			text:'',
			checked:'false'
		}
		]);

		return(
			<div>
			   <h1> Create a Patient Profile </h1>
			   <br/>
			   <p> Please check the box that is next to the information you enter to share it publicly </p>
			   
			   { fields.map( field => (
			   <TextfieldWithPublicity field= {field} />
			   ))
			   }
			   
			   <br/>
			   
			   <Button variant="contained"  component="label"	>
			   	Attach VCF file   
			   	<input     type="file"    style={{ display: "none" }}  />
			   </Button>
               
               <Button variant="contained">Create</Button>
			</div>
		);
	

}

export default CreatePatientProfile
