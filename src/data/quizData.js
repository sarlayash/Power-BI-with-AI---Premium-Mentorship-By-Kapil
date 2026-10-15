// Comprehensive Question Bank for Mock Tests, Daily Spinning Wheel Challenges, and Fortune 500 Badges

export const MOCK_TEST_QUESTIONS = [
  // Module 1: Python Basics & Control Flow
  {
    id: 1,
    moduleId: 1,
    category: "Python Basics",
    question: "In Python, which statement about strings and slicing `s = 'LangChain'[-5:]` is TRUE?",
    options: [
      "It raises IndexError because negative indexing is invalid in slices",
      "It returns 'Chain' by slicing backwards 5 characters to the end",
      "It returns 'LangC'",
      "It reverses the string and returns 'niahC'"
    ],
    correctIndex: 1,
    explanation: "Negative indexing counts from the end of the string. 'LangChain' has 9 characters; index -5 points to 'C' at index 4. Thus `[-5:]` slices from index 4 to the end, producing 'Chain'."
  },
  {
    id: 2,
    moduleId: 1,
    category: "Python Basics",
    question: "When does the `else` block of a `for` loop in Python execute?",
    options: [
      "Every time the loop finishes an iteration",
      "Only if the loop terminates via an explicit `break` statement",
      "Only if the loop completes all iterations without encountering a `break` statement",
      "Only if an unhandled exception is thrown inside the loop"
    ],
    correctIndex: 2,
    explanation: "Python's `for...else` construct executes the `else` block ONLY when the loop completes naturally without being broken by a `break` statement. This is ideal for prime checking or search loops."
  },

  // Module 2: Data Structures & Exception Handling
  {
    id: 3,
    moduleId: 2,
    category: "Data Structures",
    question: "Which of the following operations on standard Python dictionaries has average-case O(1) time complexity?",
    options: [
      "Retrieving a value using its key: `val = d.get(key)`",
      "Sorting all keys alphabetically: `sorted(d.keys())`",
      "Finding the maximum value across all values: `max(d.values())`",
      "Finding all keys with a matching substring: `[k for k in d if 'ai' in k]`"
    ],
    correctIndex: 0,
    explanation: "Python dictionaries use hash tables under the hood. Key lookup, insertion, and deletion have an average time complexity of O(1)."
  },
  {
    id: 4,
    moduleId: 2,
    category: "Exception Handling",
    question: "In an enterprise Python service, why is catching a bare `except:` considered a dangerous anti-pattern?",
    options: [
      "It consumes double memory on the Python heap",
      "It catches `SystemExit`, `KeyboardInterrupt`, and masking syntax errors, preventing clean shutdowns and hiding critical bugs",
      "It is deprecated in Python 3 and will fail to compile",
      "It converts runtime errors into silent warning logs"
    ],
    correctIndex: 1,
    explanation: "A bare `except:` catches `BaseException`, which includes `KeyboardInterrupt` (Ctrl+C) and `SystemExit`. It traps fatal signals and masks bugs. Always catch `Exception` or domain-specific exceptions."
  },

  // Module 3: Functions, OOPS & Generics
  {
    id: 5,
    moduleId: 3,
    category: "OOP & Generics",
    question: "What is the primary architectural purpose of using `@classmethod` as an alternative constructor in Python?",
    options: [
      "To prevent any subclass from overriding the method",
      "To automatically run the method asynchronously on a background thread",
      "To receive `cls` as the first argument, allowing creation of class instances from different formats (e.g. `from_dict`, `from_json`)",
      "To restrict method invocation strictly to private class instances"
    ],
    correctIndex: 2,
    explanation: "`@classmethod` takes the class object (`cls`) rather than instance (`self`) as its first parameter, making it the standard factory method pattern in Python (e.g. `LLMConfig.create_deterministic(...)`)."
  },
  {
    id: 6,
    moduleId: 3,
    category: "OOP & Generics",
    question: "In Python typing, what does `TypeVar('T')` combined with `Generic[T]` allow you to achieve?",
    options: [
      "Dynamic monkey-patching of methods at runtime",
      "Type-safe classes and containers that can work over arbitrary types while retaining static type checking via mypy/Pylance",
      "Automatic conversion of Python functions into C extensions",
      "Automatic multi-core parallelism of class methods"
    ],
    correctIndex: 1,
    explanation: "`Generic[T]` enables parameterized generic types (like `Repository[T]` or `Stack[T]`), guaranteeing static type safety across disparate entities."
  },

  // Module 4: Files, Modules & Python Project Structure
  {
    id: 7,
    moduleId: 4,
    category: "Software Engineering",
    question: "Why should enterprise API keys and database credentials NEVER be committed to Git repositories?",
    options: [
      "Git repositories have a 50MB file size restriction",
      "Committed secrets persist permanently in Git commit history and can be scraped by public/leaked repository scanners, risking massive security breaches",
      "Python cannot read string variables from committed files",
      "FastAPI rejects environment variables that originate from Git repositories"
    ],
    correctIndex: 1,
    explanation: "Git history is immutable. Once a credential is committed, it exists in historical git trees even if deleted in future commits. Secrets must be stored in `.env` or cloud secret managers (Azure Key Vault)."
  },
  {
    id: 8,
    moduleId: 4,
    category: "Software Engineering",
    question: "Which Python standard library module is recommended for cross-platform, object-oriented filesystem path manipulation?",
    options: [
      "`os.system`",
      "`pathlib.Path`",
      "`sys.modules`",
      "`shutil.archiver`"
    ],
    correctIndex: 1,
    explanation: "`pathlib.Path` (PEP 428) is the modern object-oriented standard, automatically handling forward and backward slash discrepancies across Windows and Linux."
  },

  // Module 5: REST API Development with FastAPI
  {
    id: 9,
    moduleId: 5,
    category: "FastAPI & APIs",
    question: "How does FastAPI achieve automatic OpenAPI / Swagger UI generation and strict request body validation?",
    options: [
      "By executing JavaScript scripts inside the Python interpreter",
      "By leveraging Python type hints and Pydantic models to inspect function signatures at startup",
      "By querying an external Microsoft Azure documentation server",
      "By scanning the local filesystem for markdown README files"
    ],
    correctIndex: 1,
    explanation: "FastAPI inspects route function type annotations and Pydantic models to construct the OpenAPI JSON schema specification, which renders Swagger UI at `/docs`."
  },
  {
    id: 10,
    moduleId: 5,
    category: "FastAPI & APIs",
    question: "Which HTTP status code should be returned when an enterprise endpoint rejects a request due to a missing or invalid API key?",
    options: [
      "200 OK",
      "301 Moved Permanently",
      "401 Unauthorized or 403 Forbidden",
      "502 Bad Gateway"
    ],
    correctIndex: 2,
    explanation: "HTTP 401 Unauthorized denotes missing or invalid credentials, while 403 Forbidden denotes valid credentials that lack sufficient permissions."
  },

  // Module 6: Generative AI Fundamentals
  {
    id: 11,
    moduleId: 6,
    category: "Generative AI",
    question: "When configuring inference for an LLM that generates deterministic SQL queries, what temperature value should be set?",
    options: [
      "1.5 (High creativity and variation)",
      "0.0 (Deterministic, selecting the highest probability token at every step)",
      "0.8 (Creative storytelling balance)",
      "-1.0 (Inverted probability)"
    ],
    correctIndex: 1,
    explanation: "A temperature of 0.0 eliminates random sampling, making the model greedy and deterministic. This minimizes hallucinations when generating code, SQL, or structured JSON."
  },
  {
    id: 12,
    moduleId: 6,
    category: "Generative AI",
    question: "What is an embedding in modern Large Language Models?",
    options: [
      "A compressed ZIP archive of Python source code",
      "A high-dimensional vector of floating-point numbers where semantic similarity corresponds to geometric proximity",
      "A hardware GPU chip manufactured by NVIDIA",
      "A specialized database password hash"
    ],
    correctIndex: 1,
    explanation: "Embeddings represent words, sentences, or documents as dense vectors in high-dimensional space (e.g. 1536 dimensions). Texts with similar meanings point in similar geometric directions."
  },

  // Module 7: Prompt Engineering
  {
    id: 13,
    moduleId: 7,
    category: "Prompt Engineering",
    question: "What is the key mechanism in Chain-of-Thought (CoT) prompting that improves reasoning accuracy on complex tasks?",
    options: [
      "It translates the prompt into binary bytecode before sending",
      "It instructs the model to generate intermediate reasoning steps before arriving at the final answer, allowing more compute tokens to be spent on deduction",
      "It encrypts the prompt with AES-256 to prevent eavesdropping",
      "It forces the model to ignore user inputs and follow system defaults"
    ],
    correctIndex: 1,
    explanation: "Chain-of-Thought prompts (e.g. 'Think step by step') prompt the model to generate its reasoning path token-by-token. Since LLM tokens are autoregressive, earlier reasoning tokens condition the final output."
  },
  {
    id: 14,
    moduleId: 7,
    category: "Prompt Engineering",
    question: "Which of the following is an effective guardrail against prompt injection attacks?",
    options: [
      "Enclosing untrusted user input within distinct XML delimiters (e.g. `<user_input>`) and instructing the model to treat the content solely as raw data",
      "Increasing the temperature setting to 1.8",
      "Removing all punctuation from the prompt",
      "Running the model without any system prompt"
    ],
    correctIndex: 0,
    explanation: "Delimiter encapsulation (XML tags or triple backticks) establishes a clear boundary between trusted system instructions and untrusted user data, preventing injection attacks."
  },

  // Module 8: Open-Source LLM Ecosystem
  {
    id: 15,
    moduleId: 8,
    category: "Open-Source LLMs",
    question: "What is the primary benefit of quantizing a 16-bit FP16 LLM down to 4-bit (GGUF or AWQ format)?",
    options: [
      "It increases the model parameters from 8B to 70B",
      "It reduces VRAM/RAM requirements by approximately 70-75% with minimal loss in reasoning quality, enabling execution on commodity hardware",
      "It translates the model weights into C++ header files",
      "It automatically disables all safety guardrails"
    ],
    correctIndex: 1,
    explanation: "4-bit quantization reduces memory per parameter from 2 bytes (16 bits) to 0.5 bytes (4 bits), allowing an 8B model to run comfortably on a laptop with 8GB RAM or 6GB VRAM."
  },
  {
    id: 16,
    moduleId: 8,
    category: "Open-Source LLMs",
    question: "Which open model family developed by Meta provides weights with a permissive commercial community license for up to 700 million monthly active users?",
    options: [
      "GPT-4",
      "Llama 3 (Meta)",
      "Claude 3.5 Sonnet",
      "Gemini 1.5 Pro"
    ],
    correctIndex: 1,
    explanation: "Meta's Llama 3 family is open-weight with a community license allowing commercial use for organizations under 700M monthly active users."
  },

  // Module 9: Running Open-Source LLMs
  {
    id: 17,
    moduleId: 9,
    category: "Running LLMs",
    question: "When running Ollama locally, how can Python applications using the official `openai` SDK connect to it?",
    options: [
      "By setting `base_url='http://localhost:11434/v1'` on the `OpenAI` client instance",
      "By editing the Windows registry system files",
      "By compiling Ollama into a static Python `.pyd` module",
      "Ollama cannot be connected via the OpenAI SDK"
    ],
    correctIndex: 0,
    explanation: "Ollama exposes an OpenAI-compatible REST API at `http://localhost:11434/v1`. Setting `base_url='http://localhost:11434/v1'` allows zero-code switching."
  },
  {
    id: 18,
    moduleId: 9,
    category: "Running LLMs",
    question: "What metric is calculated by `(A · B) / (||A|| * ||B||)` to compare two embedding vectors?",
    options: [
      "Levenshtein edit distance",
      "Cosine similarity (measuring angular alignment between vectors)",
      "Cross-entropy loss",
      "Hamming distance"
    ],
    correctIndex: 1,
    explanation: "Cosine similarity measures the cosine of the angle between two multi-dimensional vectors. A value of 1.0 means identical orientation (semantic match)."
  },

  // Module 10: LangChain Fundamentals
  {
    id: 19,
    moduleId: 10,
    category: "LangChain",
    question: "In LangChain Expression Language (LCEL), what does the pipe operator `|` represent?",
    options: [
      "Bitwise OR operation on integers",
      "Chaining Runnables together, passing the output of the left component as the input to the right component",
      "Multi-process Linux redirection",
      "A syntax error in modern Python"
    ],
    correctIndex: 1,
    explanation: "LCEL overloads Python's `__or__` operator to compose Runnables declaratively: `chain = prompt | model | parser`."
  },
  {
    id: 20,
    moduleId: 10,
    category: "LangChain",
    question: "Why is `RecursiveCharacterTextSplitter` preferred over simple character splitting in document ingestion pipelines?",
    options: [
      "It translates foreign languages during chunking",
      "It splits on natural paragraph, newline, and word boundaries recursively, preserving semantic coherence inside chunks",
      "It compresses chunks into encrypted zip archives",
      "It converts text into audio waveform frequencies"
    ],
    correctIndex: 1,
    explanation: "`RecursiveCharacterTextSplitter` attempts to split on `['\\n\\n', '\\n', ' ', '']` in order, keeping whole paragraphs and sentences intact."
  },

  // Module 11: LangChain Agents & Tools
  {
    id: 21,
    moduleId: 11,
    category: "Agents & Tools",
    question: "What are the core steps of the ReAct (Reasoning and Acting) loop in AI agents?",
    options: [
      "Compile -> Run -> Error -> Restart",
      "Thought (Reasoning) -> Action (Pick Tool) -> Action Input -> Observation (Tool Output) -> Repeat until Final Answer",
      "Ingest -> Chunk -> Embed -> Store",
      "Train -> Validate -> Test -> Deploy"
    ],
    correctIndex: 1,
    explanation: "ReAct combines reasoning ('Thought') with action ('Action' + 'Action Input'). The environment returns an 'Observation' which the agent reads to decide the next step."
  },
  {
    id: 22,
    moduleId: 11,
    category: "Agents & Tools",
    question: "What enterprise safety measure should ALWAYS be applied when deploying an agent with database query tools?",
    options: [
      "Grant the agent `DB_OWNER` or `SUPERUSER` privileges",
      "Connect the agent via a read-only database user account, enforce query row limits (e.g. LIMIT 100), and block DDL/DML keywords",
      "Store database passwords in plaintext in the system prompt",
      "Disable all logging to improve query latency"
    ],
    correctIndex: 1,
    explanation: "Defense-in-depth: A read-only user ensures data cannot be modified or dropped, while regex validation and row limits prevent denial-of-service and accidental data exfiltration."
  },

  // Module 12: Agentic AI Workflows & Testing
  {
    id: 23,
    moduleId: 12,
    category: "Agentic Workflows",
    question: "In the Evaluator-Optimizer agentic pattern, what role does the Evaluator node play?",
    options: [
      "It calculates billing costs for GPU usage",
      "It critiques the Generator's candidate output against criteria and returns feedback/approval, driving iterative self-correction",
      "It compiles Python bytecode into machine assembly",
      "It shuts down the web server if latency exceeds 2 seconds"
    ],
    correctIndex: 1,
    explanation: "The Evaluator-Optimizer pattern features a Generator drafting content and an Evaluator providing specific critique until the output meets quality standards."
  },
  {
    id: 24,
    moduleId: 12,
    category: "Agentic Workflows",
    question: "What is 'Faithfulness' in LLM evaluation frameworks like Ragas?",
    options: [
      "The probability that the user likes the tone of the chatbot",
      "The degree to which the generated answer can be mathematically grounded and deduced strictly from the retrieved context without hallucination",
      "The duration of uptime for the cloud server",
      "The speed at which tokens are rendered on the screen"
    ],
    correctIndex: 1,
    explanation: "Faithfulness measures factual alignment: every statement in the answer must be supported by the retrieved context."
  },

  // Module 13: LangGraph & Multi-Agent Systems
  {
    id: 25,
    moduleId: 13,
    category: "LangGraph",
    question: "How does LangGraph differ fundamentally from classic LangChain linear chains?",
    options: [
      "LangGraph only works with JavaScript, not Python",
      "LangGraph enables cyclical execution graphs with loops, retry states, checkpoints, and multi-agent coordination, whereas linear chains are acyclic",
      "LangGraph requires physical quantum computers to compile",
      "LangGraph does not support prompt templates or LLMs"
    ],
    correctIndex: 1,
    explanation: "LangGraph models computation as a state graph supporting cycles, conditional branches, persistence (checkpointers), and human approval interrupts."
  },
  {
    id: 26,
    moduleId: 13,
    category: "LangGraph",
    question: "In LangGraph, what is the role of a Checkpointer (e.g., `MemorySaver`)?",
    options: [
      "It compresses git commits before pushing to GitHub",
      "It saves state after every node transition, enabling multi-turn conversations, state restoration, and time-travel debugging",
      "It prevents users from closing their web browser",
      "It automatically pays cloud subscription invoices"
    ],
    correctIndex: 1,
    explanation: "Checkpointers persist the full graph state at every step. This makes workflows resilient, thread-aware, and allows pausing for human-in-the-loop approvals."
  },

  // Module 14: RAG & Azure AI Services
  {
    id: 27,
    moduleId: 14,
    category: "Azure AI & RAG",
    question: "In an enterprise RAG pipeline, why is Hybrid Search (BM25 + Vector) superior to pure vector search alone?",
    options: [
      "It requires zero memory and runs with negative latency",
      "It combines dense semantic understanding for conceptual matches with exact keyword matching for specific product SKUs, IDs, and acronyms",
      "It eliminates the need for an embedding model",
      "It prevents users from submitting queries"
    ],
    correctIndex: 1,
    explanation: "Vector search excels at broad semantic meaning ('refund rules'), but can fail on exact part numbers or error codes (e.g. 'ERR-9481'). Hybrid search blends both strengths."
  },
  {
    id: 28,
    moduleId: 14,
    category: "Azure AI & RAG",
    question: "Which Azure AI service provides pre-trained models to extract text, tables, key-value pairs, and structure from invoices and PDF documents?",
    options: [
      "Azure Virtual Machines",
      "Azure AI Document Intelligence (formerly Form Recognizer)",
      "Azure DNS Zone",
      "Azure Blob Storage Lifecycle"
    ],
    correctIndex: 1,
    explanation: "Azure AI Document Intelligence uses advanced machine learning to parse structured forms, invoices, receipts, and complex PDF tables."
  },

  // Capstone Project Integration
  {
    id: 29,
    moduleId: 15,
    category: "Capstone Architecture",
    question: "In the AI-Powered Sales Insights Assistant Capstone, what is the function of the Router component in the `/ask` endpoint?",
    options: [
      "It assigns IP addresses to connected Wi-Fi routers",
      "It classifies incoming business queries to direct data questions to the SQL Agent, policy questions to the Azure RAG chain, and report requests to LangGraph",
      "It converts SQLite files into Microsoft Excel spreadsheets",
      "It shuts down the server when CPU utilization reaches 50%"
    ],
    correctIndex: 1,
    explanation: "The router intelligently directs queries: numeric/sales queries go to the SQL Agent; company policy/returns questions go to Azure RAG; comprehensive synthesis requests go to the LangGraph Multi-Agent team."
  },
  {
    id: 30,
    moduleId: 15,
    category: "Capstone Architecture",
    question: "According to the Capstone evaluation rubric, what total weight is allocated to Python Code Quality & REST API Design combined?",
    options: [
      "10%",
      "30% (15% Python code quality + 15% REST API design and security)",
      "75%",
      "5%"
    ],
    correctIndex: 1,
    explanation: "Evaluation Criteria allocates: Python code quality and project structure (15%) + REST API design and security (15%) = 30% combined."
  }
];

