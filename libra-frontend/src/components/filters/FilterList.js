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
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class FilterList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <Container component="main" maxWidth="xs">
                    <FilterPanel filterType="scenario" />

                    <FilterPanel filterType="frequency" />

                    <FilterPanel filterType="impact" />
                    <Grid item xs>
                        <Button>Apply Filter</Button>
                    </Grid>                    
                </Container>
            </div>
        );        
    }
}

class FilterPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {filterType: props.filterType, summary: "", stateBustingKey: 0, summary2: []};
        
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleFrequencyFilterChange = this.handleFrequencyFilterChange.bind(this);
    }

    handleFilterChange(summary) {
        this.setState({summary: summary})
    }

    handleFrequencyFilterChange(summary2) {
        this.setState({summary2: summary2})
    }

    renderTitle() {
        switch(this.state.filterType) {
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

    renderSwitch() {
        switch(this.state.filterType) {
            case 'impact':
                return <ImpactFilter handleFilterChange={this.handleFilterChange} key={this.state.stateBustingKey}/>;
            case 'frequency':
                return <FrequencyFilter handleFrequencyFilterChange={this.handleFrequencyFilterChange} key={this.state.stateBustingKey}/>;
            case 'scenario':
                return <ScenarioFilter handleFilterChange={this.handleFilterChange} key={this.state.stateBustingKey}/>;
        }
    } 

    onClickClear() {        
        this.setState({summary: ""});
        this.setState({ stateBustingKey: this.state.stateBustingKey + 1 });
    }

    onClickClear2() {        
        this.setState({summary2: []});
        this.setState({ stateBustingKey: this.state.stateBustingKey + 1 });
    }

    renderSummary() {
        if (this.state.filterType !== "frequency" && this.state.summary !== "") {
            return(
                <ListItem > 
                    <Typography display="inline">{this.state.summary }</Typography>
                    <IconButton aria-label="clear" onClick={()=>this.onClickClear()}> 
                        <ClearIcon fontSize="small" /> 
                    </IconButton>
                </ListItem>
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
                            {this.renderTitle()}                             
                        </Typography>                 
                    </ExpansionPanelSummary>
                    
                    <ExpansionPanelDetails>
                        {this.renderSwitch()}
                    </ExpansionPanelDetails>                
                </ExpansionPanel>
                <List component="nav" aria-label="main mailbox folders" dense={true}>
                    {this.renderSummary()}
                    {
                        this.state.summary2.map(function(element, i) {
                            if (element !== "any")
                                return(                            
                                    <ListItem key={i}>     
                                        <Typography display="inline">{element}</Typography>
                                        <IconButton aria-label="clear" onClick={()=>this.onClickClear2()}> 
                                            <ClearIcon fontSize="small" /> 
                                        </IconButton>
                                    </ListItem>
                                )  
                        }.bind(this))
                    }
                </List>                
            </div>
            
        );
    }
}

export default FilterList;