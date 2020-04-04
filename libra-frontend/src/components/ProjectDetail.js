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
      selected_key: 1,
      editorState: EditorState.createEmpty()
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
        project: this.props.location.project
    });
    this.fetchFiles(id);
    this.fetchVCFTable(id);
  }

  fetchFiles = (id) => {
    axios.get(`http://localhost:5000/files/${id}` ,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
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
    axios.get(`http://localhost:5000/vcf_table/${id}` ,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        
        this.setState({
            columns: res.data.columns,
            table_data: res.data.table_data
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

  handleChange = (e) => {
    let {id, value} = e.target;
    this.setState({
      [id]: value
    });
  }

  submitDialog = () => {
    axios.post('http://localhost:5000/project',{
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

  updateState = (nextState) => {
    this.setState(nextState);
  }
  
  render() {
    const {files, no_files, open, project_id, columns, table_data} = this.state;
    console.log("Render:")
    console.log(columns)
    console.log(table_data)
    /*
    const columns = ["Name", "Company", "City", "State", "Name2", "Company2", "City2", "State2",  "Name3", "Company3", "City3", "State3"];
    */
    const data = [
    ["Joe James", "Test Corp", "Yonkers", "NY", "Joe James", "Test Corp", "Yonkers", "NY", "Joe James", "Test Corp", "Yonkers", "NY"],
    ["John Walsh", "Test Corp", "Hartford", "CT", "John Walsh", "Test Corp", "Hartford", "CT", "Joe James", "Test Corp", "Yonkers", "NY"],
    ["Bob Herm", "Test Corp", "Tampa", "FL", "Bob Herm", "Test Corp", "Tampa", "FL", "Joe James", "Test Corp", "Yonkers", "NY"],
    ["James Houston", "Test Corp", "Dallas", "TX", "James Houston", "Test Corp", "Dallas", "TX", "Joe James", "Test Corp", "Yonkers", "NY"],
    ];
    console.log(data);
    const options = {
    filterType: 'checkbox', responsive: 'scroll', whiteSpace: 'nowrap'
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
    const fileUploader = (<Upload project_id={project_id} />)
    
    const fileUploadButton = open ? (
        <Button onClick={this.toggleDialog}>Close File Uploader</Button>
    ) : (<Button onClick={this.toggleDialog}>Open File Uploader</Button>)


    const vcfTable = columns.length  ? (
        <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>
                    <MUIDataTable
                    title={"VCF Table"}
                    data={table_data}
                    columns={columns}
                    options={options}
                    />
        </div>
    ): (
        <div><h3>Loading Table...</h3></div>
    )

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