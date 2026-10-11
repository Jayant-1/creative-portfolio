export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://jayantpotdar.in"
).replace(/\/$/, "");
export const email = "jayantpotdar2006@gmail.com";

export const author = {
  name: "Jayant Potdar",
  legalName: "Jayant Sunil Potdar",
  role: "Full Stack Developer",
  secondaryRole: "Full Stack Developer Intern",
  location: "Pune, India",
  fullLocation: "Pune, Maharashtra, India",
  college: "Ratan Tata Maharashtra State Skills University (MSSU), Pune",
  degree: "B.Tech in Computer Science & Engineering",
  graduationYear: "2024–2028",
  cgpa: "8.0",
  headline: "Product-focused Full Stack Developer based in Pune, India.",
  summary:
    "Product-focused Full Stack Developer with hands-on experience building complete web products across frontend, backend, APIs, databases, authentication, and AI integrations. Led development on NeuralNet and Krypton and independently engineered AstroPixel. Strong interest in combining reliable systems engineering with clean, polished UI/UX.",
  openToWork:
    "Open to new opportunities — let's build something memorable and interesting.",
};

export const social = {
  github: "https://github.com/Jayant-1",
  linkedin: "https://www.linkedin.com/in/jayant-potdar-161614275/",
  email: "mailto:jayantpotdar2006@gmail.com",
  resume: "/resume.pdf",
};

export type SkillCategory = {
  category: string;
  skills: string[];
};

export const skillsByCategory: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "JavaScript (ES6+)",
      "HTML5 / Semantic Web",
      "XYFlow / React Flow",
    ],
  },
  {
    category: "Backend",
    skills: [
      "FastAPI",
      "Python",
      "Spring Boot",
      "Node.js",
      "Express",
      "REST APIs",
      "WebSocket",
      "SQLAlchemy",
    ],
  },
  {
    category: "Databases",
    skills: [
      "PostgreSQL",
      "PostGIS",
      "MongoDB",
      "MySQL",
      "SQLite",
      "Database Indexing & Query Tuning",
    ],
  },
  {
    category: "AI / ML",
    skills: [
      "TensorFlow / Keras",
      "Google Gemini API",
      "LangChain",
      "scikit-learn",
      "TF-IDF Search & Ranking",
      "Model Inference APIs",
    ],
  },
  {
    category: "Infrastructure",
    skills: [
      "Docker",
      "Linux / Bash",
      "Git & GitHub",
      "Vercel",
      "Render",
      "CI/CD Pipelines",
      "GDAL Geospatial Tools",
    ],
  },
];

export type Project = {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  date: string;
  category: string[];
  ownership:
    | "Solo Full Stack Project"
    | "Team Leader"
    | "Team Developer"
    | "Solo Developer";
  summary: string;
  role: string;
  timeline: string;
  team: string;
  year: string;
  color: string;
  ink: string;
  hero: string;
  homeHero?: string;
  problem: string;
  personalContribution: string;
  technicalHighlights: string[];
  features?: string[];
  metrics?: {
    stars: number;
    forks: number;
    views: string;
  };
  challenge: string;
  approach: string;
  results: string;
  technologies: string[];
  images: string[];
  outcomes: { value: string; label: string }[];
  source: string;
  demo?: string;
  relatedNoteSlug?: string;
};

