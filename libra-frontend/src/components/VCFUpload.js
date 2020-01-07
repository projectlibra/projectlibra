import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import VCFDrop from "./VCFDrop";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";

const answers = ['Yes, let\'s query!', 'No, I will query later.'];
const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = value => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title"><b>ANNOTATION DONE!</b> Would you like to query your new annotated variants NOW?</DialogTitle>
            <List>
                <ListItem button onClick={() => handleListItemClick(answers[0])} key={answers[0]} component={Link} to="/buildquery">
                    <ListItemText
                        disableTypography
                        primary={<Typography type="body2" style={{ color: '#14BC79' }}>{answers[0]}</Typography>}
                    />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick(answers[1])} key={answers[1]}>
                    <ListItemText
                        disableTypography
                        primary={<Typography type="body2" style={{ color: '#1D789F' }}>{answers[1]}</Typography>}
                    />
                </ListItem>
            </List>
        </Dialog>
    );
}
SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function VCFUpload() {
    const useStyles = makeStyles(theme => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
        noLabel: {
            marginTop: theme.spacing(3),
        },

        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));
    const classes = useStyles();
    const [db, setDb] = React.useState({ newDB: false, });
    var newVCFdb = null;
    if (db.newDB) {
        newVCFdb = (
            <div>
                <h4>1 . 1) Please enter the new database name:</h4>
                <form noValidate autoComplete="off">
                    <TextField id="standard-basic" label="New Database Name" /> <br />
                </form>
            </div>
        )
    }
    const handleDbChange = event => {
        // setDb(event.target.value);
        if (event.target.value === "db4") {
            setDb({
                newDB: true
            })
        }
        else {
            setDb({
                newDB: false
            })
            setDb(event.target.value);
        }
    };

    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(answers[1]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = value => {
        setOpen(false);
        setSelectedValue(value);
    };
    return (
        <div>
            <h3>1) Choose the database you want to save your annotated VCF(s):</h3>
            <FormControl className={classes.formControl}>
                <InputLabel id="select-db">Database</InputLabel>
                <Select
                    labelId="select-db"
                    id="select-db"
                    value={db}
                    onChange={handleDbChange}
                >
                    <MenuItem value={"db1"}>test.snpEff.vcf.db</MenuItem>
                    <MenuItem value={"db2"}>chr22</MenuItem>
                    <MenuItem value={"db3"}>mydb</MenuItem>
                    <MenuItem value={"db4"}>New Singleton VCF Database</MenuItem>
                </Select>
            </FormControl>
            {newVCFdb}
            <h3>2) Choose the new variant files:</h3>
            <VCFDrop />
            <h3>3) One Last Step:</h3>
            <Button width="25%" height="25%" variant="contained" color="primary" onClick={handleClickOpen}>ANNOTATE VCF FILES</Button>
            <Button width="25%" height="25%" variant="contained" color="secondary" >CANCEL PROCEDURE</Button>
            <h4><i><b>Note: </b></i>LIBRA runs in the background to annotate files. You may leave this page.</h4>
            <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
        </div>
    );
}
