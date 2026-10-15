import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Terminal as TerminalIcon, 
  Sparkles, 
  Code, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { executePythonCode, executeReplCommand } from "../utils/pythonRunner";
import { MODULES_DATA } from "../data/curriculumData";
import { playSuccessChime } from "../utils/soundEffects";

const STARTER_CODE = `# Enterprise Python 3.12 IDLE Studio
# AI Launchpad Track • BI V18 (Power BI)

def calculate_enterprise_roi(model_name: str, queries_per_day: int, manual_minutes_per_query: float) -> dict:
    """Calculates hours and monetary value saved via AI Agent automation."""
    hourly_rate_usd = 85.0
    daily_hours_saved = (queries_per_day * manual_minutes_per_query) / 60.0
    daily_savings_usd = daily_hours_saved * hourly_rate_usd
    annual_savings = daily_savings_usd * 250  # 250 business days

    return {
        "model": model_name,
        "daily_hours_saved": round(daily_hours_saved, 1),
        "annual_cost_savings": f"\${annual_savings:,.2f} USD"
    }

# Execute enterprise simulation
roi = calculate_enterprise_roi("Azure OpenAI GPT-4o & LangGraph Agents", queries_per_day=450, manual_minutes_per_query=12.0)
print(f"=== ROI Assessment for [{roi['model']}] ===")
print(f"Daily Hours Saved: {roi['daily_hours_saved']} hrs")
print(f"Projected Annual Enterprise Value: {roi['annual_cost_savings']}")
`;

