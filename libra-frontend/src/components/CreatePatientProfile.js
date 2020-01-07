import React, {Component,useState, useContext} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import TextfieldWithPublicity from "./TextfieldWithPublicity";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { CountryRegionData } from 'react-country-region-selector-material-ui-new';
	
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
			   
			    <FormControl style={{ minWidth: 120 }}>
        		<InputLabel id="nationality-select">Naitonality</InputLabel>
        		<Select labelId="nationality-select" >
          		{CountryRegionData.map((option, index) => (
           		 <MenuItem key={option[0]} value={option}>
              		{option[0]}
            		</MenuItem>
        			  ))}
        		</Select>
      			</FormControl><br />
			   <Button variant="contained"  component="label"	>
			   	Attach VCF file   
			   	<input     type="file"    style={{ display: "none" }}  />
			   </Button>
               
               <Button variant="contained">Create</Button>
			</div>
		);
	

}

export default CreatePatientProfile
