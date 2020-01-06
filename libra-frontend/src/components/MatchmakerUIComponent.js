import React from 'react';

import '../App.css';
import CustomizedSelects from './CustomizedSelects';
import DialogSelect from "./DialogSelect";
import AlgoSelectionRadioButton from "./AlgoSelectionRadioButton";
import MatchmakingResultTable from "./MatchmakingResultTable";
import Button from '@material-ui/core/Button';

function MatchmakerUIComponent() {
  
  return (
    <div className="MatchmakerUIComponent">
      <DialogSelect />
      <CustomizedSelects />          
      <AlgoSelectionRadioButton />
      <br></br>
      <br></br>
      <Button variant="contained" color="primary" disableElevation>
        Start Matching
      </Button>
      <br></br>
      <MatchmakingResultTable />
    </div>  
  );             
}

export default MatchmakerUIComponent;