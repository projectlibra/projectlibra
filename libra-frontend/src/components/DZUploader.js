import React from 'react';
import FileUploadProgress  from 'react-fileupload-progress';
import axios from 'axios';
import host from '../host';
 
class DZUploader extends React.Component {
  constructor(props) {
    super(props);
  }

  uploadFile = (e) =>{
    e.preventDefault();
    let file = this.state.file;
    const formData = new FormData();

    formData.append("file", file);

    axios
      .post(host + "/upload", formData)
      .then(res => console.log(res))
      .catch(err => console.warn(err));
  }

  onChangeFile = ({files}) => {
    const file = files[0];
    this.setState({
      file: file
    });
  }

  render() {
    return (
      <div>
        <input type="file" name="file" onChange={this.onChangeFile}/>
        <button onClick={this.uploadFile}>
            Upload 
        </button>
      </div>
    )
  }
};

export default DZUploader;