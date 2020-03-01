import React, { Component } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'

import axios from 'axios';


class VCFDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }
  handleChange(files) {
    this.setState({
      files: files
    });
  }

  handleVCFUpload = (e) => {
    let form_data = new FormData();
    form_data.append('vcf', e, e.name);
    form_data.append('filename', e.name);

    let url = 'http://localhost:8000/api/posts/';
    axios.post(url, form_data, {
      headers : {
        'content-type': 'mulitpart/form-data'
      }
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err))

  };
  render() {
    return (
      <div>
        <DropzoneArea
          dropzoneText="Upload your VCF file(s)" acceptedFiles={[".vcf"]} showPreviewsInDropzone={true} showPreviews={false} showAlerts={true} useChipsForPreview={true} onDrop={this.handleVCFUpload.bind(this)} onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}

export default VCFDrop;