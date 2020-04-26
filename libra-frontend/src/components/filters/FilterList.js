import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ScenarioFilter from './ScenarioFilter';
import FrequencyFilter from './FrequencyFilter';

class FilterList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="scenario-panel"
                        id="scenario-panel"
                    >
                        <Typography >Scenario</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <ScenarioFilter />
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="frequency-panel"
                        id="frequency-panel"
                    >
                        <Typography >Frequency</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <FrequencyFilter />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );        
    }
}

export default FilterList;