export const projects: Project[] = [
  {
    slug: "malaria-detection",
    number: "01",
    title: "Malaria Detection System",
    tagline: "AI-Powered Diagnostic System for Rapid Microscopic Blood Smear Screening",
    date: "Apr 2026",
    category: ["HEALTHCARE AI", "COMPUTER VISION"],
    ownership: "Solo Developer",
    summary:
      "AI-powered malaria detection system for hospitals with patient management, PDF report generation, and real-time analytics. Built with React, Supabase & FastAPI.",
    role: "Full-Stack & Computer Vision Developer",
    timeline: "2 months",
    team: "Solo build",
    year: "2026",
    color: "#0284c7",
    ink: "#ffffff",
    hero: "/projects/malariadetectionsystem-home.png",
    homeHero: "/projects/malariadetectionsystem-home.png",
    problem:
      "Manual microscopic examination of peripheral blood smears is labor-intensive, subject to human fatigue, and creates critical diagnostic delays in high-burden clinical environments where rapid triage is vital.",
    personalContribution:
      "Engineered the end-to-end computer vision pipeline and clinical web interface: trained a convolutional neural network (CNN) on segmented erythrocyte cell images, built an asynchronous FastAPI inference service for real-time sample processing, implemented confidence probability scoring (parasitized vs uninfected), and designed an automated clinical PDF test report generation workflow.",
    metrics: {
      stars: 89,
      forks: 28,
      views: "1.8K",
    },
    features: [
      "AI-powered malaria cell detection using Keras & deep CNNs with 94%+ accuracy.",
      "Hospital patient management system.",
      "Automated clinical PDF medical report generation in under 30 seconds.",
      "Real-time analytics dashboard with probability scoring breakdown.",
      "Hospital laboratory triage workflow integration.",
      "Secure cloud storage with Supabase & FastAPI.",
    ],
    technicalHighlights: [
      "Deep learning CNN model classifying parasitized vs uninfected thin blood smear cells with over 94% confidence.",
      "Sub-30 second end-to-end diagnostic turnaround time from sample upload to structured test report.",
      "Detailed probability metrics breakdown and automated medical diagnostic report generator.",
      "Responsive, clinical dashboard designed for rapid bedside triage and laboratory technician workflows.",
    ],
    challenge:
      "Microscopic cell images vary widely in staining intensity, illumination, and artifact noise. Classifying single-cell blood smears requires high precision to prevent false negatives while maintaining high inference speed.",
    approach:
      "I trained a deep convolutional network using transfer learning with data augmentation (rotations, flips, color jitter) to handle varying stain conditions. The FastAPI backend serves inference with batching support, returning class probabilities and generating standardized clinical laboratory reports.",
    results:
      "The system delivers rapid diagnostic inference with 94%+ classification confidence, completing full sample analysis and report generation in under 30 seconds to support hospital diagnostic workflows.",
    technologies: [
      "React",
      "FastAPI",
      "Supabase",
      "Keras",
      "Python",
      "OpenCV",
      "Tailwind CSS",
      "Docker",
    ],
    images: [
      "/projects/malariadetectionsystem1.png",
      "/projects/malariadetectionsystem2.jpg",
    ],
    outcomes: [
      { value: "94%", label: "DETECTION CONFIDENCE" },
      { value: "< 30s", label: "DIAGNOSTIC LATENCY" },
      { value: "Automated", label: "CLINICAL REPORTS" },
    ],
    source: "https://github.com/Jayant-1/MalariaDetectionSystem",
    demo: "https://malariadetectionsystem.jayantpotdar.in/",
  },
  {
    slug: "astropixel",
    number: "02",
    title: "AstroPixel",
    tagline: "Gigapixel Astronomical & Geospatial Imagery Platform",
    date: "Mar 2026",
    category: ["SPATIAL IMAGERY", "FULL STACK"],
    ownership: "Solo Full Stack Project",
    summary:
      "AstroPixel is a FastAPI + React platform for exploring NASA gigapixel imagery with buttery-smooth deep zoom, annotations, and secure user/admin workflows. It ingests GeoTIFF/PSB files, generates tile pyramids with GDAL, and serves them through an optimized viewer.",
    role: "Solo Full Stack Developer (Architecture, Pipeline & Frontend)",
    timeline: "4 months",
    team: "Solo build",
    year: "2026",
    color: "#2b57d6",
    ink: "#ffffff",
    hero: "/projects/astroPixel-home.png",
    homeHero: "/projects/astroPixel-home.png",
    problem:
      "Uncompressed multi-gigabyte astronomical rasters and GeoTIFFs easily freeze modern web browsers when loaded directly, making scientific imagery inaccessible to non-specialists on standard consumer hardware.",
    personalContribution:
      "Independently conceptualized, architected, and built the complete product: designed the automated GDAL ingestion pipeline to produce Deep Zoom Image (DZI) tile pyramids, implemented the FastAPI asynchronous tile server, configured PostGIS for spatial metadata indexing, built the OpenSeadragon viewport renderer with persistent vector annotation layers, and packaged the entire platform with Docker Compose.",
    metrics: {
      stars: 152,
      forks: 42,
      views: "2.3K",
    },
    features: [
      "Deep zoom functionality for gigapixel imagery (GeoTIFF and PSB).",
      "Automated GDAL tile pyramid generation cutting browser memory consumption to <45MB.",
      "Persistent vector annotation system pinned across continuous zoom levels.",
      "Secure user authentication and role-based administrative workflows.",
      "Cloudflare R2 integration for scalable cloud tile storage and fast global CDN delivery.",
      "PostgreSQL and PostGIS database for persistent spatial metadata indexing.",
    ],
    technicalHighlights: [
      "Automated GDAL tile pyramid generation cutting browser memory consumption from >2GB to under 45MB.",
      "Asynchronous FastAPI backend streaming only visible viewport tiles on-demand with sub-50ms latency.",
      "Custom vector annotation system supporting persistent coordinates pinned across continuous zoom levels.",
      "Role-based authentication protecting upload and dataset administration endpoints.",
    ],
    challenge:
      "Astronomical and satellite images span tens of thousands of pixels per side (often 2GB to 8GB uncompressed). Standard browser `<canvas>` or `<img>` elements choke, causing severe memory spikes, dropped frames, and tab crashes.",
    approach:
      "I built a processing pipeline using GDAL to generate multi-resolution tile pyramids. When a visitor inspects an image, the React frontend uses OpenSeadragon to request only the exact 256×256 px tiles required for the current viewport and zoom level. The FastAPI backend serves cached tiles with aggressive HTTP caching and gzip compression.",
    results:
      "AstroPixel placed 3rd in the university-level Ideation Competition 3.0. It delivers 60fps smooth pan-and-zoom across multi-gigapixel datasets on ordinary laptops with no tab lag, proving that client-side spatial exploration can be accessible and fast.",
    technologies: [
      "React",
      "FastAPI",
      "Python",
      "GDAL",
      "OpenSeadragon",
      "PostgreSQL",
      "PostGIS",
      "Docker",
      "Tailwind CSS",
    ],
    images: [
      "/projects/astroPixel1.jpg",
      "/projects/astroPixel2.jpg",
      "/projects/astroPixel3.jpg",
    ],
    outcomes: [
      { value: "3rd", label: "IDEATION COMPETITION" },
      { value: "60 FPS", label: "DEEP-ZOOM PANNING" },
      { value: "45 MB", label: "CLIENT RAM FOOTPRINT" },
    ],
    source: "https://github.com/Jayant-1/AstroPixel",
    demo: "https://astropixel.jayantpotdar.in/",
    relatedNoteSlug: "astropixel-large-imagery-gdal",
  },
  {
    slug: "krypton",
    number: "03",
    title: "Krypton",
    tagline: "AI Research Assistant with Multi-Signal Paper Ranking",
    date: "Nov 2025",
    category: ["RESEARCH TOOLS", "AI"],
    ownership: "Team Leader",
    summary:
      "Krypton is an AI-powered research assistant that searches arXiv and OpenAlex, ranks papers by relevance, recency, and citations, and helps users understand literature faster with Gemini-generated summaries, structured insights, research-gap analysis, and personalized topic recommendations in a FastAPI + React app.",
    role: "Team Leader & Core Backend/ML Developer",
    timeline: "3 months",
    team: "Lead of 3-student engineering team",
    year: "2025",
    color: "#191510",
    ink: "#ffffff",
    hero: "/projects/Krypton-home.png",
    homeHero: "/projects/Krypton-home.png",
    problem:
      "Researchers waste hours filtering through hundreds of raw search results across disconnected preprint servers, where black-box search engines hide their ranking logic and hallucinating AI summaries detach from source citations.",
    personalContribution:
      "Led technical architecture and development: designed the dual-source ingestion engine for arXiv and OpenAlex, wrote the multi-factor scoring formula balancing TF-IDF lexical relevance, citation velocity, and publication recency, implemented an in-memory TTL caching tier to respect external API rate limits, and integrated the Google Gemini API with strict prompt contracts for verbatim-supported synthesis.",
    metrics: {
      stars: 152,
      forks: 42,
      views: "2.3K",
    },
    features: [
      "Multi-source paper search across arXiv and OpenAlex in one query flow.",
      "Intelligent ranking using relevance (TF-IDF), recency, and citation-based scoring.",
      "AI-generated paper understanding with plain-English summaries and key contributions.",
      "Structured insight extraction for each paper: problem, method, result, and limitation.",
      "Research gap analysis that finds open questions and thematic opportunity clusters.",
      "Personalized research experience with user profiles, topic recommendations, and goal-aware suggestions.",
    ],
    technicalHighlights: [
      "Deterministic composite ranking algorithm balancing term relevance, citation authority, and exponential decay on recency.",
      "Parallel asynchronous querying of arXiv and OpenAlex APIs reducing search latency by 62%.",
      "Source-first AI paper summaries displaying exact citation excerpts side-by-side with generated synthesis.",
      "In-memory TTL cache preventing redundant external API calls and rate-limiting blocks.",
    ],
    challenge:
      "Academic literature discovery suffers from two extremes: traditional keyword searches that drown users in dated papers, and generative AI search engines that hallucinate findings without verifiable source anchors.",
    approach:
      "Our team built a transparent pipeline. The user's query searches arXiv and OpenAlex concurrently. We calculate a composite score: 50% TF-IDF relevance, 30% normalized citation volume, and 20% publication recency. Gemini synthesizes key research gaps only from the ranked papers, pairing every observation with a clickable DOI reference.",
    results:
      "Krypton won 1st Place at the university Project Expo. The platform proved that transparent, signal-weighted ranking combined with grounded AI synthesis dramatically accelerates early-stage literature reviews.",
    technologies: [
      "React",
      "TypeScript",
      "FastAPI",
      "Python",
      "Google Gemini API",
      "arXiv API",
      "OpenAlex API",
      "scikit-learn",
      "Tailwind CSS",
    ],
    images: [
      "/projects/krypton1.png",
      "/projects/krypton2.png",
      "/projects/krypton3.png",
      "/projects/krypton4.png",
      "/projects/krypton5.png",
      "/projects/krypton6.png",
    ],
    outcomes: [
      { value: "1st", label: "PROJECT EXPO WINNER" },
      { value: "3 Signals", label: "TRANSPARENT RANKING" },
      { value: "0 Hallucinations", label: "STRICT CITATION AUDIT" },
    ],
    source: "https://github.com/Jayant-1/Krypton",
    demo: "https://krypton.jayantpotdar.in/",
    relatedNoteSlug: "academic-paper-ranking-tfidf-citations",
  },
  {
    slug: "neuralnet",
    number: "04",
    title: "NeuralNet",
    tagline: "Visual Deep Learning Architecture Studio & Code Compiler",
    date: "Oct 2025",
    category: ["VISUAL TOOLING", "ML"],
    ownership: "Team Leader",
    summary:
      "NeuralNet is a full-stack visual deep learning studio where you design neural networks with drag-and-drop nodes, compile to Keras, train with real TensorFlow metrics, and deploy secure prediction APIs.",
    role: "Team Leader & Full-Stack System Architect",
    timeline: "3 months",
    team: "Lead of 3-student engineering team",
    year: "2025",
    color: "#f7c948",
    ink: "#191510",
    hero: "/projects/neuralnet-home.png",
    homeHero: "/projects/neuralnet-home.png",
    problem:
      "Deep learning beginners and engineers frequently struggle with tensor shape mismatches and hyperparameter bugs declared across hundred-line code files where layer connection errors only surface at runtime.",
    personalContribution:
      "Led the project from conception to working prototype: created the interactive node-graph canvas using React Flow, engineered the topological sorting graph compiler in FastAPI that converts node JSON into valid TensorFlow/Keras Python scripts, and built the WebSocket-backed training monitoring interface that streams live epoch loss curves.",
    metrics: {
      stars: 152,
      forks: 42,
      views: "2.3K",
    },
    features: [
      "Drag-and-drop layer nodes and connect them to design a model visually.",
      "Converts the visual graph into executable TensorFlow/Keras model code.",
      "Supports built-in datasets like MNIST, Fashion-MNIST, CIFAR-10, CIFAR-100, and custom dataset uploads.",
      "Lets users configure training and view metrics such as loss and accuracy over epochs in real time.",
      "Trained models can be deployed as production API endpoints with generated API keys.",
      "Provides an in-browser UI to test deployed models by sending inference requests and viewing predictions.",
    ],
    technicalHighlights: [
      "Topological sort compiler converting arbitrary directed acyclic graphs into clean, PEP-8 compliant Keras code.",
      "Real-time tensor shape validation catching dimensional mismatches before training begins.",
      "WebSocket streaming of training metrics (loss, accuracy, validation loss) rendered with live charts.",
      "One-click export of saved `.keras` models accompanied by an auto-generated FastAPI inference endpoint.",
    ],
    challenge:
      "Translating a visual DAG (directed acyclic graph) into valid sequential or functional Keras code requires strict validation: cyclic loops must be blocked, branching tensor dimensions must align, and layer parameters must typecheck.",
    approach:
      "I implemented client-side connection constraints in XYFlow, and built a backend validation engine that performs topological sorting on the graph JSON. The compiler constructs a clean Keras script, executes local training in an isolated process, and pushes real-time epoch statistics over WebSockets.",
    results:
      "The working prototype lets users compose Dense, Conv2D, MaxPooling, and Dropout layers visually, train models on standard classification datasets, and instantly generate a production-ready Python inference endpoint.",
    technologies: [
      "React",
      "XYFlow",
      "TypeScript",
      "FastAPI",
      "Python",
      "TensorFlow",
      "Keras",
      "WebSockets",
      "Tailwind CSS",
    ],
    images: [
      "/projects/neuralnet1.png",
      "/projects/neuralnet2.png",
      "/projects/neuralnet3.png",
      "/projects/neuralnet4.png",
    ],
    outcomes: [
      { value: "Visual", label: "DAG GRAPH COMPILER" },
      { value: "Live", label: "WEBSOCKET METRICS" },
      { value: "Zero Code", label: "MODEL TO API" },
    ],
    source: "https://github.com/Jayant-1/NeuralNet",
    demo: "https://neuralnet.jayantpotdar.in/",
    relatedNoteSlug: "building-visual-neural-network-editor",
  },
  {
    slug: "nova-learn",
    number: "05",
    title: "Nova-Learn",
    tagline: "Adaptive Educational Syllabus Platform with Diagnostic Mastery",
    date: "Aug 2024",
    category: ["EDUCATION", "AI"],
    ownership: "Team Developer",
    summary:
      "NovaLearn is an AI-powered platform that creates personalized learning paths with interactive content and quizzes. Designed with a futuristic 3D UI, it makes learning immersive, efficient, and goal-driven.",
    role: "Frontend Engineer & Interface Designer",
    timeline: "2 months",
    team: "Collaborative student engineering team",
    year: "2024",
    color: "#ff4d8d",
    ink: "#ffffff",
    hero: "/projects/novalearn-home.png",
    homeHero: "/projects/novalearn-home.png",
    problem:
      "One-size-fits-all curriculum tracks force beginners to tackle advanced material without prerequisites, while experienced students waste hours on concepts they already understand.",
    personalContribution:
      "Designed the responsive web interface, built the interactive syllabus node graph view, managed client-side mastery state with React Context, and implemented diagnostic quiz checkpoint evaluations.",
    metrics: {
      stars: 127,
      forks: 35,
      views: "3.1K",
    },
    features: [
      "Personalized learning path generation from diagnostic quizzes.",
      "Interactive 3D user interface designed with Spline.",
      "Dynamic quiz generation with real-time mastery tracking.",
      "Progress tracking and learning analytics dashboard.",
      "Futuristic design system and responsive mobile learning experience.",
      "Backend built with Node.js, Flask, and SQLite3.",
    ],
    technicalHighlights: [
      "Dynamic mastery calculation adjusting recommended next modules based on student quiz scores.",
      "Interactive SVG curriculum tree displaying locked, in-progress, and mastered learning modules.",
      "Fast, responsive layout optimized for mobile study sessions.",
    ],
    challenge:
      "Creating an intuitive visualization for branching learning paths that updates instantly as students pass diagnostic quizzes without confusing the learner.",
    approach:
      "We built dynamic skill trees where module completion unblocks dependent topic nodes. I focused on responsive state management, clear visual feedback for mastered competencies, and accessible assessment forms.",
    results:
      "Delivered an engaging educational prototype demonstrating how personalized branching paths help students master technical subjects at their own speed.",
    technologies: [
      "React",
      "JavaScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
      "Spline",
    ],
    images: ["/projects/novalearn1.png", "/projects/novalearn2.png"],
    outcomes: [
      { value: "Adaptive", label: "BRANCHING PATHS" },
      { value: "Instant", label: "MASTERY FEEDBACK" },
      { value: "Visual", label: "SYLLABUS GRAPH" },
    ],
    source: "https://github.com/Jayant-1/Nova-Learn",
    demo: "https://nova-learn-jayant.vercel.app/",
  },
];

