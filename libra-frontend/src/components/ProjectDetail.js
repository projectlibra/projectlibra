import React, { Component } from 'react';
import { Button, Row, Col, Divider } from 'antd';
import Project from '../components/Project';

import axios from 'axios';
import BasicVCFUpload from './BasicVCFUpload';
import Sider from './ProjectDetailContainer';
import Upload from './upload/Upload';
import MUIDataTable from "mui-datatables";
import HorizontalScroller from 'react-horizontal-scroll-container';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import EditorConvertToHTML from './MyEditor';
import {Chart} from 'react-google-charts';
import host from '../host';
import { TableFooter, TableCell, TableRow } from "@material-ui/core";
import CustomFooter from "./CustomFooter";
import LoadingOverlay from 'react-loading-overlay';
import { StopOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Dropdown, message } from 'antd';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const style = {display: 'flex', flexWrap: 'wrap'}

class Projects extends Component{
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: [],
      no_files: false,
      columns: [],
      table_data: [],
      pie_data: [],
      selected_key: 1,
      selected_patient: 0,
      load_index: 0,
      editorState: EditorState.createEmpty(),
      isActive: false,
      hasDisease: false,
      project_patients: [],
      patient_name: "",
      patients: []
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  toggleDialog = (e) => {
    this.setState({open: !this.state.open});
  }
  closeDialog = () => {
    this.setState({open: false});
  }

  componentDidMount() {
    const {id} = this.props.match.params
    console.log(this.props.location)
    this.setState({
        project_id: id,
    });
    this.fetchFiles(id);
    this.fetchPatients();
    this.fetchVCFTable(id);
    this.fetchProjectPatients(id);
    
  }

