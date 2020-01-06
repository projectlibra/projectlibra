import React from 'react';
// import './App.css';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import QueryBuilder from 'react-querybuilder';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'chrom',
  'start',
  'end',
  'pi',
  'sub_type',
  'call_rate',
  'is_lof',
  'aaf',
];
const fields = [
  { name: 'chrom', label: 'Chrom' },
  { name: 'start', label: 'Start' },
  { name: 'end', label: 'End' },
  { name: 'pi', label: 'Pi' },
  { name: 'sub_type', label: 'Sub_type' },
  { name: 'call_rate', label: 'Call_rate' },
  { name: 'is_lof', label: 'Is_lof' },
  { name: 'aaf', label: 'Aaf' }
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
function logQuery(query) {
  console.log(query);
}

export default function BasicQuery() {

  const classes = useStyles();
  const theme = useTheme();
  const [db, setDb] = React.useState('');
  const [columnName, setColumnName] = React.useState([]);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  //   React.useEffect(() => {
  //     setLabelWidth(inputLabel.current.offsetWidth);
  //   }, []);

  const handleDbChange = event => {
    setDb(event.target.value);
  };
  const handleColumnChange = event => {
    setColumnName(event.target.value);
  };

  const handleColumnChangeMultiple = event => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setColumnName(value);
  };
  return (
    <div>
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
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id="select-columns">Column(s)</InputLabel>
        <Select
          labelId="select-columns"
          id="select-columns"
          multiple
          value={columnName}
          onChange={handleColumnChange}
          input={<Input id="select-columns" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {names.map(name => (
            <MenuItem key={name} value={name} style={getStyles(name, columnName, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <QueryBuilder fontSize={70} fields={fields} onQueryChange={logQuery} />

    </div>
  );
}