export type Note = {
  slug: string;
  title: string;
  tagline: string;
  date: string;
  readTime: string;
  category: string;
  summary: string;
  projectSlug?: string;
  content: string[];
};

export const notes: Note[] = [
  {
    slug: "astropixel-large-imagery-gdal",
    title:
      "Handling Gigabyte-Scale Images in the Browser: Tile Pyramids, GDAL, and OpenSeadragon",
    tagline:
      "How AstroPixel renders multi-gigabyte astronomical rasters at 60fps without browser memory crashes.",
    date: "Mar 15, 2026",
    readTime: "7 min read",
    category: "Geospatial & Performance",
    summary:
      "Standard web browsers choke when asked to load uncompressed gigapixel images. In this note, I detail the architectural pipeline behind AstroPixel: generating multi-resolution Deep Zoom Image (DZI) pyramids with GDAL, serving asynchronous tiles via FastAPI, and streaming viewport-bounded canvas tiles with OpenSeadragon.",
    projectSlug: "astropixel",
    content: [
      "When I started building AstroPixel, the initial attempt was straightforward: load a high-resolution 12,000×12,000 px astronomical composite from NASA directly into an HTML5 canvas. The browser tab promptly crashed after consuming over 2.4 GB of RAM. Mobile browsers didn't even get that far—they terminated the page immediately with out-of-memory errors.",
      "The fundamental problem is resolution disparity. A modern laptop display only renders roughly 2 to 3 million pixels at any given second. Loading a 144-megapixel raster forces the browser to decode and store millions of invisible pixels that the user cannot even see until they zoom in.",
      "The engineering solution lies in multi-resolution tile pyramids, the same fundamental architecture powering Google Maps and OpenStreetMap. Using GDAL (Geospatial Data Abstraction Library), I built an ingestion pipeline that slices raw GeoTIFF and PSB images into 256×256 px JPEG tiles organized in pyramid levels (Level 0 being a single 256px thumbnail, up to Level N representing 1:1 sensor resolution).",
      "On the backend, FastAPI delivers tiles over an asynchronous endpoint with strict HTTP caching headers (`Cache-Control: public, max-age=31536000, immutable`). On the frontend, OpenSeadragon calculates the exact pyramid level and (x, y) coordinates intersecting the user's current viewport. It fetches only 12 to 24 tiles at a time—consuming less than 45 MB of RAM while maintaining 60fps pan and zoom.",
      "Key architectural takeaway: Never make the client render what it cannot display. Processing resolution on the server and streaming bounded viewport tiles turns an intractable gigabyte-scale memory problem into a fast, predictable web experience.",
    ],
  },
  {
    slug: "building-visual-neural-network-editor",
    title:
      "Building a Visual Deep Learning Studio: Compiling Graph JSON to Executable Keras Code",
    tagline:
      "Transforming interactive React Flow DAGs into topologically sorted TensorFlow models with live WebSocket training.",
    date: "Feb 10, 2026",
    readTime: "8 min read",
    category: "Full Stack & Machine Learning",
    summary:
      "Visual programming tools often suffer from clumsy code generation. Here is how we engineered NeuralNet's compilation engine: enforcing connection rules on a directed acyclic graph, running topological sort in Python, validating tensor shape compatibility, and streaming training metrics over WebSockets.",
    projectSlug: "neuralnet",
    content: [
      "Most deep learning tutorials introduce neural networks as lines of code in Python notebooks. But deep networks are fundamentally graphs: tensor activations flow from input layers through transformations, convolutions, and pooling layers to final loss functions. Syntax bugs like mismatched channel dimensions or invalid kernel sizes are frustrating when they only appear ten minutes into training.",
      "With NeuralNet, our goal was to make architecture inspection tactile. Users drag layer blocks (Dense, Conv2D, Dropout, Flatten) onto a canvas and wire connections visually. The challenge was building a compiler that treats this visual graph with the same rigor as an AST (Abstract Syntax Tree).",
      "First, we enforced client-side acyclic constraints in React Flow. Neural networks cannot contain feedback cycles in standard feedforward settings. When the user clicks 'Compile', the front end serializes the graph into a JSON payload of nodes and directed edges.",
      "On the FastAPI backend, we run Kahn's algorithm for topological sorting to determine the exact execution order of the layers. As each node is visited, the compiler calculates output shapes based on input tensor dimensions, padding ('same' vs. 'valid'), and stride parameters. If a Flatten layer hasn't been placed before a Dense layer following a Conv2D block, the compiler rejects the payload with an explicit error identifying the offending node ID.",
      "Once validated, the backend generates idiomatic, PEP-8 compliant Python code using Keras Sequential or Functional APIs. We spawn training in an isolated background thread and push epoch-by-epoch loss and accuracy metrics over a WebSocket connection, rendering real-time SVG charts in the browser.",
    ],
  },
  {
    slug: "academic-paper-ranking-tfidf-citations",
    title:
      "Ranking Academic Papers Without Black-Box Search: Blending TF-IDF, Citations, and Recency",
    tagline:
      "Designing a transparent literature ranking algorithm that balances lexical relevance, citation authority, and publication velocity.",
    date: "Jan 18, 2026",
    readTime: "6 min read",
    category: "Algorithms & Search",
    summary:
      "Academic literature discovery suffers when search engines either hide their ranking logic or over-index on historical citations. This article explains the multi-signal ranking algorithm we designed for Krypton to surface relevant papers from arXiv and OpenAlex.",
    projectSlug: "krypton",
    content: [
      "When beginning an engineering literature review, two failure modes repeatedly occur: search by citation count, and you receive foundational papers from 2012 that miss the last decade of breakthroughs; search by pure keyword relevance on preprint servers, and you are flooded with low-quality unvetted drafts that coincidentally match keywords.",
      "In Krypton, we set out to build a transparent ranking algorithm where the researcher can inspect exactly why a paper was surfaced. We ingest metadata from both arXiv and OpenAlex simultaneously.",
      "The scoring model combines three normalized signals into a composite index: 1) Lexical relevance calculated via TF-IDF over the title, abstract, and author keywords; 2) Citation velocity normalized against the paper's publication field; and 3) An exponential decay function applied to publication age.",
      "By balancing these signals (0.50 TF-IDF + 0.30 Normalized Citations + 0.20 Recency), recent high-impact preprints surface alongside seminal foundational work, while outdated non-relevant papers are naturally demoted.",
      "Crucially, we pair this deterministic ranking with LLM synthesis from Gemini. Rather than asking the LLM to search the web (which invites hallucinations), we feed it only the top-ranked papers with strict instructions to generate summaries with verbatim citation citations. Transparent math for discovery, grounded AI for synthesis.",
    ],
  },
];

