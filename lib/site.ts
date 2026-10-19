export const siteUrl = "https://jayant.codes";
export const email = "jayantpotdar2006@gmail.com";

export const author = {
  name: "Jayant Potdar",
  legalName: "Jayant Sunil Potdar",
  role: "Full Stack Developer",
  secondaryRole: "Design Engineer",
  location: "Pune, India",
  fullLocation: "Pune, Maharashtra, India",
  college: "Ratan Tata Maharashtra State Skills University (MSSU), Pune",
  degree: "B.Tech in Computer Science & Engineering",
  graduationYear: "2024–2028",
  cgpa: "8.0",
  headline: "Creative full stack developer building expressive, production-ready web products in Pune.",
  summary:
    "I'm Jayant Potdar, a full stack developer in Pune. I design expressive interfaces and build the systems behind them. I built AstroPixel independently and led teams on Krypton, Malaria Detection System, and NeuralNet. I'm seeking internships and full-time roles, and I'm open to hybrid/remote work and relevant projects.",
  openToWork:
    "Seeking internships and full-time roles; open to hybrid/remote work and relevant projects. Email me to arrange a call.",
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
  headline: string;
  seoDescription: string;
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
  demoLabel?: string;
  demoQualifier?: string;
  limitations?: string;
  relatedNoteSlug?: string;
};

export function isDarkProjectHero(slug?: string): boolean {
  if (!slug) return true;
  // Malaria Detection System has a bright white/cream UI hero card
  if (slug === "malaria-detection" || slug === "light") {
    return false;
  }
  // All other engineering projects (AstroPixel, Krypton, 3D Portfolio, NeuralNet) have dark backgrounds
  return true;
}

