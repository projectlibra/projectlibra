import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class ImpactFilter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <FormControl component="fieldset" >
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox name="high" />}
                            label="HIGH"
                        />
                        <FormControlLabel
                            control={<Checkbox name="med" />}
                            label="MED"
                        />
                        <FormControlLabel
                            control={<Checkbox name="low" />}
                            label="LOW"
                        />
                        <FormControlLabel
                            control={<Checkbox name="modifier" />}
                            label="MODIFIER"
                        />
                    </FormGroup>
                </FormControl>

                <ImpactFilterSummary />
            </div>            
        );
    }
}

class ImpactFilterSummary extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                Hello world! 2
            </div>
        );
    }
}

export default ImpactFilter;