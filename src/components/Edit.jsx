import { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const Edit = ({ getcontent, content }) => {
  const [editorState, seteditorState] = useState('');
  useEffect(() => {
    const html = content;
    if (html === undefined) return;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks,
      );
      seteditorState(EditorState.createWithContent(contentState));
    }
  }, [content]);
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={(editorState) => {
        seteditorState(editorState);
      }}
      onBlur={() => {
        getcontent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      }}
    />
  );
};
export default Edit;
