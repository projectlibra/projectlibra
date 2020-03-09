import React, { Component } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
import { Card, Form, Input, Button } from 'antd';
import axios from 'axios';
import WebSocketInstance from '../websocket';
import {Chart} from 'react-google-charts';
import JsonTable from 'ts-react-json-table';


class VcfFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      preview : null,
      vcf_data: null,
      table_data: [],
      show_data: []
    };
    this.path = "ws://localhost:8765/";
    this.socketRef = new WebSocket(this.path);

    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = e => {
      const msg = JSON.parse(e.data);
      console.log(msg);
      console.log(msg.length);
      console.log(msg.vcf_data.length);
      if(msg.command === "receive_preview") {
        this.setState({
          preview: msg.preview,
          vcf_data: msg.vcf_data
        })
        let arr = [];
        let snp_cnt = 0;
        for (const key of Object.keys(this.state.vcf_data)) {
          console.log(key, this.state.vcf_data[key]);
          console.log(this.state.vcf_data[key].dbSnp);
          if ( this.state.vcf_data[key].dbSnp === true) {
            snp_cnt +=1
          }
        }
        arr.push(["DB", "count"])
        arr.push(['dbSnp', snp_cnt])
        arr.push(['novel', Object.keys(this.state.vcf_data).length - snp_cnt])
        console.log(arr)
        this.setState({
          table_data: arr
        })
        console.log("Hereeeee")
        console.log(this.state.table_data)
      }
      console.log(this.state.vcf_data[0])
      
      //this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
    };
  }

  componentDidMount() {
    let url = 'http://localhost:8000/api/posts/';
    axios.get(url)
      .then(res => {
        console.log("Here:");
        console.log(res.data);
        this.setState({
          files: res.data
        })
      })
      .catch(err => console.log(err))
  }

  
  chartEvents = [
    {
      callback: ({ chartWrapper, google }) => {
        const chart = chartWrapper.getChart();
        chart.container.addEventListener("click", (ev) => {
        })
      },
      eventName: "ready"
    }
  ];
  handleClick = (id) => {
    console.log("Hello")
    const {files} = this.state;
    let file = files.filter( item => {
      return item.id === id
    })
    console.log(file[0].filename)
    let data = "abc"
    try {
      this.socketRef.send("SEND_PREVIEW");
      this.socketRef.send(file[0].filename)
    }
    catch(err) {
      console.log(err.message);
    }  
  }

  render() {
    const {files} = this.state;
    const {preview} = this.state;
    const vcf_data = this.state.vcf_data;
    const fileList = files.length ? (
      files.map(file => {
        return (
          <div key={file.id}>
            <h1>{file.filename}</h1>
            <Button onClick={() => this.handleClick(file.id)}>Preview</Button>
          </div>
        )
      })
    ) : (
      <div>No files yet</div>
    )
    const prev = preview != null ? (<Card title="List of variants"  style={{ width: 600 }}><JsonTable rows={vcf_data} /></Card>)
    : (<div>No preview!</div>)
    const tab_data = this.state.table_data
    const table = tab_data.length ? (
      
      <Chart
      width={'500px'}
      height={'300px'}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={tab_data}
      options={{
        title: 'Gene Distribution',
      }}
      rootProps={{ 'data-testid': '1' }}
      chartEvents={this.chartEvents}
    />
    
    ) : (<div>Loading Chart</div>)

    const var_list = (<div>Test</div>);
    console.log(vcf_data);
    return (
      <div>
        {fileList}
        {table}
        {prev}
      </div>
    );
  }
}

export default VcfFiles;