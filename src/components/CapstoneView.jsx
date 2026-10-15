import React from "react";
import { 
  Layers, 
  Database, 
  FileText, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  ArrowRight,
  GitBranch,
  BarChart4,
  Server
} from "lucide-react";
import { MODULES_DATA } from "../data/curriculumData";

export default function CapstoneView({ onLoadIntoIdle }) {
  const capstoneData = MODULES_DATA.find((m) => m.id === 15) || MODULES_DATA[MODULES_DATA.length - 1];

  const phases = [
    {
      num: 1,
      title: "Python Foundation & Project Setup",
      focus: "Python Core, OOP, Generic Repository[T], .env, pytest",
      deliverable: "Project skeleton with src-layout, generic repository, and passing unit tests."
    },
    {
      num: 2,
      title: "REST API with FastAPI",
      focus: "Endpoints: /health, /ask, /report, /sales/summary, Pydantic, API-key security",
      deliverable: "Running FastAPI server with Swagger documentation (/docs) and Postman collection."
    },
    {
      num: 3,
      title: "LLM Integration & Prompt Design",
      focus: "NL-to-SQL prompt, KPI explainer, JSON output schema, Cloud vs Local Ollama comparison",
      deliverable: "Prompt library, configuration switch, and benchmark comparison table across 10 questions."
    },
    {
      num: 4,
      title: "Data Agent with LangChain",
      focus: "Tools: Read-only SQL query, calculator, FastAPI client, row limits, tool audit logging",
      deliverable: "Agent answering questions like 'Top 5 products by profit in North region' with SQL used."
    },
    {
      num: 5,
      title: "RAG with Azure AI Services",
      focus: "Ingesting policy PDFs, Azure AI Search (or Chroma fallback), citations, 'not found' safeguard",
      deliverable: "Grounded RAG chain integrated into the unified /ask endpoint."
    },
    {
      num: 6,
      title: "Multi-Agent Report Generation (LangGraph)",
      focus: "Supervisor pattern with Data Analyst, Document Researcher, Report Writer, and Human approval",
      deliverable: "Generated periodic sales insight report (Markdown/PDF) with data tables and cited sources."
    },
    {
      num: 7,
      title: "Testing, Evaluation & Final Demonstration",
      focus: "Golden dataset (30+ questions), measuring correctness, groundedness, latency, injection defense",
      deliverable: "Solution document with architecture diagram, test results, and 15-minute presentation."
    }
  ];

  const rubric = [
    { area: "Python code quality and project structure", weight: "15%" },
    { area: "REST API design and security", weight: "15%" },
    { area: "Prompt design and model comparison", weight: "10%" },
    { area: "Agent and tool implementation", weight: "15%" },
    { area: "RAG and Azure integration", weight: "15%" },
    { area: "LangGraph multi-agent workflow", weight: "15%" },
    { area: "Testing, evaluation and documentation", weight: "15%" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Capstone Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-blue-900/30 to-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Master Capstone Blueprint
              </span>
              <span className="text-xs text-slate-400 font-mono">
                BI V18 AI Launchpad Track
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI-Powered Sales Insights Assistant
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Uniting all 14 course modules into a unified enterprise solution: Relational Sales Database (50k+ rows), Policy Documents (KPIs, discount, returns), FastAPI REST APIs, LangChain Tools, Azure AI RAG, and LangGraph Multi-Agent Orchestration.
            </p>
          </div>

          <button
            onClick={() => onLoadIntoIdle(capstoneData.handsOnUseCase.solutionCode)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-xl shadow-cyan-400/20 active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Load Capstone Prototype in IDLE</span>
          </button>
        </div>
      </div>

      {/* Business Scenario & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>Business Scenario & Dataset</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            A retail enterprise stores sales data across Customers, Products, Orders, Order Items, Regions, and Returns (minimum 50,000 order rows). Business rules (KPI definitions, discount policies, returns window) live in PDF documents. Managers spend days requesting reports from the BI team.
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p><strong>Primary Database:</strong> SQLite / SQL Server (50,000+ orders)</p>
            <p><strong>Business Documents:</strong> 3-5 PDF policy files (KPI targets, discounts, returns)</p>
            <p><strong>Compliance:</strong> No personal or client data; synthetic enterprise records</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Server className="w-4 h-4" />
            <span>Architecture & Core Objectives</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Apply clean OOP, Generic Repository[T], and src-layout project standards.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Expose secured REST endpoints with FastAPI, Pydantic, and API-key headers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Implement safe Read-Only SQL Agents with regex guardrails and row limits.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Orchestrate LangGraph multi-agent team with Human-in-the-Loop signoff.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 7 Milestone Phases */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-400" />
          The 7 Execution Milestone Phases
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase) => (
            <div key={phase.num} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                    Phase {phase.num}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Milestone</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  {phase.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {phase.focus}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Deliverable:</p>
                <p className="text-xs text-cyan-300 font-medium mt-0.5">
                  {phase.deliverable}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Evaluation Rubric */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-white font-extrabold text-base">
          <BarChart4 className="w-5 h-5 text-amber-400" />
          <h3>Fortune 500 Evaluation Criteria & Weightage Breakdown (Total 100%)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {rubric.map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-2xl font-black text-amber-400">{item.weight}</span>
              <p className="text-xs font-semibold text-slate-300 mt-1">{item.area}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
