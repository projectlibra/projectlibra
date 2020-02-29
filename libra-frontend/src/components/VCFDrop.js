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


// export default function VCFDrop (){
//     const [selectedFile, setSelectedFile] = React.useState()
//     const [preview, setPreview] = React.useState()

//     // create a preview as a side effect, whenever selected file is changed
//     React.useEffect(() => {
//         if (!selectedFile) {
//             setPreview(undefined)
//             return
//         }

//         const objectUrl = URL.createObjectURL(selectedFile)
//         setPreview(objectUrl)
//         console.log(objectUrl)

//         // free memory when ever this component is unmounted
//         // return () => URL.revokeObjectURL(objectUrl)
//     }, [selectedFile])


//     const onSelectFile = event => {
//         if (!event.target.files || event.target.files.length === 0) {
//             setSelectedFile(undefined)
//             return
//         }

//         // I've kept this example simple by using the first image instead of multiple
//         setSelectedFile(event.target.files[0])

//         // console.log(event.target)
//     }

//     // return (
//     //     <div>
//     //         // <DropzoneArea
//     //       // dropzoneText="Upload your VCF file(s)" acceptedFiles={[".vcf"]} showPreviewsInDropzone={true} showPreviews={false} showAlerts={true} useChipsForPreview={true} onChange={onSelectFile} />
//     //       <input type="file" onChange={onSelectFile} />
//     //       {selectedFile &&  <img src={preview} /> }
//     //     </div>
//     // )
//     return (
//         <div>
//             <input type='file' onChange={onSelectFile} />
//             {selectedFile &&  <img src={preview} /> }
//         </div>
//     )
// }