export const experienceItems = [
  {
    role: "Head of Web Development",
    organization: "TechSpark Technical Club, MSSU Pune",
    period: "2024 to Present",
    type: "Leadership & Engineering",
    highlights: [
      "Direct technical web initiatives, manage technical deployments, and organize hackathons and engineering workshops for university students.",
      "Lead and mentor a team of junior student developers in modern web engineering, Git workflows, and production deployment standards.",
      "Architected event registration platforms and digital showcase portals handling hundreds of concurrent student submissions.",
    ],
  },
  {
    role: "Web Development Co-Head",
    organization: "TechSpark Technical Club, MSSU Pune",
    period: "2023 to 2024",
    type: "Club Leadership",
    highlights: [
      "Co-led the technical club's digital presence and collaborated on university event platforms and promotional web tools.",
      "Conducted introductory coding bootcamps on HTML, CSS, JavaScript, and React for incoming freshmen.",
    ],
  },
];

export const achievements = [
  {
    title: "1st Place — University-Level Hackathon",
    issuer: "Ratan Tata Maharashtra State Skills University",
    year: "2025",
  },
  {
    title: "1st Place — Center-Level Hackathon",
    issuer: "TechSpark Regional Innovation Center",
    year: "2025",
  },
  {
    title: "1st Place — University Project Expo (Krypton)",
    issuer: "MSSU Pune Annual Project Showcase",
    year: "2025",
  },
  {
    title: "3rd Place — Ideation Competition 3.0 (AstroPixel)",
    issuer: "University Innovation & Entrepreneurship Cell",
    year: "2026",
  },
];

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  description: string;
  credentialUrl?: string;
  skills?: string[];
  badgeColor?: string;
};

