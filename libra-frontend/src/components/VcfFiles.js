import React, { Component } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import WebSocketInstance from '../websocket';


class VcfFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      preview : null
    };
    this.path = "ws://localhost:8765/";
    this.socketRef = new WebSocket(this.path);

    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = e => {
      const msg = JSON.parse(e.data)
      console.log(msg)
      if(msg.command === "receive_preview") {
        this.setState({
          preview: msg.preview
        })
      }
      
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
    return (
      <div>
        {fileList}

    {preview != null ? (<div>{preview}</div>)
        : (<div>No preview!</div>)}
      </div>
    );
  }
}

export default VcfFiles;