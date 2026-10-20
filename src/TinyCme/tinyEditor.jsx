// import React, { useState } from 'react';
// import { Editor } from '@tinymce/tinymce-react';

// export default function TinyCmeEditor({ value, changeInVal }) {
//   console.log("envvvv", import.meta.env.VITE_API_URL)

//   return (
//     <Editor
//       tinymceScriptSrc={`${import.meta.env.VITE_PUBLIC_URL}tinymce/tinymce.min.js`}
//       value={value}
//       init={{
//         promotion: false,
//         convert_urls: false,
//         relative_urls: false,
//         // plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
//         plugins: 'anchor autolink codesample emoticons image link lists media table searchreplace code',
//         // toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',

//       }}
//       onEditorChange={changeInVal}
//     />
//   );
// }

import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyCmeEditor({ value, changeInVal }) {
  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js" // Use relative path from /public
      value={value}
      onEditorChange={changeInVal}
      init={{
        height: 500,
        promotion: false,
        convert_urls: false,
        relative_urls: false,
        plugins:
          "anchor autolink codesample emoticons image link lists media table searchreplace code",
        toolbar:
          "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | code",
        skin_url: "/tinymce/skins/ui/oxide",
        content_css: "/tinymce/skins/content/default/content.css",
      }}
    />
  );
}
