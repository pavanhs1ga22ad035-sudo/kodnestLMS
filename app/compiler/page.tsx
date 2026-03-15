'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type LangOption = 'python' | 'java';

const starterCode: Record<LangOption, string> = {
  python: `# Python 3\nprint('Hello from KodNest Compiler')\n`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello from KodNest Compiler\");\n  }\n}\n`,
};

const monacoLanguage: Record<LangOption, string> = {
  python: 'python',
  java: 'java',
};

export default function CompilerPage() {
  const [language, setLanguage] = useState<LangOption>('python');
  const [code, setCode] = useState(starterCode.python);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('Ready. Click "Run Code" to execute.');
  const [running, setRunning] = useState(false);

  const editorLang = useMemo(() => monacoLanguage[language], [language]);

  async function runCode() {
    setRunning(true);
    setOutput('Running...');
    try {
      const res = await fetch('/api/compiler/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, stdin }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || 'Execution failed');
      }

      const terminal = [
        json?.data?.stdout ? `STDOUT:\n${json.data.stdout}` : '',
        json?.data?.stderr ? `STDERR:\n${json.data.stderr}` : '',
        json?.data?.compileOutput ? `COMPILE:\n${json.data.compileOutput}` : '',
        json?.data?.message ? `INFO:\n${json.data.message}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      setOutput(terminal || 'Execution completed with no output.');
    } catch (error) {
      setOutput(error instanceof Error ? error.message : 'Unexpected execution error');
    } finally {
      setRunning(false);
    }
  }

  function onLanguageChange(nextLanguage: LangOption) {
    setLanguage(nextLanguage);
    setCode(starterCode[nextLanguage]);
    setOutput('Language changed. Click "Run Code" to execute.');
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-black">KodNest Code Compiler</h1>
          <p className="text-sm text-gray-600">Practice coding with instant output.</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="language" className="text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as LangOption)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black shadow-sm focus:border-yellow-400 focus:outline-none"
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            type="button"
            onClick={runCode}
            disabled={running}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {running ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-10">
        <section className="lg:col-span-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
            Editor
          </div>
          <MonacoEditor
            height="600px"
            language={editorLang}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </section>

        <section className="lg:col-span-4 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
            Output Terminal
          </div>

          <div className="border-b border-gray-200 p-3">
            <label htmlFor="stdin" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              Standard Input (optional)
            </label>
            <textarea
              id="stdin"
              value={stdin}
              onChange={(event) => setStdin(event.target.value)}
              rows={4}
              placeholder="Provide stdin input..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <pre className="h-[480px] flex-1 overflow-auto bg-black p-4 text-sm leading-6 text-green-300">{output}</pre>
        </section>
      </div>
    </div>
  );
}
