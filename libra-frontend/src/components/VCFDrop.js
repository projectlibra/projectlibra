import React, { Component } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'

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
  render() {
    return (
      <div>
        <DropzoneArea
          dropzoneText="Upload your VCF file(s)" acceptedFiles={[".vcf"]} showPreviewsInDropzone={true} showPreviews={false} showAlerts={true} useChipsForPreview={true} onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}

export default VCFDrop;