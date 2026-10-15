// First-person build notes shown in the existing carousel.
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
    id: "astropixel-note",
    name: "AstroPixel",
    role: "Solo build",
    company: "Jayant Potdar",
    avatar: "/projects/astroPixel-home.png",
    type: "peer",
    quote: "The hardest part was making huge images feel immediate. I kept adjusting the GDAL tile pipeline and viewer until zooming requested only the image detail on screen.",
    highlight: "GDAL tile pipeline and deep-zoom viewer",
    accentColor: "var(--ca-yellow)",
    tapeColor: "var(--ca-yellow-soft)",
    tapeAngle: -6,
  },
  {
    id: "krypton-note",
    name: "Krypton",
    role: "Team lead",
    company: "Jayant Potdar",
    avatar: "/projects/Krypton-home.png",
    type: "peer",
    quote: "For academic search, a useful answer needs a trail back to the source. I led a workflow that ranks papers by relevance, recency, and citations before the AI-assisted reading step.",
    highlight: "Traceable literature search",
    accentColor: "var(--ca-cyan)",
    tapeColor: "var(--ca-cyan)",
    tapeAngle: 4,
  },
  {
    id: "portfolio-note",
    name: "3D Portfolio",
    role: "Solo build",
    company: "Jayant Potdar",
    avatar: "/projects/3d-portfolio-home.png",
    type: "peer",
    quote: "I wanted the interface to feel playful without losing usability. The 3D scene, keyboard interaction, and device-aware rendering each had to earn their place.",
    highlight: "Interactive 3D interface",
    accentColor: "var(--ca-mint)",
    tapeColor: "var(--ca-mint)",
    tapeAngle: -4,
  },
  {
    id: "malaria-note",
    name: "Malaria Detection System",
    role: "Team lead",
    company: "Jayant Potdar",
    avatar: "/projects/malariadetectionsystem-home.png",
    type: "peer",
    quote: "I led the team in connecting the image upload experience to a Keras inference API. We treated it as a student prototype, with clinical validation still outside its scope.",
    highlight: "Image inference prototype",
    accentColor: "var(--ca-pink-soft)",
    tapeColor: "var(--ca-pink-soft)",
    tapeAngle: 6,
  },
  {
    id: "neuralnet-note",
    name: "NeuralNet",
    role: "Team lead",
    company: "Jayant Potdar",
    avatar: "/projects/neuralnet-home.png",
    type: "peer",
    quote: "The interesting problem was turning a visual graph into valid Keras code. The current demo explores that compiler flow; its training display uses simulated progress.",
    highlight: "Visual graph-to-code prototype",
    accentColor: "var(--ca-purple)",
    tapeColor: "var(--ca-purple)",
    tapeAngle: -7,
  },
];
