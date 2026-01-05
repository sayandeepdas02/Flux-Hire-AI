import React, { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ defaultCode = "", language = "cpp", onSubmit }) {
  const [code, setCode] = useState(defaultCode);

  return (
    <div className="p-4 bg-white rounded shadow">
      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={(val) => setCode(val)}
        theme="vs-dark"
      />
      <button
        onClick={() => onSubmit(code)}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
      >
        Run Code
      </button>
    </div>
  );
}
