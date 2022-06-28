import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { compile } from "@casheeeewnuts/typed-mustache-compiler";

function App() {
  const [template, setTemplate] = useState("Hello! {{name}}");

  return (
    <div>
      <header className="h-1 bg-red-600">
        <div>typed-mustache</div>
      </header>
      <div className="h-screen">
        <div className="h-1/2">
          <Editor
            height="100%"
            defaultLanguage="mustache"
            value={template}
            onChange={(v) => setTemplate(v ?? "")}
            theme="vs-dark"
          />
        </div>
        <div className="h-1/2">
          <Transpiled template={template} />
        </div>
      </div>
    </div>
  );
}

const Transpiled: React.FC<{ template: string }> = ({ template }) => {
  const compileCache = useRef("");
  try {
    compileCache.current = compile(template, "TemplateValues");
  } catch (e) {}

  return (
    <Editor
      height="100%"
      theme="light"
      defaultLanguage="typescript"
      value={compileCache.current}
    />
  );
};

export default App;