  fetchFiles = (id) => {

    axios.get(`${host}/files/${id}` ,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        this.setState({
          files: res.data,
          no_files: res.data.length ? false : true
        });
      })
      .catch(err =>  {
        if(err.response) {
          console.log(axios.defaults.headers.common)
          console.log(err.response.data)
          if(err.response.status == 401) {
            this.props.history.push('/');
          }
        }
      })
  }

  fetchVCFTable = (id) => {
    axios.get(`${host}/vcf_table/${id}` ,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        
        this.setState({
            columns: res.data.columns,
            table_data: res.data.table_data,
            pie_data: res.data.pie_data,
            pie1k_data: res.data.pie1k_data,
            project: res.data.project
        }, () => {
            console.log("Finished")
            console.log(res.data.table_data)
        })

      })
      .catch(err =>  {
        if(err.response) {
          console.log(axios.defaults.headers.common)
          console.log(err.response.data)
          if(err.response.status == 401) {
            this.props.history.push('/');
          }
        }
      })
  }

  fetchPatients = () => {
    axios.get(`${host}/patientprofile` ,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        this.setState({
          patients: res.data,
        });
      })
      .catch(err =>  {
        if(err.response) {
          console.log(axios.defaults.headers.common)
          console.log(err.response.data)
          if(err.response.status == 401) {
            this.props.history.push('/');
          }
        }
      })
  }

  fetchProjectPatients = (id) => {
    axios.get(`${host}/projectpatients/${id}` ,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        this.setState({
          project_patients: res.data,
        });
      })
      .catch(err =>  {
        if(err.response) {
          console.log(axios.defaults.headers.common)
          console.log(err.response.data)
          if(err.response.status == 401) {
            this.props.history.push('/');
          }
        }
      })
  }


  loadMore = () => {
    this.setState({
      isActive: true
    })
    console.log("Load more called!")
    axios.get(`${host}/vcf_table/${this.state.project_id}/${this.state.load_index + 1}` ,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        
        this.setState({
            table_data: this.state.table_data.concat(res.data.table_data),
            load_index: this.state.load_index+1
        }, () => {
            this.setState({
              isActive: false
            })
            console.log("Finished")
            console.log(res.data.table_data)
        })

      })
      .catch(err =>  {
        if(err.response) {
          console.log(axios.defaults.headers.common)
          console.log(err.response.data)
          if(err.response.status == 401) {
            this.props.history.push('/');
          }
        }
      })
  }

  handleChange = (e) => {
    let {id, value} = e.target;
    this.setState({
      [id]: value
    });
  }

  submitDialog = () => {
    axios.post(host + '/project',{
      name: this.state.name,
      desc: this.state.desc
    },{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        this.setState({
          projects: res.data,
          open: false
        });
        this.fetchProjects();
      })
      .catch(err =>  {
        if(err.response) {
          console.log(axios.defaults.headers.common)
          console.log(err.response.data)
          if(err.response.status == 401) {
            this.props.history.push('/');
          }
        }
      });
      
  }

  handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
    if(e.key != 0 && e.key != -1) {
      var patient = this.state.patients.find(obj => {return obj.id == e.key});
      this.setState({patient_name: patient.name})
    }
    this.setState({selected_patient: e.key})
    
  }

  updateState = (nextState) => {
    this.setState(nextState);
  }

  handleDiseaseClick = (e) => {
    this.setState({hasDisease: e.target.checked})
  }
  
  render() {
    const {files, no_files, open, project, project_id, project_patients, table_data, pie_data, pie1k_data, patients, selected_patient} = this.state;
    console.log("Render:")
    
    console.log(table_data)
    /*
    const columns = ["Name", "Company", "City", "State", "Name2", "Company2", "City2", "State2",  "Name3", "Company3", "City3", "State3"];
    */
    const columns = [
      {name: "chrom"},
      {name: "pos"},
      {name: "id",
       options: {
         customBodyRender: (value, tableMeta, updateValue) => (
           <a href={`https://www.ncbi.nlm.nih.gov/snp/${value}`} target="_blank">{value}</a>
         )
       }},
      {name: "ref"},
      {name: "alt"},
      {name: "qual"},
      {name: "filter"},
      {name: "info"},
      {name: "alelle"},
      {name: "annotation"},
      {name: "impact"},
      {name: "gene_name"},
      {name: "gene_id"},
      {name: "feature_type"},
      {name: "feature_id"},
    ];
    const data = [
    ["Joe James", "Test Corp", "Yonkers", "NY", "Joe James", "Test Corp", "Yonkers", "NY", "Joe James", "Test Corp", "Yonkers", "NY"],
    ["John Walsh", "Test Corp", "Hartford", "CT", "John Walsh", "Test Corp", "Hartford", "CT", "Joe James", "Test Corp", "Yonkers", "NY"],
    ["Bob Herm", "Test Corp", "Tampa", "FL", "Bob Herm", "Test Corp", "Tampa", "FL", "Joe James", "Test Corp", "Yonkers", "NY"],
    ["James Houston", "Test Corp", "Dallas", "TX", "James Houston", "Test Corp", "Dallas", "TX", "Joe James", "Test Corp", "Yonkers", "NY"],
    ];
    console.log(data);
    const options = {
    filterType: 'dropdown', 
    responsive: 'scroll', 
    whiteSpace: 'nowrap',
    /*customFooter: () => {
      return(
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                <Button>Load More</Button>
              </TableCell>
            </TableRow>
          </TableFooter>
      );
    }*/
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
      return (  
        <CustomFooter 
          count={count} 
          page={page} 
          rowsPerPage={rowsPerPage} 
          changeRowsPerPage={changeRowsPerPage} 
          changePage={changePage} 
          textLabels={textLabels} 
          loadMore={this.loadMore}/>
      );
    }
    };
    
    
    const name = ""
    console.log(`Hey ${project_id}` )
    const fileList = files.length ? (
        files.map(file => {
        return (
          <div key={file.id}>
            <li>{file.name}</li>
          </div>
        )
      })
    )
    :
    (
        no_files ? <div> You haven't uploaded any files yet. </div>
                 : <div> Loading Files </div> 
    )

    /*const fileUploader = open ? (
        <BasicVCFUpload project_id={project_id} />
    ) : (
        <div></div>
    )*/

    const patientList = patients.length ? (
      patients.map(patient => {
      return (
        <Menu.Item key={patient.id} icon={<UserOutlined />}>
          <li>{patient.name}</li>
        </Menu.Item>
      )
    })
  ) : (null)
    const other = (<Menu.Item key="5" icon={<UserOutlined />}>
    Patient3
  </Menu.Item>)
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="0" icon={<UserOutlined />}>
         <StopOutlined/> None
        </Menu.Item>
        <Menu.Item key="-1" icon={<UserOutlined />}>
         <PlusOutlined/> Batch Upload
        </Menu.Item>
        {patientList}
      </Menu>
    );

    let fileUploader;
    if(selected_patient == 0) {
      fileUploader = <div>
      <Dropdown.Button overlay={menu} icon={<UserOutlined />}>
        Select a patient: 
      </Dropdown.Button>
      <Upload project_id={project_id} patient_id={selected_patient} />
    </div>
    }
    else if(selected_patient == -1) {
      fileUploader = <div>
      <Dropdown.Button overlay={menu} icon={<UserOutlined />}>
        Select a patient: 
      </Dropdown.Button>
      <p>Samples in the VCF file will be created as patients.</p>
      <Upload project_id={project_id} patient_id={selected_patient} />
    </div>
    }
    else if(project.disease == "") {
      fileUploader = <div>
      <Dropdown.Button overlay={menu} icon={<UserOutlined />}>
        Select a patient: 
      </Dropdown.Button>
      <p>Patient: {this.state.patient_name} will be added to the project.</p>
      <Upload project_id={project_id} patient_id={selected_patient} />
    </div>
    }
    else {
      fileUploader = <div>
      <Dropdown.Button overlay={menu} icon={<UserOutlined />}>
        Select a patient: 
      </Dropdown.Button>
      <p>Patient: {this.state.patient_name} will be added to the project.</p>
      <p>Does {this.state.patient_name} has the disease? {project.disease} <Checkbox color="blue" value="disease" onClick={this.handleDiseaseClick} /></p>
      <Upload project_id={project_id} patient_id={selected_patient} has_disease={this.state.hasDisease} />
    </div>
    }
    /*
    const fileUploader = "" == "" ? (
      <div>
        <Dropdown.Button overlay={menu} icon={<UserOutlined />}>
          Select a patient: 
        </Dropdown.Button>
        <p>Patient: {this.state.patient_name} will be added to the project.</p>
        <Upload project_id={project_id} patient_id={selected_patient} />
      </div>
    ) : (
      <div>
        <Dropdown.Button overlay={menu} icon={<UserOutlined />}>
          Select a patient: 
        </Dropdown.Button>
        <p>Patient: {this.state.patient_name} will be added to the project.</p>
        <p>{this.state.patient_name} has the disease: {project.disease}</p>
        <Checkbox value="disease" />
        <Upload project_id={project_id} patient_id={selected_patient} />
      </div>
    );*/
    
    const fileUploadButton = open ? (
        <Button onClick={this.toggleDialog}>Close File Uploader</Button>
    ) : (<Button onClick={this.toggleDialog}>Open File Uploader</Button>)


    const vcfTable = columns.length  ? (
          <div>
          <Chart
          width={'500px'}
          height={'300px'}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={pie_data}
          options={{
            title: 'dbSNP Variant Distribution',
          }}
          rootProps={{ 'data-testid': '1' }}
          chartEvents={this.chartEvents}
          style = {{float: 'left'}}
        />
        <Chart
          width={'500px'}
          height={'300px'}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={pie1k_data}
          options={{
            title: '1KG Variant Distribution',
          }}
          rootProps={{ 'data-testid': '1' }}
          chartEvents={this.chartEvents}
          style = {{float: 'right'}}
        />
        <LoadingOverlay
          active={this.state.isActive}
          spinner
          text='Loading more variants...'
          >
          <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>
                    <MUIDataTable
                    title={"VCF Table"}
                    data={table_data}
                    columns={columns}
                    options={options}
                    />
          </div>
        </LoadingOverlay>
        
        </div>
    ): (
        <div><h3>Loading Table...</h3></div>
    )



    const patientCheckList = project_patients.length ? (
      project_patients.map(patient => {
      return (
        <div key={patient.id}>
          <FormControlLabel
            control={<Checkbox name="gilad" value={patient.id} />}
            label={patient.name}
          />
        </div>
        
      )
    })
  ) : (<p>No patients!</p>)

    let final_render;
    if(this.state.selected_key == 1) {
        final_render = vcfTable;
    }
    else if(this.state.selected_key == 2) {
        final_render = fileUploader;
    }
    else if(this.state.selected_key == 3) {
        final_render = (
            <EditorConvertToHTML/>    
        );
    }
    else if(this.state.selected_key == 4) {
      final_render = patientCheckList;
    }
    return (
      <div style= {{display: "flex", flexDirection: "row"}}>
        <Sider updateParent={this.updateState} />
        <div style ={{paddingLeft: "15px"}}>
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'bold', fontSize: '20px' }}>
            Project Summary
            <Button style={{marginLeft: "10px"}} onClick={() => {this.fetchFiles(project_id); this.fetchVCFTable(project_id);}}>Refresh</Button>
            </Divider>
            
            
            
            
            <div style={style}>
            
            </div>
            {final_render}
            
                
            
            
        </div>
        
        

      </div>
    )
  }
}

export default Projects;