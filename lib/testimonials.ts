export type TestimonialType = "client" | "peer";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  type: TestimonialType;
  project?: string;
  quote: string;
  highlight: string;
  rating?: number;
  accentColor: string;
  tapeColor: string;
  tapeAngle: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "Founder & CEO",
    company: "GeoRaster Analytics",
    avatar: "/testimonials/avatar-priya.jpg",
    type: "client",
    project: "AstroPixel Geospatial Engine",
    quote:
      "Jayant re-engineered our gigapixel raster viewport from the ground up. Handling 100MB+ satellite images without dropping a single frame felt impossible until his custom tiling pipeline shipped. Absolute engineering powerhouse.",
    highlight: "100MB+ gigapixel rasters rendered at steady 60fps",
    rating: 5,
    accentColor: "var(--ca-yellow)",
    tapeColor: "var(--ca-yellow-soft)",
    tapeAngle: -6,
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Head of Product & Design",
    company: "Studio Apex",
    avatar: "/testimonials/avatar-marcus.jpg",
    type: "client",
    project: "Interactive Brand Systems",
    quote:
      "A rare developer who obsesses over 60fps tactile micro-interactions as deeply as scalable architecture. He doesn't just build to specs — he elevated our entire product experience with authentic analog warmth.",
    highlight: "Crafted bespoke tactile UI with zero design compromises",
    rating: 5,
    accentColor: "var(--ca-cyan)",
    tapeColor: "var(--ca-cyan)",
    tapeAngle: 7,
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Co-Founder",
    company: "NeuralFlow Labs",
    avatar: "/testimonials/avatar-elena.jpg",
    type: "client",
    project: "Visual Neural Network Editor",
    quote:
      "Our interactive node graph editor required extreme DOM rendering speed and topological math. Jayant delivered a zero-dependency canvas engine ahead of deadline, with clean modular TypeScript code our team loves.",
    highlight: "Zero-dependency node canvas engine delivered ahead of schedule",
    rating: 5,
    accentColor: "var(--ca-magenta)",
    tapeColor: "var(--ca-pink-soft)",
    tapeAngle: -5,
  },
  {
    id: "rohit-sharma",
    name: "Rohit Sharma",
    role: "Event Co-Lead",
    company: "TechSpark Technical Club",
    avatar: "/testimonials/avatar-david.jpg",
    type: "peer",
    project: "Pixel Perfection Hackathon",
    quote:
      "Co-leading the flagship hackathon with Jayant was seamless. He directed the problem statements, evaluated 100+ active student builds, and solved live platform bottlenecks with absolute calm. A true leader on campus.",
    highlight: "Directed 100+ hackathon participants and problem tracks",
    rating: 5,
    accentColor: "var(--ca-blue)",
    tapeColor: "var(--ca-cyan)",
    tapeAngle: 6,
  },
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Full-Stack Engineer",
    company: "Open Source Collaborator",
    avatar: "/testimonials/avatar-rohan.jpg",
    type: "peer",
    project: "Full-Stack Tooling & Services",
    quote:
      "Working on backend architecture with Jayant is always a masterclass. His API contracts are predictable, TypeScript typing is airtight, and his intuition for performance bottlenecks saved us hours of debugging.",
    highlight: "Airtight TypeScript architecture and predictable API contracts",
    rating: 5,
    accentColor: "var(--ca-mint)",
    tapeColor: "var(--ca-mint)",
    tapeAngle: -7,
  },
  {
    id: "ananya-deshmukh",
    name: "Ananya Deshmukh",
    role: "AI Research Peer",
    company: "MSSU Pune",
    avatar: "/testimonials/avatar-ananya.jpg",
    type: "peer",
    project: "Academic Paper Ranker",
    quote:
      "Jayant has an incredible knack for translating complex algorithmic papers into fast, interactive software. His work on TF-IDF citation graph traversal was remarkably fast and mathematically rigorous.",
    highlight: "Mathematically rigorous TF-IDF graph traversal algorithm",
    rating: 5,
    accentColor: "var(--ca-yellow)",
    tapeColor: "var(--ca-yellow-soft)",
    tapeAngle: 5,
  },
];
