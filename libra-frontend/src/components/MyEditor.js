import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


class EditorConvertToHTML extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
        <textarea style={{display:'none'}}
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
      </div>
    );
  }
}

export default EditorConvertToHTML;