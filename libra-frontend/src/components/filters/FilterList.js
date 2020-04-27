import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ScenarioFilter from './ScenarioFilter';
import FrequencyFilter from './FrequencyFilter';
import ImpactFilter from './ImpactFilter';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';

class FilterList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <FilterPanel filterType="scenario" summary="Summary"/>

                <FilterPanel filterType="frequency" summary=""/>

                <FilterPanel filterType="impact" summary=""/>
            </div>
        );        
    }
}

class FilterPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {filterType: props.filterType, summary: props.summary};
    }

    renderTitle(param) {
        switch(param) {
            case 'impact':
                return "Impact";
            case 'frequency':
                return "Frequency";
            case 'scenario':
                return "Scenario";
            default:
                return "Filter Type not defined."
        }
    } 

    renderSwitch(param) {
        switch(param) {
            case 'impact':
                return <ImpactFilter />;
            case 'frequency':
                return <FrequencyFilter />;
            case 'scenario':
                return <ScenarioFilter />;
        }
    } 

    test() {
        console.log("test");
    }

    renderSummary() {
        if (this.state.summary !== "") {
            return(
                <div>
                    <Typography display="inline">{this.state.summary }</Typography>
                    <IconButton aria-label="clear" onClick={()=>this.test()}> 
                        <ClearIcon fontSize="small" /> 
                    </IconButton>
                </div>
            );            
        }
    }

    render() {
        return(
            <div>
                <ExpansionPanel>                
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={this.state.filterType}
                        id={this.state.filterType}
                    >
                        <Typography style={{whiteSpace: 'pre-line'}}>
                            {this.renderTitle(this.state.filterType)}                             
                        </Typography>                 
                    </ExpansionPanelSummary>
                    
                    <ExpansionPanelDetails>
                        {this.renderSwitch(this.state.filterType)}
                    </ExpansionPanelDetails>                
                </ExpansionPanel>
                {this.renderSummary()}
            </div>
            
        );
    }
}

export default FilterList;