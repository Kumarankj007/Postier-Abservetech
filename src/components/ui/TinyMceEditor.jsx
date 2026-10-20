import React, { useState,useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMce = ({changeInVal,value}) => {

  const editorRef = useRef(null);

  const [tinyValue,setTinyValue] = useState("Welcome to TinyMCE!")
  
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const handleChangeInTiny =(newContent )=>{
    changeInVal(newContent)
  }
  return (
    <Editor
      apiKey='p3z1wm1afwqfuj3vljvino0vcf64fjs11dt9nn9ti4qe3q0e'
      onEditorChange={handleChangeInTiny}
      init={{
        plugins: 'ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      }}
    // defaultValue={value}
    value={value}
      
    />
  );
}
export default TinyMce;
