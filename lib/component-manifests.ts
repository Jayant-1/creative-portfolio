export interface LogicalViewport {
  width: number;
  height: number;
}

export interface ExamplePreset {
  id: string;
  name: string;
  thumbnail: string;
  props: Record<string, any>;
  description?: string;
}

export type CustomFieldType = "text" | "color" | "number" | "select";

export interface CustomField {
  key: string;
  label: string;
  type: CustomFieldType;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  placeholder?: string;
  group?: string;
}

export interface ComponentManifest {
  slug: string;
  name: string;
  referenceViewport: {
    desktop: LogicalViewport;
    tablet: LogicalViewport;
    mobile: LogicalViewport;
  };
  examples: [ExamplePreset, ExamplePreset, ExamplePreset];
  fields: CustomField[];
  generateUsageCode: (props: Record<string, any>) => string;
  setupNotes: {
    fonts?: string[];
    styles?: string[];
    assets?: string[];
    notes?: string[];
  };
}

export const COMPONENT_MANIFESTS: Record<string, ComponentManifest> = {
  "overlapping-text-hero": {
    slug: "overlapping-text-hero",
    name: "Overlapping Text Hero",
    referenceViewport: {
      desktop: { width: 1280, height: 800 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 812 },
    },
    examples: [
      {
        id: "spiderman",
        name: "Spider-Man Edition",
        thumbnail: "/components/thumbnails/overlapping-spiderman.png",
        description: "Cinematic crimson palette with Spider-Man cutout and dynamic dual-mask expansion.",
        props: {
          title: "SPIDER-MAN",
          titleStyle: "",
          subTitle1: "FRIENDLY NEIGHBORHOOD",
          subTitle1Color: "#2563eb",
          subTitle2: "WEB-SLINGER",
          subTitle2Color: "#dc2626",
          imgPath: "/sipderman.png",
          textColor: "#dc2626",
          bgColor: "#e2e4e9",
        },
      },
      {
        id: "developer",
        name: "Developer Portfolio",
        thumbnail: "/components/thumbnails/overlapping-developer.png",
        description: "Warm craft aesthetic with Jayant Potdar portrait and terracotta accents.",
        props: {
          title: "JAYANT POTDAR",
          titleStyle: "",
          subTitle1: "B.TECH",
          subTitle1Color: "#db4b29",
          subTitle2: "FULL STACK WEB DEVELOPER",
          subTitle2Color: "#db4b29",
          imgPath: "/Profile-removebg.png",
          textColor: "#db4b29",
          bgColor: "#e3e2dd",
        },
      },
      {
        id: "cyber-noir",
        name: "Cyber Noir Banner",
        thumbnail: "/components/thumbnails/overlapping-cyber-noir.png",
        description: "Dark high-contrast monochrome stage with high-res portrait cutout.",
        props: {
          title: "CREATIVE LAB",
          titleStyle: "",
          subTitle1: "NEXT-GEN INTERFACES",
          subTitle1Color: "#f59e0b",
          subTitle2: "SHADERS & MOTION",
          subTitle2Color: "#64748b",
          imgPath: "/images/jayant-cutout.png",
          textColor: "#0f172a",
          bgColor: "#f1f5f9",
        },
      },
    ],
    fields: [
      { key: "title", label: "Headline Text", type: "text", group: "Typography" },
      { key: "textColor", label: "Headline Color", type: "color", group: "Typography" },
      { key: "bgColor", label: "Background Color", type: "color", group: "Stage" },
      { key: "subTitle1", label: "Subtitle 1 Text", type: "text", group: "Subtitles" },
      { key: "subTitle1Color", label: "Subtitle 1 Color", type: "color", group: "Subtitles" },
      { key: "subTitle2", label: "Subtitle 2 Text", type: "text", group: "Subtitles" },
      { key: "subTitle2Color", label: "Subtitle 2 Color", type: "color", group: "Subtitles" },
      {
        key: "imgPath",
        label: "Cutout Portrait Asset",
        type: "select",
        group: "Stage",
        options: [
          { label: "Spider-Man Cutout (/sipderman.png)", value: "/sipderman.png" },
          { label: "Jayant Profile Cutout (/Profile-removebg.png)", value: "/Profile-removebg.png" },
          { label: "Jayant High-Res Cutout (/images/jayant-cutout.png)", value: "/images/jayant-cutout.png" },
        ],
      },
    ],
    generateUsageCode: (props) => `<OverlappingTextHero
  title="${props.title ?? "SPIDER-MAN"}"
  subTitle1="${props.subTitle1 ?? "FRIENDLY NEIGHBORHOOD"}"
  subTitle1Color="${props.subTitle1Color ?? "#2563eb"}"
  subTitle2="${props.subTitle2 ?? "WEB-SLINGER"}"
  subTitle2Color="${props.subTitle2Color ?? "#dc2626"}"
  imgPath="${props.imgPath ?? "/sipderman.png"}"
  textColor="${props.textColor ?? "#dc2626"}"
  bgColor="${props.bgColor ?? "#e2e4e9"}"
/>`,
    setupNotes: {
      fonts: ["Six Caps (Google Fonts)", "Inter (Google Fonts)"],
      assets: ["Transparent portrait or character PNG with alpha cutout"],
      notes: [
        "Embed within an unencumbered viewport container for accurate scroll height calculation.",
        "Add font-sixCap utility: font-family: Six Caps, sans-serif in your CSS configuration.",
      ],
    },
  },

  "telescope-hero": {
    slug: "telescope-hero",
    name: "Telescope Hero",
    referenceViewport: {
      desktop: { width: 1280, height: 800 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 812 },
    },
    examples: [
      {
        id: "alpine-adventure",
        name: "Alpine Adventure",
        thumbnail: "/components/thumbnails/telescope-alpine.png",
        description: "Original 3D flight through perspective frames into mountain panorama.",
        props: {
          quote: "Life is either a daring adventure or nothing at all",
          bgImage: "/mountains-wallpaper.jpg",
        },
      },
      {
        id: "philosophic-vista",
        name: "Philosophic Vista",
        thumbnail: "/components/thumbnails/telescope-philosophic.png",
        description: "Contemplative typography over mountain horizons.",
        props: {
          quote: "Simplicity is the ultimate sophistication",
          bgImage: "/mountains-wallpaper.jpg",
        },
      },
      {
        id: "cosmic-horizon",
        name: "Cosmic Horizon",
        thumbnail: "/components/thumbnails/telescope-cosmic.png",
        description: "Bold inspirational quote with layered camera zoom.",
        props: {
          quote: "Somewhere, something incredible is waiting to be known",
          bgImage: "/mountains-wallpaper.jpg",
        },
      },
    ],
    fields: [
      { key: "quote", label: "Central Display Quote", type: "text", group: "Content" },
      {
        key: "bgImage",
        label: "Horizon Backdrop Image",
        type: "select",
        group: "Stage",
        options: [
          { label: "Mountains Wallpaper (/mountains-wallpaper.jpg)", value: "/mountains-wallpaper.jpg" },
        ],
      },
    ],
    generateUsageCode: (props) => `<TelescopeHero
  quote="${props.quote ?? "Life is either a daring adventure or nothing at all"}"
  bgImage="${props.bgImage ?? "/mountains-wallpaper.jpg"}"
/>`,
    setupNotes: {
      fonts: ["Bebas Neue (Google Fonts)"],
      styles: ["Tailwind 3D transform utilities: perspective: 300px (perspective-near)"],
      assets: ["Backdrop wallpaper: /mountains-wallpaper.jpg"],
      notes: [
        "Requires standard window or iframe scroll container to map 500vh scroll progress.",
      ],
    },
  },

  "binary-grid": {
    slug: "binary-grid",
    name: "Binary Grid",
    referenceViewport: {
      desktop: { width: 1280, height: 800 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 812 },
    },
    examples: [
      {
        id: "matrix-standard",
        name: "Interactive Matrix",
        thumbnail: "/components/thumbnails/binary-matrix.png",
        description: "Balanced cursor spring aperture revealing authentic binary text.",
        props: {
          circleSize: 60,
          stiffness: 300,
          damping: 30,
        },
      },
      {
        id: "matrix-wide",
        name: "High Velocity Scope",
        thumbnail: "/components/thumbnails/binary-velocity.png",
        description: "Enlarged aperture with high-speed cursor tracking.",
        props: {
          circleSize: 100,
          stiffness: 450,
          damping: 20,
        },
      },
      {
        id: "matrix-tight",
        name: "Tight Precision Pin",
        thumbnail: "/components/thumbnails/binary-precision.png",
        description: "Compact focused lens with damped spring resistance.",
        props: {
          circleSize: 35,
          stiffness: 200,
          damping: 40,
        },
      },
    ],
    fields: [
      { key: "circleSize", label: "Hover Aperture Size (px)", type: "number", min: 20, max: 150, step: 5, group: "Physics" },
      { key: "stiffness", label: "Spring Stiffness", type: "number", min: 50, max: 600, step: 10, group: "Physics" },
      { key: "damping", label: "Spring Damping", type: "number", min: 5, max: 60, step: 1, group: "Physics" },
    ],
    generateUsageCode: () => `// Import companion stylesheet: import "./BinaryGrid.css";
<BinaryGrid />`,
    setupNotes: {
      styles: ["BinaryGrid.css (contains exact 22KB binary content pseudo-element)"],
      notes: [
        "Place inside a relative or absolute container with overflow-hidden.",
      ],
    },
  },

  "bubble-text": {
    slug: "bubble-text",
    name: "Bubble Text",
    referenceViewport: {
      desktop: { width: 1280, height: 800 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 812 },
    },
    examples: [
      {
        id: "bubble-default",
        name: "Standard Proximity",
        thumbnail: "/components/thumbnails/bubble-default.png",
        description: "Original Raleway text with proximity font-weight wave.",
        props: {
          text: "Bbbbbbble text",
        },
      },
      {
        id: "bubble-developer",
        name: "Developer Name",
        thumbnail: "/components/thumbnails/bubble-developer.png",
        description: "Personal portfolio brandmark hover wave.",
        props: {
          text: "Jayant Potdar",
        },
      },
      {
        id: "bubble-motion",
        name: "Motion Craft",
        thumbnail: "/components/thumbnails/bubble-motion.png",
        description: "Display typography demonstrating letter physics.",
        props: {
          text: "Craft & Physics",
        },
      },
    ],
    fields: [
      { key: "text", label: "Display Text", type: "text", group: "Content" },
    ],
    generateUsageCode: (props) => `<BubbleText
  text="${props.text ?? "Bbbbbbble text"}"
/>`,
    setupNotes: {
      fonts: ["Raleway weights 100-900 (Google Fonts)"],
      notes: [
        "Utilizes font-weight transitions: distance 0 (900), +-1 (700), +-2 (500), rest (100).",
      ],
    },
  },

  "magnetic-button": {
    slug: "magnetic-button",
    name: "Magnetic Button",
    referenceViewport: {
      desktop: { width: 1280, height: 800 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 812 },
    },
    examples: [
      {
        id: "magnetic-smooth",
        name: "Smooth Default",
        thumbnail: "/components/thumbnails/magnetic-smooth.png",
        description: "Balanced spring physics with dashed hover frame.",
        props: {
          children: "Hover Me",
          maxDistance: 30,
          stiffness: 150,
          damping: 10,
          mass: 0.1,
        },
      },
      {
        id: "magnetic-snappy",
        name: "Snappy Pull",
        thumbnail: "/components/thumbnails/magnetic-snappy.png",
        description: "High stiffness and wider magnetic attraction radius.",
        props: {
          children: "Explore Work",
          maxDistance: 45,
          stiffness: 280,
          damping: 14,
          mass: 0.08,
        },
      },
      {
        id: "magnetic-heavy",
        name: "Heavy Resistance",
        thumbnail: "/components/thumbnails/magnetic-heavy.png",
        description: "Weighted tactile pull with higher mass.",
        props: {
          children: "Contact Jayant",
          maxDistance: 20,
          stiffness: 100,
          damping: 18,
          mass: 0.25,
        },
      },
    ],
    fields: [
      { key: "children", label: "Button Label", type: "text", group: "Content" },
      { key: "maxDistance", label: "Magnetic Radius (px)", type: "number", min: 10, max: 80, step: 5, group: "Physics" },
      { key: "stiffness", label: "Spring Stiffness", type: "number", min: 50, max: 400, step: 10, group: "Physics" },
      { key: "damping", label: "Spring Damping", type: "number", min: 5, max: 30, step: 1, group: "Physics" },
      { key: "mass", label: "Spring Mass", type: "number", min: 0.05, max: 0.5, step: 0.01, group: "Physics" },
    ],
    generateUsageCode: (props) => `<MagneticButton
  maxDistance={${props.maxDistance ?? 30}}
  stiffness={${props.stiffness ?? 150}}
  damping={${props.damping ?? 10}}
  mass={${props.mass ?? 0.1}}
>
  ${props.children ?? "Hover Me"}
</MagneticButton>`,
    setupNotes: {
      notes: [
        "Wraps button inside a relative container with dashed hover border.",
        "Physics coordinates clamp radially when distance exceeds maxDistance.",
      ],
    },
  },

  "radial-gradient-card": {
    slug: "radial-gradient-card",
    name: "Radial Gradient Card",
    referenceViewport: {
      desktop: { width: 1280, height: 800 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 812 },
    },
    examples: [
      {
        id: "radial-cobalt",
        name: "Cobalt Core",
        thumbnail: "/components/thumbnails/radial-cobalt.png",
        description: "Classic blue radial spotlight with dark card backdrop.",
        props: {
          color1: "rgba(59, 130, 246)",
          size: "10rem",
          opacity: 0.5,
          shape: "circle",
        },
      },
      {
        id: "radial-amber",
        name: "Sunset Amber",
        thumbnail: "/components/thumbnails/radial-amber.png",
        description: "Warm amber glow with expanded illumination radius.",
        props: {
          color1: "rgba(245, 158, 11)",
          size: "14rem",
          opacity: 0.65,
          shape: "circle",
        },
      },
      {
        id: "radial-emerald",
        name: "Emerald Aurora",
        thumbnail: "/components/thumbnails/radial-emerald.png",
        description: "Vivid neon green cursor spotlight.",
        props: {
          color1: "rgba(16, 185, 129)",
          size: "12rem",
          opacity: 0.55,
          shape: "circle",
        },
      },
    ],
    fields: [
      { key: "color1", label: "Spotlight Accent Color", type: "color", group: "Glow" },
      { key: "size", label: "Spotlight Radius", type: "text", group: "Glow" },
      { key: "opacity", label: "Hover Opacity", type: "number", min: 0.1, max: 1.0, step: 0.05, group: "Glow" },
    ],
    generateUsageCode: (props) => `<RadialGradientAnimateCard
  radialGradient={{
    color1: "${props.color1 ?? "rgba(59, 130, 246)"}",
    color2: "transparent",
    shape: "${props.shape ?? "circle"}",
    size: "${props.size ?? "10rem"}",
    opacity: ${props.opacity ?? 0.5},
  }}
>
  <div className="p-8">
    <h3 className="text-xl font-bold text-white">Interactive Card</h3>
    <p className="text-sm text-neutral-400 mt-2">Smooth hardware-accelerated radial spotlight tracking.</p>
  </div>
</RadialGradientAnimateCard>`,
    setupNotes: {
      notes: [
        "Card uses motion template radial-gradient positioned on pointer coordinates.",
        "Automatically transitions opacity to 0 when cursor exits card boundaries.",
      ],
    },
  },
};

export function getManifest(slug: string): ComponentManifest {
  const normalized = slug === "radial-gradient-animate-card" ? "radial-gradient-card" : slug;
  return COMPONENT_MANIFESTS[normalized] || COMPONENT_MANIFESTS["overlapping-text-hero"];
}