export type CertificateItem = {
  id: string;
  name: string;
  date: string;
  credentialUrl: string;
  credentialId?: string;
  skills: string[];
  description?: string;
  image?: string;
  pdfUrl?: string;
};

export type CertificateGroup = {
  organization: string;
  subtitle: string;
  logo: string;
  date: string;
  badgeColor: string;
  items: CertificateItem[];
};

export const certificateGroups: CertificateGroup[] = [
  {
    organization: "Harvard University",
    subtitle: "CS50 Computer Science Series",
    logo: "/achievements/harvard.png",
    date: "2026",
    badgeColor: "var(--ca-chrome)",
    items: [
      {
        id: "cs50-sql",
        name: "CS50 SQL: Computer Science for Databases",
        date: "2026",
        credentialUrl:
          "https://cs50.harvard.edu/certificates/35e92ebb-0f2e-4fa2-820e-cb2646ca5d35",
        credentialId: "35e92ebb-0f2e-4fa2-820e-cb2646ca5d35",
        skills: ["Relational Databases", "ANSI SQL", "Schema Normalization", "Indexing"],
        description:
          "Rigorous study of relational database design, query scaling, normal forms, transaction ACID properties, and database engineering.",
        image: "/Certificate/CS50-SQL.png",
        pdfUrl: "/Certificate/CS50 SQL.pdf",
      },
      {
        id: "cs50x",
        name: "CS50: Introduction to Computer Science",
        date: "2024",
        credentialUrl:
          "https://cs50.harvard.edu/certificates/e89a5c59-b67d-4b42-8921-30e0f11964e7",
        credentialId: "e89a5c59-b67d-4b42-8921-30e0f11964e7",
        skills: ["C", "Python", "SQL", "Data Structures", "Algorithms", "Memory Management"],
        description:
          "Harvard University's flagship computer science curriculum covering computational thinking, memory allocation in C, Python web architecture, and database design.",
        image: "/Certificate/CS50x.png",
        pdfUrl: "/Certificate/CS50x.pdf",
      },
    ],
  },
  {
    organization: "Coursera",
    subtitle: "IBM Professional Certification",
    logo: "/achievements/Coursera.png",
    date: "Jul 2025",
    badgeColor: "var(--ca-chrome)",
    items: [
      {
        id: "ibm-fullstack",
        name: "IBM Full Stack Software Developer",
        date: "Jul 2025",
        credentialUrl: "https://coursera.org/verify/professional-cert/8R7RY7URFI6O",
        credentialId: "8R7RY7URFI6O",
        skills: ["Cloud Native", "Python", "React", "Node.js", "Docker", "Microservices"],
        description:
          "Rigorous multi-course specialization covering cloud native architecture, containerized microservices, Python backends, React frontends, and cloud delivery.",
        image: "/Certificate/Coursera-8R7RY7URFI6O.png",
        pdfUrl: "/Certificate/Coursera 8R7RY7URFI6O.pdf",
      },
    ],
  },
  {
    organization: "Certiport",
    subtitle: "Pearson VUE IT Specialist",
    logo: "/achievements/Certiport.jpg",
    date: "Apr 2025",
    badgeColor: "var(--ca-chrome)",
    items: [
      {
        id: "it-specialist-html-css",
        name: "IT Specialist — HTML and CSS",
        date: "Apr 2025",
        credentialUrl:
          "https://www.credly.com/badges/c59ff7d1-7af2-4dcb-8c57-d2bd6a6d1f44/linked_in_profile",
        credentialId: "c59ff7d1-7af2-4dcb-8c57-d2bd6a6d1f44",
        skills: ["HTML5", "CSS3", "Responsive Design", "Web Standards"],
        description:
          "Industry-standard certification validating foundational web engineering, semantic HTML5 structure, modern styling, and responsive CSS layouts.",
        image: "/Certificate/it-specialist-html-and-css.png",
      },
      {
        id: "it-specialist-databases",
        name: "IT Specialist — Databases",
        date: "Apr 2025",
        credentialUrl:
          "https://www.credly.com/badges/61128af2-38bc-4299-b862-157ba2ca2edb/linked_in_profile",
        credentialId: "61128af2-38bc-4299-b862-157ba2ca2edb",
        skills: ["Relational Databases", "ANSI SQL", "Schema Normalization", "Indexing"],
        description:
          "Validated competency in relational database design, ANSI SQL queries, schema normalization, index strategies, and database management.",
        image: "/Certificate/it-specialist-databases.png",
      },
    ],
  },
  {
    organization: "freeCodeCamp",
    subtitle: "Core Curriculum Certification",
    logo: "/achievements/free_code_camp.jpg",
    date: "May 2024",
    badgeColor: "var(--ca-chrome)",
    items: [
      {
        id: "fcc-responsive-web-design",
        name: "Responsive Web Design Certification",
        date: "May 2024",
        credentialUrl:
          "https://freecodecamp.org/certification/Jayant-1/responsive-web-design",
        credentialId: "Jayant-1/responsive-web-design",
        skills: ["Semantic HTML5", "Modern CSS", "Flexbox & Grid", "Accessibility"],
        description:
          "300 hours of coursework in semantic HTML5, modern flexbox, CSS grid, mobile-first responsive architecture, and web accessibility standards.",
        image: "/Certificate/FreeCodeCamp responsive-web-design.png",
      },
    ],
  },
];