// Daily Spinning Wheel Slices & Challenges
export const WHEEL_SLICES = [
  {
    id: "slice-1",
    label: "Python Core",
    icon: "🐍",
    color: "#3b82f6",
    xp: 50,
    category: "Python Basics & Control Flow",
    question: "What built-in function returns an iterator of tuples containing the index and value?",
    options: ["enumerate()", "zip()", "range()", "iter()"],
    correctIndex: 0,
    explanation: "`enumerate()` pairs each item with an auto-incrementing index starting from 0 (or specified start)."
  },
  {
    id: "slice-2",
    label: "Agentic ReAct",
    icon: "🤖",
    color: "#8b5cf6",
    xp: 80,
    category: "LangChain Agents & Tools",
    question: "What does the 'Obs' step in a ReAct loop represent?",
    options: ["Observation (Output returned from executing a tool)", "Obstruction in network traffic", "Obsolete model weights", "Objective loss metric"],
    correctIndex: 0,
    explanation: "Observation is the feedback or data returned from executing a tool, which the agent inspects to formulate the next Thought."
  },
  {
    id: "slice-3",
    label: "FastAPI Sprint",
    icon: "⚡",
    color: "#06b6d4",
    xp: 60,
    category: "FastAPI Development",
    question: "Which class from Pydantic is used to create strongly-typed request body schemas in FastAPI?",
    options: ["BaseModel", "DataClass", "DictSchema", "FastValidator"],
    correctIndex: 0,
    explanation: "`pydantic.BaseModel` provides data parsing, type coercion, and validation rules for HTTP bodies."
  },
  {
    id: "slice-4",
    label: "Prompt Magic",
    icon: "🧠",
    color: "#ec4899",
    xp: 75,
    category: "Prompt Engineering",
    question: "Providing 2-3 input/output demonstrations inside the prompt is known as:",
    options: ["Few-Shot Prompting", "Zero-Shot Prompting", "Temperature Tuning", "Vectorization"],
    correctIndex: 0,
    explanation: "Few-shot prompting conditions the LLM with concrete input-output examples before the target query."
  },
  {
    id: "slice-5",
    label: "Azure Cloud RAG",
    icon: "☁️",
    color: "#10b981",
    xp: 100,
    category: "RAG & Azure AI",
    question: "Which vector index algorithm in Azure AI Search provides high-speed approximate nearest neighbor retrieval?",
    options: ["HNSW (Hierarchical Navigable Small World)", "B-Tree Index", "Bubble Search", "Merge Sort Graph"],
    correctIndex: 0,
    explanation: "HNSW is the industry standard vector indexing algorithm for sub-millisecond similarity search across millions of embeddings."
  },
  {
    id: "slice-6",
    label: "LangGraph Grid",
    icon: "🕸️",
    color: "#f59e0b",
    xp: 90,
    category: "LangGraph Multi-Agent",
    question: "In LangGraph, what special nodes represent the entry and exit points of execution?",
    options: ["START and END", "INIT and EXIT", "HEAD and TAIL", "IN and OUT"],
    correctIndex: 0,
    explanation: "LangGraph uses `START` to denote the graph's entry point and `END` to signify workflow termination."
  },
  {
    id: "slice-7",
    label: "Open-Source Ollama",
    icon: "🦙",
    color: "#6366f1",
    xp: 70,
    category: "Running Open-Source LLMs",
    question: "What default localhost port does the Ollama REST API listen on?",
    options: ["11434", "8000", "5000", "3000"],
    correctIndex: 0,
    explanation: "Ollama's default HTTP service listens on port 11434 (`http://localhost:11434`)."
  },
  {
    id: "slice-8",
    label: "💎 Mega Fortune",
    icon: "💎",
    color: "#eab308",
    xp: 150,
    category: "Fortune 500 Architect Brainteaser",
    question: "In enterprise agentic systems, why is a Human-in-the-Loop (HITL) gate critical before report publication or database modification?",
    options: [
      "To ensure corporate compliance, auditability, and prevent unauthorized actions before high-impact changes occur",
      "Because Python scripts cannot complete without mouse clicks",
      "To artificially increase cloud billing quotas",
      "To allow the server to recharge its internal battery"
    ],
    correctIndex: 0,
    explanation: "HITL gates prevent unverified agent actions from impacting enterprise systems or publishing unreviewed compliance materials."
  }
];

