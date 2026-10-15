export const siteUrl = "https://jayant.codes";
export const email = "jayantpotdar2006@gmail.com";

export const author = {
  name: "Jayant Potdar",
  legalName: "Jayant Sunil Potdar",
  role: "Full Stack Developer",
  secondaryRole: "Creative Full Stack Developer",
  location: "Pune, India",
  fullLocation: "Pune, Maharashtra, India",
  college: "Ratan Tata Maharashtra State Skills University (MSSU), Pune",
  degree: "B.Tech in Computer Science & Engineering",
  graduationYear: "2024–2028",
  cgpa: "8.0",
  headline: "Creative full stack developer building expressive, production-ready web products in Pune.",
  summary:
    "Jayant Potdar is a full stack developer in Pune who designs expressive interfaces and builds the systems behind them. He built AstroPixel independently and led teams on Krypton, Malaria Detection System, and NeuralNet. He is open to internships, full-time roles, and selected projects.",
  openToWork:
    "Open to internships, full-time roles, and selected projects. Email me to arrange a call.",
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

export type ProjectTradeoff = {
  decision: string;
  rationale: string;
};

export type CategorizedTech = {
  category: string;
  items: string[];
};

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
  tradeoffs?: ProjectTradeoff[];
  features?: string[];
  categorizedTech?: CategorizedTech[];
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

export function isDarkProjectHero(slug?: string): boolean {
  return slug === "astropixel" || slug === "krypton" || slug === "3d-portfolio";
}

export const projects: Project[] = [
  {
    slug: "astropixel",
    number: "01",
    title: "AstroPixel",
    tagline: "Explore enormous space images without overwhelming the browser",
    date: "Mar 2026",
    category: ["SPATIAL IMAGERY", "FULL STACK", "PERFORMANCE"],
    ownership: "Solo Full Stack Project",
    summary:
      "AstroPixel turns large astronomical images into browser-friendly tiles. I built the upload pipeline, deep-zoom viewer, annotations, and access controls from end to end.",
    role: "Solo Full Stack Developer",
    timeline: "4 months",
    team: "Solo build",
    year: "2026",
    color: "#2b57d6",
    ink: "#ffffff",
    hero: "/projects/astroPixel-home.png",
    homeHero: "/projects/astroPixel-home.png",
    problem:
      "A full-resolution astronomical image is too large to load and explore comfortably in a normal browser tab.",
    personalContribution:
      "I built the GDAL ingestion and tile-generation pipeline, FastAPI APIs, OpenSeadragon viewer, persistent annotations, and role-based access controls. The project taught me to test each stage of a complex system until tiles loaded quickly and reliably.",
    features: [
  "Upload GeoTIFF and PSB imagery for processing.",
  "Explore large images through a tile-based deep-zoom viewer.",
  "Add and manage persistent image annotations.",
  "Use authenticated user and administrator workflows.",
  "Store tiles locally or with the supported Cloudflare R2 integration.",
  "Inspect datasets and metadata without downloading an entire source image."
],
    technicalHighlights: [
  "Built a GDAL pipeline that generates multi-resolution image tiles.",
  "Connected an OpenSeadragon viewport to FastAPI tile endpoints.",
  "Implemented annotation tools and access-controlled upload workflows.",
  "Added optional R2 storage and deployment-ready Docker configuration."
],
    tradeoffs: [
  {
    "decision": "Tile pyramids instead of full-image loading",
    "rationale": "Processing images into zoom-level tiles lets the viewer request only the detail needed for the current viewport."
  },
  {
    "decision": "Cloud storage support with a local fallback",
    "rationale": "The storage layer can serve tiles locally or use Cloudflare R2 when configured, without changing the viewer flow."
  },
  {
    "decision": "Image-space annotation coordinates",
    "rationale": "Annotations stay attached to their place in the image as a visitor pans and zooms."
  }
],
    challenge:
      "Large image files need to be processed, stored, and delivered at several zoom levels without making the viewer wait for the entire original file.",
    approach:
      "GDAL creates a multi-resolution tile pyramid. OpenSeadragon requests the tiles visible at the current zoom level, while FastAPI handles ingestion, metadata, authentication, and tile delivery. Cloudflare R2 is supported for cloud tile storage.",
    results:
      "AstroPixel placed third at Ideation Competition 3.0. It is a working, independently built deep-zoom product with image upload, tiled viewing, annotations, and administrative workflows.",
    categorizedTech: [
  {
    "category": "Frontend & Viewer",
    "items": [
      "React",
      "OpenSeadragon",
      "Tailwind CSS",
      "Vite"
    ]
  },
  {
    "category": "Backend & Processing",
    "items": [
      "FastAPI",
      "Python",
      "GDAL",
      "SQLAlchemy"
    ]
  },
  {
    "category": "Storage & Deployment",
    "items": [
      "SQLite / PostgreSQL",
      "Cloudflare R2 support",
      "Docker",
      "Vercel"
    ]
  }
],
    technologies: [
  "React",
  "FastAPI",
  "Python",
  "GDAL",
  "OpenSeadragon",
  "SQLAlchemy",
  "Cloudflare R2",
  "Docker"
],
    images: [
      "/projects/astroPixel1.jpg",
      "/projects/astroPixel2.jpg",
      "/projects/astroPixel3.jpg",
    ],
    outcomes: [
  {
    "value": "3rd",
    "label": "IDEATION 3.0"
  },
  {
    "value": "Tiled",
    "label": "DEEP-ZOOM VIEWER"
  },
  {
    "value": "Solo",
    "label": "END-TO-END BUILD"
  }
],
    source: "https://github.com/Jayant-1/AstroPixel",
    demo: "https://astropixel.jayantpotdar.in/",
  },
  {
    slug: "krypton",
    number: "02",
    title: "Krypton",
    tagline: "Find, rank, and understand academic papers in one place",
    date: "Nov 2025",
    category: ["RESEARCH TOOLS", "AI / ML", "FULL STACK"],
    ownership: "Team Leader",
    summary:
      "Krypton brings arXiv and OpenAlex results into one search flow, ranks papers with visible criteria, and uses Gemini to help readers summarize and explore the literature.",
    role: "Team Leader & Backend Developer",
    timeline: "3 months",
    team: "Lead of 3-student engineering team",
    year: "2025",
    color: "#191510",
    ink: "#ffffff",
    hero: "/projects/Krypton-home.png",
    homeHero: "/projects/Krypton-home.png",
    problem:
      "A literature search can scatter useful papers across sources and leave readers without a clear reason for the order of results.",
    personalContribution:
      "I led a three-student team and worked on the FastAPI search pipeline, the weighted ranking service, result caching, and Gemini-assisted paper insights. The default rank combines 40% text relevance, 30% recency, and 30% citation score.",
    features: [
  "Search arXiv and OpenAlex from one interface.",
  "Rank results using relevance, recency, and citation signals.",
  "Show paper summaries and structured research insights.",
  "Save user profiles, interests, and search history.",
  "Suggest topics and reading paths based on a research goal.",
  "Cache repeated external requests to reduce unnecessary API calls."
],
    technicalHighlights: [
  "Implemented a weighted ranking service with a 40/30/30 default formula.",
  "Combined arXiv and OpenAlex search results in a FastAPI pipeline.",
  "Added citation enrichment, caching, and user-aware score adjustments.",
  "Connected Gemini-assisted summaries to the paper exploration flow."
],
    tradeoffs: [
  {
    "decision": "Readable ranking signals over an opaque score",
    "rationale": "Relevance, recency, and citations give readers a clearer reason for where a paper appears."
  },
  {
    "decision": "Combine sources before ranking",
    "rationale": "Searching multiple academic indexes in one flow broadens discovery while keeping one results list."
  },
  {
    "decision": "Grounded AI assistance with source links",
    "rationale": "Generated summaries are presented alongside source papers so readers can check the underlying research."
  }
],
    challenge:
      "A useful paper search has to merge results from different APIs, handle missing citation data, and make ranking understandable to the person reading it.",
    approach:
      "The backend searches arXiv and OpenAlex, enriches citation data, and scores results with TF-IDF relevance, publication recency, and citation counts. Personalization can adjust the weights for a reader’s interests and goals.",
    results:
      "Krypton won first place at the university Project Expo. The live product offers multi-source search, transparent ranking, paper summaries, and a reading-plan interface.",
    categorizedTech: [
  {
    "category": "Frontend",
    "items": [
      "React",
      "Tailwind CSS",
      "Framer Motion"
    ]
  },
  {
    "category": "Search Backend",
    "items": [
      "FastAPI",
      "Python",
      "scikit-learn",
      "SQLAlchemy"
    ]
  },
  {
    "category": "Research & AI APIs",
    "items": [
      "arXiv API",
      "OpenAlex API",
      "Google Gemini API"
    ]
  },
  {
    "category": "Data & Delivery",
    "items": [
      "SQLite",
      "TTL Cache",
      "Docker"
    ]
  }
],
    technologies: [
  "React",
  "FastAPI",
  "Python",
  "scikit-learn",
  "arXiv API",
  "OpenAlex API",
  "Google Gemini API",
  "SQLite"
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
  {
    "value": "1st",
    "label": "PROJECT EXPO"
  },
  {
    "value": "3",
    "label": "RANKING SIGNALS"
  },
  {
    "value": "2",
    "label": "PAPER SOURCES"
  }
],
    source: "https://github.com/Jayant-1/Krypton",
    demo: "https://krypton.jayantpotdar.in/",
  },
  {
    slug: "3d-portfolio",
    number: "03",
    title: "3D Portfolio",
    tagline: "A space-themed portfolio built as an interactive experience",
    date: "Jul 2025",
    category: ["3D GRAPHICS", "CREATIVE TECH", "PERFORMANCE"],
    ownership: "Solo Developer",
    summary:
      "My first 3D portfolio brings together React, Three.js, React Three Fiber, and a Spline skills keyboard in a responsive space-themed website.",
    role: "Solo Creative Frontend Developer",
    timeline: "3 weeks",
    team: "Solo build",
    year: "2025",
    color: "#4338ca",
    ink: "#ffffff",
    hero: "/projects/3d-portfolio-home.png",
    homeHero: "/projects/3d-portfolio-home.png",
    problem:
      "I wanted a portfolio that let people experience my interest in creative engineering, rather than only read a list of skills.",
    personalContribution:
      "I built the site independently: Three.js scenes, particle effects, the Spline skills keyboard, animated project sections, contact flow, and mobile adaptations. I tuned canvas pixel ratios and loading behavior for smaller devices.",
    features: [
  "Explore interactive Three.js scenes and a particle starfield.",
  "Use the Spline-powered skills keyboard on desktop.",
  "Browse projects, skills, achievements, and contact information.",
  "See a lighter skills experience on mobile.",
  "Move through animated sections built with GSAP and Framer Motion.",
  "Use responsive layouts and touch-friendly navigation."
],
    technicalHighlights: [
  "Built desktop and Earth scenes with React Three Fiber.",
  "Integrated a Spline keyboard with hover-driven skill content.",
  "Tuned canvas pixel ratios for desktop and mobile devices.",
  "Combined animations, project cards, and contact into one responsive experience."
],
    tradeoffs: [
  {
    "decision": "3D scenes with a mobile fallback",
    "rationale": "Desktop visitors can explore the full spatial experience while mobile visitors retain a usable, lighter path through the content."
  },
  {
    "decision": "Device-aware canvas rendering",
    "rationale": "Lower pixel ratios on mobile reduce the graphics work required for each frame."
  },
  {
    "decision": "Motion in service of navigation",
    "rationale": "Section transitions and hover responses reinforce the portfolio story without hiding the underlying content."
  }
],
    challenge:
      "3D scenes can be visually engaging while still slowing a page or trapping touch gestures on mobile.",
    approach:
      "I combined React Three Fiber scenes with a Spline keyboard, used motion selectively throughout the page, and set lower canvas pixel ratios on mobile. A simpler keycap experience supports smaller screens.",
    results:
      "The deployed site is a working creative portfolio with interactive 3D scenes, motion-led navigation, projects, achievements, skills, and a contact flow.",
    categorizedTech: [
  {
    "category": "3D & Graphics",
    "items": [
      "Three.js",
      "React Three Fiber",
      "@react-three/drei",
      "Spline"
    ]
  },
  {
    "category": "Frontend & Motion",
    "items": [
      "React",
      "JavaScript",
      "GSAP",
      "Framer Motion",
      "Tailwind CSS"
    ]
  },
  {
    "category": "Build & Delivery",
    "items": [
      "Vite",
      "Vercel",
      "Git & GitHub"
    ]
  }
],
    technologies: [
  "React",
  "Three.js",
  "React Three Fiber",
  "Spline",
  "GSAP",
  "Framer Motion",
  "Tailwind CSS",
  "Vite"
],
    images: [
      "/projects/3d-portfolio-home.png",
      "/projects/3d-portfolio-skills.png",
      "/projects/3d-portfolio-about.png",
      "/projects/3d-portfolio-contact.png",
      "/projects/3d-portfolio-projects.png",
      "/projects/3d-portfolio-achievements.png",
    ],
    outcomes: [
  {
    "value": "3D",
    "label": "INTERACTIVE SCENES"
  },
  {
    "value": "Spline",
    "label": "SKILLS KEYBOARD"
  },
  {
    "value": "Mobile",
    "label": "ADAPTIVE EXPERIENCE"
  }
],
    source: "https://github.com/Jayant-1/3D-Portfolio",
    demo: "https://jayant-1.vercel.app/",
  },
  {
    slug: "malaria-detection",
    number: "04",
    title: "Malaria Detection System",
    tagline: "An AI-assisted blood-smear screening prototype",
    date: "Apr 2026",
    category: ["HEALTHCARE AI", "COMPUTER VISION", "FULL STACK"],
    ownership: "Team Leader",
    summary:
      "A team-built prototype that connects image-based malaria screening with patient records, role-based dashboards, and downloadable reports. It has not been clinically validated.",
    role: "Team Leader & Full Stack Developer",
    timeline: "2 months",
    team: "Student engineering team",
    year: "2026",
    color: "#0284c7",
    ink: "#ffffff",
    hero: "/projects/malariadetectionsystem-home.png",
    homeHero: "/projects/malariadetectionsystem-home.png",
    problem:
      "Reviewing blood-smear images and managing test records are separate steps in many workflows. Our team explored how software could bring them into one interface.",
    personalContribution:
      "I led the team building the prototype and contributed to its React dashboard, FastAPI inference flow, patient and report workflows, and integration with Supabase. The model result is presented as a research demonstration, not a clinical diagnosis.",
    features: [
  "Upload a cell image for prototype model inference.",
  "Manage patient records and test results in role-specific views.",
  "Generate and download PDF reports.",
  "Review analytics and activity in the dashboard.",
  "Use doctor, patient, and administrator flows.",
  "Store application data through Supabase and PostgreSQL."
],
    technicalHighlights: [
  "Connected a Keras inference model to FastAPI endpoints.",
  "Built patient and report flows in a React dashboard.",
  "Used Supabase authentication and database services.",
  "Designed the result view to show the model output within a broader record workflow."
],
    tradeoffs: [
  {
    "decision": "Prototype screening rather than clinical diagnosis",
    "rationale": "The model and interface demonstrate a workflow; they have not been clinically validated and cannot replace a qualified medical assessment."
  },
  {
    "decision": "Separate inference API from the dashboard",
    "rationale": "FastAPI handles model loading and prediction while the React application manages user tasks and records."
  },
  {
    "decision": "Role-specific views for the same workflow",
    "rationale": "Doctor, patient, and administrator screens expose the information each role needs."
  }
],
    challenge:
      "The product needed a clear way to move from an uploaded cell image to a model output and an associated patient record, while making the limits of the prototype visible.",
    approach:
      "The React interface handles doctor, patient, and administrator views. FastAPI loads a Keras model for image inference, while Supabase supports account and data workflows. The application can generate and share PDF reports.",
    results:
      "The live prototype demonstrates an end-to-end image analysis and report workflow. It is a student software project and has not been tested or approved for clinical use.",
    categorizedTech: [
  {
    "category": "Frontend & UI",
    "items": [
      "React",
      "Tailwind CSS",
      "Vite",
      "Recharts"
    ]
  },
  {
    "category": "Backend & Model",
    "items": [
      "FastAPI",
      "Python",
      "Keras",
      "TensorFlow"
    ]
  },
  {
    "category": "Data & Reports",
    "items": [
      "Supabase",
      "PostgreSQL",
      "jsPDF"
    ]
  }
],
    technologies: [
  "React",
  "FastAPI",
  "Supabase",
  "Keras",
  "Python",
  "Tailwind CSS",
  "jsPDF"
],
    images: [
      "/projects/malariadetectionsystem1.png",
      "/projects/malariadetectionsystem2.jpg",
    ],
    outcomes: [
  {
    "value": "Team",
    "label": "LEADERSHIP"
  },
  {
    "value": "3 roles",
    "label": "WORKFLOW VIEWS"
  },
  {
    "value": "PDF",
    "label": "REPORT FLOW"
  }
],
    source: "https://github.com/Jayant-1/MalariaDetectionSystem",
    demo: "https://malariadetectionsystem.jayantpotdar.in/",
  },
  {
    slug: "neuralnet",
    number: "05",
    title: "NeuralNet",
    tagline: "Design neural networks visually and generate Keras code",
    date: "Oct 2025",
    category: ["VISUAL TOOLING", "ML", "SYSTEMS"],
    ownership: "Team Leader",
    summary:
      "NeuralNet is a visual model-building prototype. Users connect layers in a React canvas and turn the graph into inspectable Keras code. The current hosted training view uses simulated metrics.",
    role: "Team Leader & Full Stack Developer",
    timeline: "3 months",
    team: "Lead of 3-student engineering team",
    year: "2025",
    color: "#f7c948",
    ink: "#191510",
    hero: "/projects/neuralnet-home.png",
    homeHero: "/projects/neuralnet-home.png",
    problem:
      "A model architecture written only in code can be hard to understand before its layers and connections are visible.",
    personalContribution:
      "I led a three-student team building the graph editor and backend compiler. The React Flow canvas captures layer connections, and a FastAPI service topologically sorts the graph before generating Keras Python code.",
    features: [
  "Create model architectures with drag-and-drop layer nodes.",
  "Connect layers and inspect the graph visually.",
  "Generate Keras Python code from graph data.",
  "Explore built-in dataset and upload interfaces.",
  "Preview a training workflow with simulated metrics in the hosted demo.",
  "Explore deployment and prediction interfaces as prototype flows."
],
    technicalHighlights: [
  "Built a React Flow editor for visual layer composition.",
  "Implemented topological sorting and AST-based Keras code generation.",
  "Created dataset, training, and deployment interface flows.",
  "Made the current demo state clear: hosted training metrics are simulated."
],
    tradeoffs: [
  {
    "decision": "Generated source code over runtime evaluation",
    "rationale": "An AST-based compiler creates code visitors can inspect and export instead of executing arbitrary graph text."
  },
  {
    "decision": "Graph validation before training",
    "rationale": "Topological sorting catches cycles and gives layers a reliable generation order."
  },
  {
    "decision": "Demonstration mode for hosted training",
    "rationale": "The current deployed route simulates training metrics to avoid the cost of running TensorFlow on its hosting tier."
  }
],
    challenge:
      "A visual graph must reject invalid connections and produce code in a consistent order without relying on unsafe runtime evaluation.",
    approach:
      "The editor stores layers and connections as graph data. The backend checks their order and generates Python source through an AST-based compiler. The current deployed training screen demonstrates the intended workflow with simulated metrics.",
    results:
      "The live prototype supports visual architecture design and Keras code generation. Training and deployment are represented in the interface, but the hosted training route currently runs in mock mode.",
    categorizedTech: [
  {
    "category": "Graph Editor",
    "items": [
      "React",
      "XYFlow / React Flow",
      "JavaScript",
      "Tailwind CSS"
    ]
  },
  {
    "category": "Backend & Compiler",
    "items": [
      "FastAPI",
      "Python",
      "AST Code Generation",
      "Topological Sort"
    ]
  },
  {
    "category": "Prototype Flows",
    "items": [
      "Dataset UI",
      "Training Preview",
      "Deployment UI"
    ]
  }
],
    technologies: [
  "React",
  "XYFlow",
  "FastAPI",
  "Python",
  "Keras Code Generation",
  "Tailwind CSS"
],
    images: [
      "/projects/neuralnet1.png",
      "/projects/neuralnet2.png",
      "/projects/neuralnet3.png",
      "/projects/neuralnet4.png",
    ],
    outcomes: [
  {
    "value": "Graph",
    "label": "VISUAL BUILDER"
  },
  {
    "value": "AST",
    "label": "CODE GENERATION"
  },
  {
    "value": "Demo",
    "label": "TRAINING PREVIEW"
  }
],
    source: "https://github.com/Jayant-1/NeuralNet",
    demo: "https://neuralnet.jayantpotdar.in/",
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

export const notes: Note[] = [];

export const experienceItems = [
  {
    role: "Head of Web Development",
    organization: "TechSpark Technical Club, MSSU Pune",
    period: "2025 to Present",
    type: "Leadership & Engineering",
    highlights: [
      "Lead the club's web initiatives and help ship sites and tools for university events.",
      "Mentor student developers on React, Git workflows, and deployment.",
      "Organize engineering workshops and collaborate with event teams on their digital presence.",
    ],
  },
  {
    role: "Web Development Co-Head",
    organization: "TechSpark Technical Club, MSSU Pune",
    period: "2024 to 2025",
    type: "Club Leadership",
    highlights: [
      "Co-led the club's web work and contributed to event pages and promotional tools.",
      "Helped students get started with HTML, CSS, JavaScript, and React.",
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
    year: "2026",
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