export default function IntegratedIdle({ initialCode, onCodeExecuted }) {
  const [code, setCode] = useState(initialCode || STARTER_CODE);
  const [output, setOutput] = useState("");
  const [errorOutput, setErrorOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionStats, setExecutionStats] = useState(null);
  const [copied, setCopied] = useState(false);
  const [replInput, setReplInput] = useState("");
  const [replHistory, setReplHistory] = useState([
    "Python 3.12.2 (tags/v3.12.2:5acc4f6) [WebAssembly / Native AI IDLE Engine]",
    "Type 'help', 'copyright', 'credits' or 'license' for more information.",
    ">>> print('Welcome to AI Launchpad IDLE Studio!')",
    "Welcome to AI Launchpad IDLE Studio!"
  ]);
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'repl'

  const replEndRef = useRef(null);

  // Update editor if initialCode changes externally (e.g. from Curriculum "Run in IDLE" button)
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      setActiveTab("editor");
    }
  }, [initialCode]);

  useEffect(() => {
    if (activeTab === "repl" && replEndRef.current) {
      replEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [replHistory, activeTab]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setErrorOutput("");
    setOutput("Executing in Python WebAssembly runtime...");

    try {
      const result = await executePythonCode(code);
      if (result.success) {
        setOutput(result.stdout || "[Program finished with no standard output]");
        setErrorOutput("");
      } else {
        setOutput("");
        setErrorOutput(result.stderr || "Runtime error encountered.");
      }

      setExecutionStats({
        durationMs: result.executionTimeMs,
        engine: result.engine,
        lines: code.split("\n").length
      });

      if (onCodeExecuted) {
        onCodeExecuted();
      }
      playSuccessChime();
    } catch (err) {
      setErrorOutput(String(err));
    } finally {
      setIsRunning(false);
    }
  };

  const handleReplSubmit = (e) => {
    e.preventDefault();
    if (!replInput.trim()) return;

    const command = replInput.trim();
    const result = executeReplCommand(command);

    setReplHistory((prev) => [
      ...prev,
      `>>> ${command}`,
      result
    ]);
    setReplInput("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enterprise_ai_script.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadLab = (moduleId) => {
    const mod = MODULES_DATA.find((m) => m.id === parseInt(moduleId));
    if (mod && mod.handsOnUseCase) {
      setCode(mod.handsOnUseCase.solutionCode);
      setOutput(`Loaded Day ${mod.id} Solved Solution: ${mod.handsOnUseCase.title}.\nClick 'Run Code' or press Ctrl+Enter to execute.`);
      setErrorOutput("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / IDLE Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5" />
              Integrated IDLE Studio
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Python 3.12 • Pyodide WebAssembly
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Enterprise Code Runner & REPL Shell
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Execute real Python code client-side with zero setup. Load any of the 14 hands-on lab solutions, test functions, run algorithmic patterns, and inspect outputs.
          </p>
        </div>

        {/* Quick Solved Labs Dropdown */}
        <div className="w-full md:w-auto bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Load Solved Module Solution:
          </label>
          <select
            onChange={(e) => e.target.value && handleLoadLab(e.target.value)}
            className="w-full md:w-64 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="">Select a Solved Lab...</option>
            {MODULES_DATA.map((m) => (
              <option key={m.id} value={m.id}>
                {m.day}: {m.title.slice(0, 26)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Studio Toolbar */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "editor"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Editor Mode</span>
            </button>
            <button
              onClick={() => setActiveTab("repl")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "repl"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Interactive REPL</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCode(STARTER_CODE)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setOutput("");
                setErrorOutput("");
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              title="Clear Output"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              title="Download Script"
            >
              <Download className="w-4 h-4" />
            </button>

            {activeTab === "editor" && (
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Editor + Console Split Pane */}
        {activeTab === "editor" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Left Pane: Code Editor */}
            <div className="lg:col-span-7 bg-slate-950 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 font-mono text-xs flex flex-col">
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 mb-2 border-b border-slate-900">
                <span>main.py (Editable)</span>
                <span>UTF-8</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleRunCode();
                  }
                }}
                spellCheck="false"
                className="w-full flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed font-mono min-h-[350px]"
                placeholder="# Enter or paste Python code here..."
              />
              <p className="text-[10px] text-slate-600 pt-2 border-t border-slate-900">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Ctrl + Enter</kbd> to run
              </p>
            </div>

            {/* Right Pane: Output Console */}
            <div className="lg:col-span-5 bg-slate-900/90 p-4 flex flex-col font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] pb-2 mb-2 border-b border-slate-800">
                <span className="font-bold uppercase tracking-wider text-slate-400">
                  Execution Output
                </span>
                {executionStats && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Success ({executionStats.durationMs}ms)
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto max-h-[420px] rounded-xl bg-slate-950 p-4 border border-slate-800/80">
                {isRunning ? (
                  <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Executing Python bytecode in WebAssembly...</span>
                  </div>
                ) : errorOutput ? (
                  <div className="space-y-1 text-rose-400">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Traceback (most recent call last):
                    </div>
                    <pre className="text-rose-300 text-xs whitespace-pre-wrap">{errorOutput}</pre>
                  </div>
                ) : output ? (
                  <pre className="text-emerald-300 text-xs whitespace-pre-wrap leading-relaxed">
                    {output}
                  </pre>
                ) : (
                  <p className="text-slate-600 italic">
                    Output will appear here after clicking 'Run Code'...
                  </p>
                )}
              </div>

              {/* Execution Engine Telemetry */}
              {executionStats && (
                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    {executionStats.engine}
                  </span>
                  <span>{executionStats.lines} lines executed</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Tab 2: Interactive REPL Console */
          <div className="bg-slate-950 p-6 font-mono text-xs min-h-[450px] flex flex-col justify-between">
            <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2">
              {replHistory.map((line, idx) => (
                <div 
                  key={idx}
                  className={`${
                    line.startsWith(">>>") 
                      ? "text-cyan-400 font-bold" 
                      : line.startsWith("Welcome") || line.startsWith("Python")
                      ? "text-slate-400"
                      : "text-emerald-300"
                  }`}
                >
                  {line}
                </div>
              ))}
              <div ref={replEndRef} />
            </div>

            {/* REPL Input Form */}
            <form onSubmit={handleReplSubmit} className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
              <span className="text-cyan-400 font-bold select-none">&gt;&gt;&gt;</span>
              <input
                type="text"
                value={replInput}
                onChange={(e) => setReplInput(e.target.value)}
                placeholder="Type expression e.g. 250 * 85 or len('LangGraph') or help('modules')"
                className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