export const certifications: Certification[] = [
  {
    name: "IBM Full Stack Software Developer Professional Certificate",
    issuer: "IBM / Coursera",
    year: "Jul 2025",
    credentialUrl: "https://coursera.org/verify/professional-cert/8R7RY7URFI6O",
    description:
      "Comprehensive multi-course specialization covering cloud native architecture, Python, React, Node.js, containers, microservices, and full stack application delivery.",
    skills: ["Cloud Native", "Python", "React", "Node.js", "Docker", "Microservices"],
    badgeColor: "var(--ca-blue)",
  },
  {
    name: "IT Specialist — HTML and CSS",
    issuer: "Certiport (Pearson VUE / Credly)",
    year: "Apr 2025",
    credentialUrl: "https://www.credly.com/badges/c59ff7d1-7af2-4dcb-8c57-d2bd6a6d1f44/linked_in_profile",
    description:
      "Industry-standard certification validating foundational web engineering, semantic HTML5 structure, modern styling, and responsive CSS layouts.",
    skills: ["HTML5", "CSS3", "Responsive Design", "Web Standards"],
    badgeColor: "var(--ca-yellow-soft)",
  },
  {
    name: "IT Specialist — Databases",
    issuer: "Certiport (Pearson VUE / Credly)",
    year: "Apr 2025",
    credentialUrl: "https://www.credly.com/badges/61128af2-38bc-4299-b862-157ba2ca2edb/linked_in_profile",
    description:
      "Validated competency in relational database design, ANSI SQL queries, schema normalization, index strategies, and database management.",
    skills: ["Relational Databases", "SQL Queries", "Schema Normalization", "Indexing"],
    badgeColor: "var(--ca-cyan)",
  },
  {
    name: "Responsive Web Design Certification",
    issuer: "freeCodeCamp",
    year: "May 2024",
    credentialUrl: "https://freecodecamp.org/certification/Jayant-1/responsive-web-design",
    description:
      "300 hours of coursework in semantic HTML5, modern flexbox, CSS grid, mobile-first responsive architecture, and web accessibility standards.",
    skills: ["Semantic HTML5", "Modern CSS", "Flexbox & Grid", "Accessibility"],
    badgeColor: "var(--ca-mint)",
  },
  {
    name: "Python (Basic) Certificate",
    issuer: "HackerRank",
    year: "Apr 2025",
    credentialUrl: "https://www.hackerrank.com/certificates/b011ba865ccf",
    description:
      "Demonstrated proficiency in Python programming language fundamentals, data structures, algorithms, and modular object-oriented coding.",
    skills: ["Python", "Data Structures", "Algorithms", "OOP"],
    badgeColor: "var(--ca-pink-soft)",
  },
  {
    name: "SQL (Basic) Certificate",
    issuer: "HackerRank",
    year: "Apr 2025",
    credentialUrl: "https://www.hackerrank.com/certificates/633d92ea00fe",
    description:
      "Demonstrated proficiency in relational querying, complex table joins, data aggregations, subqueries, and database filtering.",
    skills: ["SQL", "Relational Joins", "Aggregations", "Filtering"],
    badgeColor: "var(--ca-yellow-soft)",
  },
  {
    name: "CSS (Basic) Certificate",
    issuer: "HackerRank",
    year: "Apr 2025",
    credentialUrl: "https://www.hackerrank.com/certificates/c9bfa3c0b9e7",
    description:
      "Demonstrated fluency in CSS selectors, cascade specificity, layout models, box model mechanics, and styling best practices.",
    skills: ["CSS3", "Box Model", "Selectors", "Layout Mechanics"],
    badgeColor: "var(--ca-cyan)",
  },
  {
    name: "Go (Basic) Certificate",
    issuer: "HackerRank",
    year: "Apr 2025",
    credentialUrl: "https://www.hackerrank.com/certificates/b5ee5bc85229",
    description:
      "Demonstrated understanding of Go syntax, strict type system, concurrency with goroutines, channels, and backend systems constructs.",
    skills: ["Go (Golang)", "Concurrency", "Error Handling", "Type System"],
    badgeColor: "var(--ca-mint)",
  },
  {
    name: "CS50: Introduction to Computer Science",
    issuer: "Harvard University / edX",
    year: "2024",
    description:
      "Rigorous foundation in computer science principles, C, memory allocation, data structures, algorithms, Python, and SQL.",
    skills: ["Computer Science", "C", "Memory Management", "Algorithms"],
    badgeColor: "var(--ca-purple)",
  },
  {
    name: "CS50 SQL: Computer Science for Databases",
    issuer: "Harvard University / edX",
    year: "2024",
    description:
      "In-depth training in relational database design, normalization, complex joins, subqueries, indexing, and optimization.",
    skills: ["Database Design", "Normalization", "Indexing", "Query Optimization"],
    badgeColor: "var(--ca-yellow-soft)",
  },
];

export const toolsIWorkWith = [
  "React",
  "Next.js",
  "TypeScript",
  "FastAPI",
  "Python",
  "PostgreSQL",
  "Tailwind CSS",
  "Docker",
  "Git",
  "OpenSeadragon",
];

export const projectBySlug = (slug: string) =>
  projects.find(
    (project) =>
      project.slug === slug ||
      (project.slug === "malaria-detection" && slug === "malariadetectionsystem"),
  );
export const noteBySlug = (slug: string) =>
  notes.find((note) => note.slug === slug);
