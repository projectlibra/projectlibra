import React, {useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

export const HPOTermViewer = props => {

	useEffect(() => {		
		fetchDataHPO(hpoid);
	}, []);
	
	const [name, setName] = React.useState('');
	const [defi, setDefi] = React.useState('');
	const [parents,setParents] = React.useState([]);
	const [children, setChildren] = React.useState([]);
	const [hpoid,setHpoid] = React.useState(props.hpoid);
	
	const fetchDataHPO = async( hpoid ) => {
		const data = await fetch('https://hpo.jax.org/api/hpo/term/'.concat(hpoid));
		const infos = await data.json();
		setName(infos.details.name);
		setDefi(infos.details.definition);
		setParents(infos.relations.parents);
		setChildren(infos.relations.children);
	};
	
	
	
		
	return(
		<div>
			
			<p>
			Name : {name}
			</p>
			
			<p> 
			Definition : {defi}
			</p>
			
			<p>
			Parent(s) : <ul>{parents.map(parent => (
							<li>
							{
							 <Button color="primary" onClick={() => {
							 	setHpoid(parent.ontologyId);
							 	fetchDataHPO(hpoid);}}>
							 	{parent.name}
							 </Button>
							}
							 </li> 
							)
					   )
					}</ul>
			</p>
			
			<p>
			Children : <ul>{children.map(child => (
							<li>
							{
							  <Button color="primary" onClick={() => {
							 	setHpoid(child.ontologyId);
							 	fetchDataHPO(hpoid);}}>
							 	{child.name}
							 </Button>
							}
							</li>
							)
					   )
					}</ul>
			</p>
			
		</div>
	);

}

export default HPOTermViewer;
