import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { compile } from "@casheeeewnuts/typed-mustache-compiler/dist/es6";
import { MarkGithubIcon } from "@primer/octicons-react";

function App() {
  const [template, setTemplate] = useState("Hello! {{name}}");

  return (
    <>
      <header className="h-12 bg-[#3c3c3c]">
        <div className="h-full grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <div className="p-2 pl-8">
              <p className="text-white font-black text-lg">
                <b>typed-mustache</b>
              </p>
            </div>
          </div>
          <div className="flex flex-row-reverse">
            <div className="p-2 mr-3">
              <a
                href="https://github.com/CasheeeewNuts/typed-mustache"
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                <MarkGithubIcon size="medium" fill="white" />
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className="h-screen dir-h">
        <div>
          <Editor
            height="100%"
            defaultLanguage="mustache"
            value={template}
            onChange={(v) => setTemplate(v ?? "")}
            theme="vs-dark"
          />
        </div>
        <div>
          <Transpiled template={template} />
        </div>
      </div>
    </>
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
      theme="vs-dark"
      defaultLanguage="typescript"
      value={compileCache.current}
    />
  );
};

export default App;
