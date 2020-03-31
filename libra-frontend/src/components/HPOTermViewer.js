import React, {useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

class HPOTermViewer extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			id: this.props.hpoid,
			name: '',
			def: '',
			parents: [],
			children: []
		}
		this.fetchDataHPO(props.hpoid);
	}
	
	
	async fetchDataHPO  ( hpoid )  {
		const data = await fetch('https://hpo.jax.org/api/hpo/term/'.concat(hpoid));
		const infos = await data.json();
		this.setState({
			id: hpoid,
			name: infos.details.name,
			definition: infos.details.definition,
			parents: infos.relations.parents,
			children: infos.relations.children
		});
		this.props.setName(infos.details.name);
		this.props.setDefi(infos.details.definition);
		this.props.setParents(infos.relations.parents);
		this.props.setChildren(infos.relations.children);
	};
	
	
	handleClick(ontologyId){
		//this.props.hpoSetter(ontologyId);
		this.fetchDataHPO(ontologyId);
		//this.forceUpdate();
	}
		
	render(){
	
	return(
		<div>
		
			<p>
			Name : {this.state.name}
			</p>
			
			<p> 
			Definition : {this.state.definition}
			</p>
			
			<p>
			Parent(s) : <ul>{this.state.parents.map(parent => (
							<li key={parent.ontologyId}>
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
			Children : <ul>{this.state.children.map(child => (
							<li key={child.ontologyId}>
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
			As game {this.state.hpoid}
			</p>
			
		</div>
	);
	
	}

}

export default HPOTermViewer;
