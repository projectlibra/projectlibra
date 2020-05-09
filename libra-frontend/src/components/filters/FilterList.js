import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ScenarioFilter from './ScenarioFilter';
import FrequencyFilter from './FrequencyFilter';
import ImpactFilter from './ImpactFilter';
import PathogenicityFilter from './PathogenicityFilter';
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

        this.state = {
            scenarioInput: "", 
            frequencyInput: {filterDbsnp: "any", filter1k: "any", filter1kfrequency: "1"}, 
            impactInput: {highImpactArray: [], medImpactArray: [], lowImpactArray: []},
            pathogenicityInput: {polyphenArray: [], siftArray: [], polyphenScore: "0", siftScore: "1"}
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.test = this.test.bind(this);
    }

    onInputChange(input, filterType) {
        switch(filterType) {
            case 'scenario':
                this.setState({scenarioInput: input});
                return;
            case 'frequency':
                this.setState({frequencyInput: input});
                return;
            case 'impact':
                this.setState({impactInput: input});
                return;
            case 'pathogenicity':
                this.setState({pathogenicityInput: input});
                return;
            default:
                this.setState(input);
                return;
        }
    }

    test() {
        console.log(this.state);
    }

    render() {
        return(
            <div>
                <Container component="main" maxWidth="xs">
                    <FilterPanel filterType="scenario" onInputChange={this.onInputChange}/>

                    <FilterPanel filterType="frequency" onInputChange={this.onInputChange}/>

                    <FilterPanel filterType="impact" onInputChange={this.onInputChange}/>

                    <FilterPanel filterType="pathogenicity" onInputChange={this.onInputChange}/>
                    <Grid item xs>
                        <Button onClick={() => this.test()}>Apply Filter</Button>
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
    }

    handleFilterChange(input) {
        this.props.onInputChange(input, this.state.filterType);
    }

    renderTitle() {
        switch(this.state.filterType) {
            case 'impact':
                return "Impact";
            case 'frequency':
                return "Frequency";
            case 'scenario':
                return "Scenario";
            case 'pathogenicity':
                return "Pathogenicity";
            default:
                return "Filter Type not defined.";
        }
    } 

    renderSwitch() {
        switch(this.state.filterType) {
            case 'impact':
                return <ImpactFilter handleFilterChange={this.handleFilterChange} key={this.state.stateBustingKey}/>;
            case 'frequency':
                return <FrequencyFilter handleFilterChange={this.handleFilterChange} key={this.state.stateBustingKey}/>;
            case 'scenario':
                return <ScenarioFilter handleFilterChange={this.handleFilterChange} key={this.state.stateBustingKey}/>;
            case 'pathogenicity':
                return <PathogenicityFilter handleFilterChange={this.handleFilterChange} key={this.state.stateBustingKey}/>;
        }
    } 

    selectDefaultState() {
        const defaultState = {
            scenarioInput: "", 
            frequencyInput: {filterDbsnp: "any", filter1k: "any", filter1kfrequency: "1"}, 
            impactInput: {highImpactArray: [], medImpactArray: [], lowImpactArray: []},
            pathogenicityInput: {polyphenArray: [], siftArray: [], polyphenScore: "0", siftScore: "1"}
        };

        switch(this.state.filterType) {
            case "scenario":
                return defaultState.scenarioInput;
            case "frequency":
                return defaultState.frequencyInput;
            case "impact":
                return defaultState.impactInput;
            case "pathogenicity":
                return defaultState.pathogenicityInput;
        }
    }

    onClickClear() {        
        var defaultState = this.selectDefaultState();

        this.setState({ stateBustingKey: this.state.stateBustingKey + 1 }, this.props.onInputChange(defaultState, this.state.filterType));
    }

    renderReset() {        
        return(
            <ListItem > 
                <Button onClick={()=>this.onClickClear()}>Reset filter</Button>
            </ListItem>
        );            
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
                    {this.renderReset()}                    
                </List>                
            </div>
            
        );
    }
}

export default FilterList;