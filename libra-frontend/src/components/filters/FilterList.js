import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ScenarioFilter from './ScenarioFilter';
import FrequencyFilter from './FrequencyFilter';
import ImpactFilter from './ImpactFilter';

class FilterList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <FilterPanel filterType="scenario" />

                <FilterPanel filterType="frequency"/>

                <FilterPanel filterType="impact"/>
            </div>
        );        
    }
}

class FilterPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {filterType: props.filterType};
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

    render() {
        return(
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={this.state.filterType}
                    id={this.state.filterType}
                >
                    <Typography >{this.renderTitle(this.state.filterType)}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {this.renderSwitch(this.state.filterType)}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default FilterList;