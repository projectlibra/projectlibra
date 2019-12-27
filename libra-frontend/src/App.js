import React from 'react';
import ButtonAppBar from "./components/ButtonAppBar"
import './App.css';
import CustomizedSelects from './components/CustomizedSelects';
import DialogSelect from "./components/DialogSelect";
import AlgoSelectionRadioButton from "./components/AlgoSelectionRadioButton";
import MatchmakingResultTable from "./components/MatchmakingResultTable";
import Button from '@material-ui/core/Button';

function App() {
  
  return (
    <div className="App">
      <ButtonAppBar />
      <br></br>
      <DialogSelect />
      <CustomizedSelects />          
      <AlgoSelectionRadioButton />
      <br></br>
      <Button variant="contained" color="primary" disableElevation>
        Start Matching
      </Button>
      <br></br>
      <MatchmakingResultTable />
    </div>  
  );             
}

export default App;
