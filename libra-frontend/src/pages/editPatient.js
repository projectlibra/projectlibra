import React from 'react'
import TextField from '@material-ui/core/TextField';
import { CountryRegionData } from 'react-country-region-selector-material-ui-new';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function EditPatient() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <h1>Edit Patient Profile</h1>
      <form noValidate autoComplete="off">
        <TextField id="standard-basic" label="Name" /> <br />
        <TextField id="standard-basic" label="Surname" /> <br />


      </form>
      <FormControl style={{ minWidth: 120 }}>
        <InputLabel id="nationality-select">Naitonality</InputLabel>
        <Select labelId="nationality-select" >
          {CountryRegionData.map((option, index) => (
            <MenuItem key={option[0]} value={option}>
              {option[0]}
            </MenuItem>
          ))}
        </Select>
      </FormControl><br />

      <Button
        variant="contained"
        component="label"
      >
        Upload VCF
          <input
          type="file"
          style={{ display: "none" }}
        />
      </Button>
      <br />
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Disease
    </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Patient</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill the following content related to the disease:
        </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Condition Name"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Diagnosis Code"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Phenotypic Terms"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Gene ID"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Flagged Candidate Variants"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Chromosomal Coordinates"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
        </Button>
          <Button onClick={handleClose} color="primary">
            Submit
        </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