// Prestigious Fortune 500 Badges
export const FORTUNE_500_BADGES = [
  {
    id: "badge-python-vanguard",
    title: "Python Foundation Vanguard",
    tier: "Foundation",
    icon: "🎓",
    color: "from-blue-500 to-indigo-600",
    description: "Mastered Python core control flow, collections, OOP architectures, and project structures (Days 1–4).",
    criteria: "Complete Modules 1-4 and execute at least 3 scripts in IDLE",
    xpAward: 250,
    unlocked: false
  },
  {
    id: "badge-fastapi-architect",
    title: "FastAPI Microservice Architect",
    tier: "Microservices",
    icon: "⚡",
    color: "from-cyan-500 to-blue-600",
    description: "Designed secured, documented REST APIs with Pydantic validation, SQLite persistence, and API-key protection.",
    criteria: "Complete Module 5 & achieve 100% on API security quiz",
    xpAward: 300,
    unlocked: false
  },
  {
    id: "badge-genai-pioneer",
    title: "GenAI & Prompt Pioneer",
    tier: "AI Core",
    icon: "🧠",
    color: "from-pink-500 to-rose-600",
    description: "Engineered few-shot, Chain-of-Thought, and structured JSON output prompts with robust guardrails.",
    criteria: "Complete Modules 6-7 and master prompt injection defense",
    xpAward: 350,
    unlocked: false
  },
  {
    id: "badge-oss-llm-master",
    title: "Open-Source Sovereign Master",
    tier: "Sovereign AI",
    icon: "🦙",
    color: "from-purple-500 to-indigo-600",
    description: "Deployed local Ollama runtimes, quantized GGUF weights, and built air-gapped vector semantic search.",
    criteria: "Complete Modules 8-9 and run local cosine similarity lab",
    xpAward: 400,
    unlocked: false
  },
  {
    id: "badge-langchain-orchestrator",
    title: "LangChain Orchestrator",
    tier: "Frameworks",
    icon: "🦜",
    color: "from-emerald-500 to-teal-600",
    description: "Crafted declarative LCEL chains, dynamic tool-calling agents, and safe read-only SQL executors.",
    criteria: "Complete Modules 10-11 and pass the ReAct assessment",
    xpAward: 450,
    unlocked: false
  },
  {
    id: "badge-langgraph-general",
    title: "LangGraph Multi-Agent General",
    tier: "Agentic Systems",
    icon: "🕸️",
    color: "from-amber-500 to-orange-600",
    description: "Orchestrated cyclical multi-agent supervisor systems with checkpoint persistence and human approval gates.",
    criteria: "Complete Modules 12-13 and run the multi-agent report lab",
    xpAward: 500,
    unlocked: false
  },
  {
    id: "badge-azure-rag-champion",
    title: "Azure Cloud RAG Champion",
    tier: "Cloud Enterprise",
    icon: "☁️",
    color: "from-sky-500 to-blue-700",
    description: "Implemented enterprise RAG with Azure AI Foundry, HNSW vector search, hybrid ranking, and citations.",
    criteria: "Complete Module 14 and verify citation grounding",
    xpAward: 500,
    unlocked: false
  },
  {
    id: "badge-capstone-legend",
    title: "Fortune 500 Capstone Legend",
    tier: "Elite Master",
    icon: "🏆",
    color: "from-yellow-400 via-amber-500 to-yellow-600",
    description: "Delivered the end-to-end AI-Powered Sales Insights Assistant meeting all 7 Phase milestone requirements.",
    criteria: "Complete Capstone Project blueprint and score >= 80% on Mock Exam",
    xpAward: 1000,
    unlocked: false
  },
  {
    id: "badge-fortune-wheel-roller",
    title: "Wheel of Fortune High Roller",
    tier: "Daily Dedication",
    icon: "🎡",
    color: "from-violet-500 to-purple-700",
    description: "Spun the daily Fortune Wheel and correctly conquered multiple daily enterprise challenges.",
    criteria: "Spin the wheel 3 times and answer quiz questions correctly",
    xpAward: 200,
    unlocked: false
  },
  {
    id: "badge-streak-sorcerer",
    title: "Unstoppable 5-Day Streak",
    tier: "Dedication",
    icon: "🔥",
    color: "from-red-500 to-orange-500",
    description: "Maintained an unbroken daily learning cadence demonstrating Fortune 500 executive discipline.",
    criteria: "Maintain an active learning streak for 5 consecutive sessions",
    xpAward: 300,
    unlocked: false
  },
  {
    id: "badge-century-club",
    title: "Century Club Perfectionist",
    tier: "Excellence",
    icon: "🎯",
    color: "from-emerald-400 to-green-600",
    description: "Scored 100% on an official Certification Mock Assessment.",
    criteria: "Achieve a perfect score (100%) on any full mock assessment",
    xpAward: 400,
    unlocked: false
  },
  {
    id: "badge-idle-ninja",
    title: "Pyodide Code Ninja",
    tier: "Hands-on",
    icon: "💻",
    color: "from-slate-600 to-zinc-900",
    description: "Executed 10+ live Python scripts inside the integrated browser IDLE studio.",
    criteria: "Run 10 scripts or solved lab solutions in the IDLE Integrated runner",
    xpAward: 300,
    unlocked: false
  }
];