export const projects: Project[] = [
  {
    slug: "astropixel",
    number: "01",
    title: "AstroPixel",
    headline: "Space, Pixel by Pixel",
    seoDescription: "I built AstroPixel to turn large astronomical images into browser-ready tiles, with deep zoom, annotations, and dataset management. Explore my case study.",
    tagline: "I turned large space images into an explorable web experience.",
    date: "Mar 2026",
    category: ["SPATIAL IMAGERY", "FULL STACK", "PERFORMANCE"],
    ownership: "Solo Full Stack Project",
    summary:
      "Large astronomical images are difficult to share at their original detail. I built AstroPixel so an educator or space enthusiast can open a dataset, zoom into a small feature, and mark what they find. The application connects image processing, tiled viewing, and annotations in one browser workflow.",
    role: "Solo Full Stack Developer",
    timeline: "4 months",
    team: "Solo build",
    year: "2026",
    color: "#2b57d6",
    ink: "#ffffff",
    hero: "/projects/astroPixel-home.png",
    homeHero: "/projects/astroPixel-home.png",
    problem:
      "How do you explore a huge space image without downloading the whole file? I built AstroPixel to turn it into zoomable tiles, with annotations that keep discoveries connected to their place in the image.",
    personalContribution:
      "I built the application independently: the React explorer, background image processing, FastAPI endpoints, annotation workflow, access controls, and optional Cloudflare R2 integration. My most demanding work was coordinating processing and delivery so the viewer received correctly positioned tiles at each zoom level.",
    features: [
      "Upload supported TIFF, GeoTIFF, PSD, and PSB imagery for processing.",
      "Pan and zoom through processed image tiles in the browser.",
      "Keep annotations attached to positions within an image.",
      "Browse datasets and inspect their metadata.",
      "Manage uploads and datasets through user and administrator flows.",
      "Use local tile storage or configure Cloudflare R2."
    ],
    technicalHighlights: [
      "I connected background tile generation to dataset status and processing progress.",
      "I used windowed raster reads and fallback processing paths for large source files.",
      "I joined OpenSeadragon viewing with persistent image-space annotations.",
      "I added tile delivery through local storage and optional Cloudflare R2 integration."
    ],
    tradeoffs: [
      {
        "decision": "Alternatives: a file download or a viewer library",
        "rationale": "A download gives someone the source image but leaves exploration to their own tools. OpenSeadragon provides a strong deep-zoom foundation. I built the workflow around that foundation so uploading, organizing, viewing, and annotating imagery can happen within the same application."
      },
      {
        "decision": "My USP: detail with context",
        "rationale": "I connected multiresolution viewing with persistent image-space annotations. A visitor can move from the whole scene to a small feature while keeping notes attached to the right location. That combination makes AstroPixel useful for presenting and discussing detailed imagery."
      },
      {
        "decision": "What I learned: fast must also be correct",
        "rationale": "Repeated attempts taught me to follow the entire path from source image to visible tile. Missing tiles, mismatched zoom levels, or incorrect positioning can spoil an otherwise quick viewer. I learned to balance memory, processing time, and complete tile delivery together."
      }
    ],
    challenge:
      "Sharing a reduced image makes the detail harder to inspect; sharing the original makes the reader handle a large file. I wanted educators and space enthusiasts to explore both the overall scene and its smaller features through a web link. Annotations make that exploration useful for explaining an observation or returning to it later.",
    approach:
      "I prepare each image as a pyramid of tiles at different resolutions. The browser requests the pieces needed for its current view, while FastAPI manages processing progress, dataset records, and delivery. I use OpenSeadragon for navigation, Rasterio and Pillow in the processing pipeline, and image-space coordinates to keep annotations aligned while zooming.",
    results:
      "I brought image upload, background processing, deep zoom, annotations, and dataset administration into one application. AstroPixel earned third place at Ideation Competition 3.0. Images need to finish processing before they can be explored; supported file sizes depend on the available processing resources.",
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
        "category": "Backend & Images",
        "items": [
          "FastAPI",
          "Python",
          "Rasterio / GDAL",
          "Pillow",
          "SQLAlchemy"
        ]
      },
      {
        "category": "Storage & Delivery",
        "items": [
          "SQLite / PostgreSQL",
          "Cloudflare R2 support",
          "Docker"
        ]
      }
    ],
    technologies: [
      "React",
      "FastAPI",
      "Python",
      "Rasterio / GDAL",
      "Pillow",
      "OpenSeadragon",
      "SQLAlchemy",
      "Cloudflare R2"
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
    demo: "https://astropixel.jayant.codes/",
    demoLabel: "Explore AstroPixel",
    demoQualifier: "Public explorer; deep zoom requires an available processed dataset",
    limitations:
      "Source images need processing before they can be explored. The public explorer showed no available datasets during this review; R2 delivery depends on deployment configuration.",
  },
  {
    slug: "krypton",
    number: "02",
    title: "Krypton",
    headline: "Find Your Next Paper",
    seoDescription: "I led Krypton, combining arXiv and OpenAlex search with weighted ranking and abstract summaries. See the problem, my contribution, and the tradeoffs.",
    tagline: "I built a clearer route from a research topic to a reading list.",
    date: "Nov 2025",
    category: ["RESEARCH TOOLS", "AI / ML", "FULL STACK"],
    ownership: "Team Leader",
    summary:
      "Starting a literature review means deciding which papers deserve your attention. I led Krypton to help students make that first selection: search arXiv and OpenAlex together, rank results using explicit criteria, and read an abstract-based summary before opening the source paper.",
    role: "Team Leader & Backend Architect",
    timeline: "3 months",
    team: "Lead of 3-student engineering team",
    year: "2025",
    color: "#191510",
    ink: "#ffffff",
    hero: "/projects/Krypton-home.png",
    homeHero: "/projects/Krypton-home.png",
    problem:
      "A new research topic can leave you with dozens of tabs and no clear starting point. I led Krypton to bring paper discovery, ranking, and abstract summaries into one place, helping readers choose what to investigate next.",
    personalContribution:
      "I led the team and built the search backend: concurrent source requests, TF-IDF ranking, citation normalization, preference-aware scoring, and cached search results. I integrated Gemini summaries and connected these services to the paper-discovery flow. My focus was making the pipeline understandable and its ranking choices inspectable.",
    features: [
      "Search arXiv and OpenAlex through one backend pipeline.",
      "Order papers using relevance, recency, and citation signals.",
      "Adjust ranking around reader interests and recency preferences.",
      "Request abstract-based summaries and research insights.",
      "Explore search history, reader profiles, and a reading-plan interface.",
      "Reuse cached search results when they are available."
    ],
    technicalHighlights: [
      "I combined concurrent arXiv and OpenAlex requests with failure-tolerant result handling.",
      "I implemented TF-IDF relevance, recency, and logarithmic citation scoring.",
      "I added preference-aware weights and memory/database search caching.",
      "I integrated Gemini summaries using paper abstracts as context."
    ],
    tradeoffs: [
      {
        "decision": "Alternatives: Semantic Scholar and Elicit",
        "rationale": "Semantic Scholar offers research discovery and several sorting options; Elicit adds AI-assisted research workflows. I focused Krypton on an inspectable implementation that combines two sources and a readable ranking formula. Its distinction is the specific workflow and scoring choices I built, rather than a claim of broader coverage or better search accuracy."
      },
      {
        "decision": "My USP: a reading order with a rationale",
        "rationale": "I combine topic relevance, recency, and citation influence into one score while retaining the individual signals. The code makes those choices visible and supports preference-based weighting. That gives the reading list an explicit rationale that can be examined and adjusted."
      },
      {
        "decision": "What I learned: a score expresses a priority",
        "rationale": "Older papers have had longer to accumulate citations, while newer work may be more relevant to an emerging topic. I learned why these signals need normalization and why the weights matter. I treat the ranking as a reading aid, with source checking as part of the workflow."
      }
    ],
    challenge:
      "Students entering an unfamiliar subject need a manageable starting list and enough context to judge each paper. I wanted to bring discovery and initial reading decisions into the same workflow. The value is a clearer path from a broad question to individual sources that deserve closer attention.",
    approach:
      "I query arXiv and OpenAlex concurrently, enrich the results with citation data, and score the combined list. The default formula uses 40% text relevance, 30% recency, and 30% normalized citation influence; reader interests can change those weights. Gemini summarizes the available abstract, and paper links lead back to the original research.",
    results:
      "Our team won first place at the university Project Expo. I built a backend that brings retrieval, enrichment, ranking, caching, and summaries together, alongside the research interface. Summaries are based on available abstracts, so readers still need the original papers to assess methods, evidence, and limitations.",
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
    demo: "https://krypton.jayant.codes/",
    demoLabel: "Explore Krypton",
    demoQualifier: "Public research interface; search and summaries require the backend",
    limitations:
      "Search depends on the external paper sources and an available backend. The public demo reported its backend offline during this review. Generated summaries use abstracts and need checking against the original paper.",
  },
  {
    slug: "3d-portfolio",
    number: "03",
    title: "3D Portfolio",
    headline: "My Skills in Motion",
    seoDescription: "I built a 3D portfolio with React Three Fiber, a Spline skills keyboard, and a separate mobile experience. Explore my interaction and rendering decisions.",
    tagline: "I made my portfolio an example of the interaction work I can build.",
    date: "Jul 2025",
    category: ["3D GRAPHICS", "CREATIVE TECH", "PERFORMANCE"],
    ownership: "Solo Developer",
    summary:
      "I wanted recruiters and creative clients to experience my frontend skills directly. I built a space-themed portfolio where visitors rotate a workstation, explore a skills keyboard, and browse my projects. On mobile, a tappable skills grid carries the same information in a form suited to touch.",
    role: "Solo Creative Frontend Developer",
    timeline: "3 weeks",
    team: "Solo build",
    year: "2025",
    color: "#4338ca",
    ink: "#ffffff",
    hero: "/projects/3d-portfolio-home.png",
    homeHero: "/projects/3d-portfolio-home.png",
    problem:
      "How do I show the interaction skills behind a résumé? I built a portfolio visitors can explore: a rotatable workstation, a 3D skills keyboard, and a dedicated mobile skills view, all connected to my work.",
    personalContribution:
      "I built the portfolio independently, connecting the 3D scenes, Spline keyboard events, project cards, motion, and contact flow. I also created the mobile skills grid, its category filters, and the screen-specific rendering settings. The work brought visual design and frontend engineering into one deliverable.",
    features: [
      "Rotate the workstation scene and explore the space-themed page.",
      "Reveal skill information through the desktop Spline keyboard.",
      "Browse skills with tappable keycaps and categories on mobile.",
      "Open project details and follow source-code links.",
      "Browse achievements and access my résumé.",
      "Reach my contact form and public profiles."
    ],
    technicalHighlights: [
      "I integrated workstation, Earth, and particle scenes with React Three Fiber.",
      "I connected Spline keyboard events to contextual skill information.",
      "I built a mobile skills grid with category filters and tap selection.",
      "I adjusted canvas pixel ratios, shadows, and touch handling by screen size."
    ],
    tradeoffs: [
      {
        "decision": "Alternative: a conventional portfolio",
        "rationale": "A conventional portfolio makes work easy to browse. I wanted mine to also demonstrate the kind of interactive experience a creative client might commission. The workstation and skills keyboard let a visitor try that work directly, while project links and contact details remain part of the page."
      },
      {
        "decision": "My USP: skills you can interact with",
        "rationale": "I connected a 3D keyboard to contextual skill information, turning the skills section into an interaction. On mobile, the same idea becomes a filterable, tappable keycap grid. That connection between visual identity and useful content is the defining part of this build."
      },
      {
        "decision": "What I learned: adapt the interaction",
        "rationale": "A desktop hover interaction does not translate directly to a touch screen. I learned to make separate decisions for pointer input, touch gestures, canvas resolution, and shadows. The goal is to preserve the visitor’s task while choosing an interaction the device can support."
      }
    ],
    challenge:
      "A recruiter needs to find my work and understand my contribution. A client considering an interactive website also needs to see what I can create. I wanted one portfolio to serve both: clear project content alongside working examples of 3D integration, motion, and responsive interaction design.",
    approach:
      "I built the page in React and integrated workstation, Earth, and starfield scenes through React Three Fiber. A Spline keyboard reveals skill information on desktop, with GSAP and Framer Motion supporting the interactions. On mobile, I use tappable DOM keycaps and lighter canvas settings to adapt the experience to touch and smaller screens.",
    results:
      "I published a portfolio that demonstrates interactive frontend work alongside the projects themselves. Visitors can browse my skills, open project details, access my résumé, and contact me. The mobile skills interface preserves access to the content while using a different interaction model from the desktop keyboard.",
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
    demo: "https://3dportfolio.jayant.codes/",
    demoLabel: "Explore My 3D Portfolio",
    demoQualifier: "Interactive portfolio with desktop 3D scenes and a mobile skills layout",
    limitations:
      "WebGL and Spline rendering depend on device capability. I use a DOM skills layout on mobile and lower canvas settings; these choices do not guarantee a particular frame rate.",
  },
  {
    slug: "malaria-detection",
    number: "04",
    title: "Malaria Detection System",
    headline: "From Cell Image to Report",
    seoDescription: "I led an academic malaria-screening prototype connecting image inference, patient records, role-based dashboards, and PDF reports. Not clinically validated.",
    tagline: "I connected a classification model to the workflow around its results.",
    date: "Apr 2026",
    category: ["HEALTHCARE AI", "COMPUTER VISION", "FULL STACK"],
    ownership: "Team Leader",
    summary:
      "An image classifier returns a prediction; an application also needs to keep track of the sample, its record, and its report. I led this academic prototype to connect those steps, combining cell-image inference with role-specific dashboards and PDF reporting. It has not been clinically validated.",
    role: "Team Leader & Full Stack Developer",
    timeline: "2 months",
    team: "Lead of 3-student engineering team",
    year: "2026",
    color: "#0369a1",
    ink: "#ffffff",
    hero: "/projects/malariadetectionsystem-home.png",
    homeHero: "/projects/malariadetectionsystem-home.png",
    problem:
      "What happens after a model classifies a cell image? I led an academic prototype that connects the result to patient records, role-specific dashboards, and a downloadable report, exploring the software around the model.",
    personalContribution:
      "I led the team and worked across the React dashboards, FastAPI inference integration, Supabase account and data flows, and PDF reporting. My contribution focused on connecting the stages of the application so an uploaded sample, model output, stored record, and report could be handled as one workflow.",
    features: [
      "Upload a supported cell image through the detection interface.",
      "Run model inference through the configured backend.",
      "Associate samples and predictions with patient records.",
      "Use doctor, patient, and administrator dashboard views.",
      "Generate PDF reports with result and record details.",
      "Review stored results and reporting workflows."
    ],
    technicalHighlights: [
      "I connected the image-upload flow to FastAPI and Keras inference.",
      "I integrated sample, prediction, and patient-record steps in one workflow.",
      "I built role-specific React views around account and record tasks.",
      "I added PDF reports that combine result details with patient and sample context."
    ],
    tradeoffs: [
      {
        "decision": "Alternative: a classifier-only demo",
        "rationale": "A classifier demo is useful for exploring image prediction. I extended the scope to include sample association, stored results, user roles, and reporting. This gives someone reviewing the project a fuller application workflow to inspect. Clinical diagnostic systems are a different comparison and require evidence this prototype does not have."
      },
      {
        "decision": "My USP: connected records and results",
        "rationale": "I focused on keeping the prediction connected to the sample and patient record, then carrying that context into a report. The combination of inference integration, role-specific screens, and document output is the software contribution that distinguishes this project from an isolated model demonstration."
      },
      {
        "decision": "What I learned: confidence needs context",
        "rationale": "Integrating the model taught me to separate the output of one prediction from evidence about overall model quality. I also learned to treat preprocessing, record association, error handling, and reporting as part of the same system. Those details determine whether a result is understandable and traceable."
      }
    ],
    challenge:
      "A model output on its own does not explain which sample it belongs to or how someone will retrieve it later. I wanted to explore those application requirements around malaria cell-image classification. For a student team building healthcare software, the useful challenge is connecting analysis, records, and reporting into a traceable workflow.",
    approach:
      "I connected the React interface to a FastAPI workflow that accepts an image, associates it with a patient record, runs Keras inference, and stores the prediction. The preprocessing combines RGB, contrast-enhanced RGB, and edge information. Doctor, patient, and administrator views organize the tasks, while jsPDF produces a report from the result and its record context.",
    results:
      "Our team built the upload interface, inference integration, role-specific record views, and PDF report generation. The project demonstrates how a model can sit inside a larger software workflow. I present it as an academic prototype for review and learning; it is not intended for diagnosis or treatment decisions.",
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
        "category": "Backend & Images",
        "items": [
          "FastAPI",
          "Python",
          "Keras / TensorFlow",
          "OpenCV"
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
      "PostgreSQL",
      "Keras / TensorFlow",
      "OpenCV",
      "Python",
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
    demo: "https://malariadetection.jayant.codes/",
    demoLabel: "Explore the Prototype",
    demoQualifier: "Academic software prototype; not clinically validated",
    limitations:
      "This is an academic prototype with no clinical validation. I do not claim diagnostic accuracy, healthcare compliance, or suitability for patient-care decisions.",
  },
  {
    slug: "neuralnet",
    number: "05",
    title: "NeuralNet",
    headline: "Draw a Network. Get the Code.",
    seoDescription: "I led NeuralNet, a visual neural-network editor with Keras code generation and export. Explore the compiler and its scope; training output is simulated.",
    tagline: "I built a visual bridge between model architecture and Python.",
    date: "Oct 2025",
    category: ["VISUAL TOOLING", "ML", "SYSTEMS"],
    ownership: "Team Leader",
    summary:
      "Understanding a network diagram and implementing it in code are separate hurdles for an ML learner. I led NeuralNet to connect them: arrange layers, edit their settings, and inspect the generated Python. The core is a visual editor and Keras code generator, with simulated training and prediction flows.",
    role: "Team Leader & Full Stack Developer",
    timeline: "3 months",
    team: "Lead of 3-student engineering team",
    year: "2025",
    color: "#f7c948",
    ink: "#191510",
    hero: "/projects/neuralnet-home.png",
    homeHero: "/projects/neuralnet-home.png",
    problem:
      "A neural-network diagram is easier to discuss when you can see the code behind it. I led NeuralNet to connect draggable layers with inspectable Python, giving learners a starting point they can read, export, and develop further.",
    personalContribution:
      "I led the team and worked on the React Flow editor, graph-to-JSON conversion, topological ordering, and Python AST compiler. I connected layer settings to code generation and helped build the dataset, training, and deployment interfaces around that core. The compiler targets supported sequential architectures.",
    features: [
      "Compose model diagrams with draggable layer nodes and connections.",
      "Edit layer settings through the properties panel.",
      "Preview Keras and PyTorch code in the editor.",
      "Generate Keras source through the backend AST compiler.",
      "Copy or download generated model code.",
      "Explore dataset, training, and deployment screens as prototype flows."
    ],
    technicalHighlights: [
      "I connected React Flow nodes and layer parameters to graph JSON.",
      "I used topological ordering to prepare supported layers for generation.",
      "I built an AST-based generator for Keras Sequential source code.",
      "I integrated code previews and export into the model-building workflow."
    ],
    tradeoffs: [
      {
        "decision": "Alternatives: Playground or handwritten Keras",
        "rationale": "TensorFlow Playground helps learners experiment with a small network. Writing Keras directly gives control over the implementation. I placed NeuralNet between those experiences: arrange the architecture visually, inspect the generated source, and take the code into a separate development environment."
      },
      {
        "decision": "My USP: the diagram has a code counterpart",
        "rationale": "I made the relationship between layer settings and generated Python part of the interface. The backend creates Keras source through an AST, and export gives the learner something they can keep working on. The visual builder serves as an entry point into implementation."
      },
      {
        "decision": "What I learned: valid code is one step",
        "rationale": "I learned to distinguish graph structure, layer order, generated syntax, and a model that can actually execute. Topological sorting helps establish order, but does not validate every tensor shape or branching pattern. That distinction shaped how I describe the compiler and the prototype training workflow."
      }
    ],
    challenge:
      "A learner may understand the idea of inputs, hidden layers, and outputs while still struggling to express an architecture in Python. I wanted to make that translation visible. Seeing layer settings alongside generated code gives the visual editor a practical purpose: helping someone understand what they are building and continue working with the source.",
    approach:
      "I represent the architecture as nodes, connections, and layer parameters. The frontend checks basic graph structure, and the backend orders supported layers before constructing a Python abstract syntax tree for a Keras Sequential model. Code previews and export controls let the learner inspect the result and move their work outside the editor.",
    results:
      "Our team built the visual architecture editor, code previews, export controls, and backend Keras source generator. The implementation demonstrates the path from layer configuration to Python. Training and prediction currently return simulated output; TensorFlow model validation and saved trained models are not part of the active route.",
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
    demo: "https://neuralnet.jayant.codes/",
    demoLabel: "Explore NeuralNet",
    demoQualifier: "Workspace requires sign-in; training and prediction are simulated in the current implementation",
    limitations:
      "The backend compiler targets supported Sequential architectures. TensorFlow model validation is disabled in the compile route; training metrics and prediction outputs are simulated, and the training route does not save a trained model.",
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
