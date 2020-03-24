import React, {useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

class HPOTermViewer extends React.Component {

	constructor(props){
		super(props);
		this.fetchDataHPO(props.hpoid);
	}
	
	
	async fetchDataHPO  ( hpoid )  {
		const data = await fetch('https://hpo.jax.org/api/hpo/term/'.concat(hpoid));
		const infos = await data.json();
		this.props.setName(infos.details.name);
		this.props.setDefi(infos.details.definition);
		this.props.setParents(infos.relations.parents);
		this.props.setChildren(infos.relations.children);
	};
	
	
	handleClick(ontologyId){
		this.props.hpoSetter(ontologyId);
		this.fetchDataHPO(this.props.hpoid);
		this.forceUpdate();
	}
		
	render(){
	
	return(
		<div>
		
			<p>
			Name : {this.props.name}
			</p>
			
			<p> 
			Definition : {this.props.defi}
			</p>
			
			<p>
			Parent(s) : <ul>{this.props.parents.map(parent => (
							<li>
							{
							 <Button color="primary" onClick={() => {
							 	this.handleClick(parent.ontologyId);
							 	}}>
							 	{parent.name}
							 </Button>
							}
							 </li> 
							)
					   )
					}</ul>
			</p>
			
			<p>
			Children : <ul>{this.props.children.map(child => (
							<li>
							{
							  <Button color="primary" onClick={() => {
							 	this.handleClick(child.ontologyId);
							 	}}>
							 	{child.name}
							 </Button>
							}
							</li>
							)
					   )
					}</ul>
			</p>
			
			
			
			<p>
			As game {this.props.hpoid}
			</p>
			
		</div>
	);
	
	}

}

export default HPOTermViewer;
