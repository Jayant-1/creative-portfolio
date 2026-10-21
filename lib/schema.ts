import {
  author,
  certificateGroups,
  email,
  Project,
  siteUrl,
  skillsByCategory,
  social,
  toolsIWorkWith,
} from "./site";
import type { CraftComponent } from "./components-data";

/**
 * Returns canonical Person schema for Jayant Potdar.
 * Validated against Schema.org/Person specifications.
 */
export function getPersonSchema() {
  const allSkills = Array.from(
    new Set([
      ...toolsIWorkWith,
      ...skillsByCategory.flatMap((category) => category.skills),
      "Full Stack Development",
      "Interactive Prototyping",
      "AST Code Generation",
      "Information Retrieval & Ranking",
      "Geospatial Data & GDAL",
      "Deep Zoom Tiling",
      "Three.js & WebGL",
    ])
  );

  const credentials = certificateGroups.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "EducationalOccupationalCredential",
      name: item.name,
      credentialCategory: "certificate",
      recognizedBy: {
        "@type": "EducationalOrganization",
        name: group.organization,
      },
      url: item.credentialUrl,
      validFrom: item.date,
      description: item.description,
    }))
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#jayant`,
    name: author.name,
    legalName: author.legalName,
    alternateName: [
      "Jayant Sunil Potdar",
      "Jayant Potdar",
      "Jayant Potdar developer",
      "Jayant Potdar Pune",
    ],
    url: siteUrl,
    image: `${siteUrl}/images/img-1.png`,
    jobTitle: author.role,
    email: `mailto:${email}`,
    description: author.summary,
    homeLocation: {
      "@type": "Place",
      name: author.location,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: author.college,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Pune",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
      },
    ],
    affiliation: {
      "@type": "EducationalOrganization",
      name: author.college,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      occupationLocation: {
        "@type": "AdministrativeArea",
        name: author.fullLocation,
      },
      skills: toolsIWorkWith,
    },
    sameAs: [social.github, social.linkedin],
    knowsAbout: allSkills,
    hasCredential: credentials,
  };
}

/**
 * Returns canonical WebSite schema.
 * Validated against Schema.org/WebSite specifications.
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Jayant Potdar",
    alternateName: ["Jayant Potdar Portfolio", "Jayant Potdar Codes"],
    url: siteUrl,
    description:
      "I'm Jayant Potdar, a full stack developer in Pune. I build expressive React interfaces and production-ready web apps.",
    inLanguage: "en-IN",
    publisher: {
      "@id": `${siteUrl}/#jayant`,
    },
  };
}

/**
 * Returns ProfilePage schema for author and portfolio pages.
 * Validated against Schema.org/ProfilePage and Google Rich Results guidelines.
 */
export function getProfilePageSchema(options?: {
  url?: string;
  name?: string;
  description?: string;
}) {
  const pageUrl = options?.url || siteUrl;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl}#profilepage`,
    url: pageUrl,
    name: options?.name || "Jayant Potdar — Portfolio & Profile",
    headline: author.headline,
    description: options?.description || author.summary,
    inLanguage: "en-IN",
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    mainEntity: {
      "@id": `${siteUrl}/#jayant`,
    },
  };
}

/**
 * Returns SoftwareApplication schema for interactive craft showcase components.
 * Validated against Schema.org/SoftwareApplication.
 */
export function getSoftwareApplicationSchema(component: CraftComponent) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/components/${component.slug}#software`,
    name: component.name,
    headline: component.tagline,
    description: component.description,
    url: `${siteUrl}/components/${component.slug}`,
    applicationCategory: "DesignApplication",
    applicationSubCategory: component.categoryLabel,
    operatingSystem: "Web Browser",
    softwareRequirements: component.dependencies.join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#jayant`,
      name: author.name,
      url: siteUrl,
    },
    creator: {
      "@type": "Person",
      "@id": `${siteUrl}/#jayant`,
      name: author.name,
      url: siteUrl,
    },
    image: `${siteUrl}${component.thumbnail}`,
    inLanguage: "en-IN",
  };
}

/**
 * Returns TechArticle / CreativeWork case study schema for engineering projects.
 * Explicitly connects to the underlying software entity without contradictory capability claims.
 * Optional dates (datePublished, dateModified) are omitted since exact per-project publication dates are not tracked.
 */
export function getProjectCaseStudySchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${siteUrl}/projects/${project.slug}#case-study`,
    headline: `${project.title}: ${project.headline}`,
    name: `${project.title} Case Study`,
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    mainEntityOfPage: `${siteUrl}/projects/${project.slug}`,
    image: `${siteUrl}${project.hero}`,
    inLanguage: "en-IN",
    articleSection: project.category.join(", "),
    keywords: project.technologies.join(", "),
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#jayant`,
      name: author.name,
      jobTitle: author.role,
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      "@id": `${siteUrl}/#jayant`,
      name: author.name,
      url: siteUrl,
    },
    about: {
      "@type": "SoftwareApplication",
      name: project.title,
      description: project.summary,
      applicationCategory: "WebApplication",
      applicationSubCategory: project.category.join(", "),
      operatingSystem: "Web Browser",
      url: project.demo || project.source,
      sameAs: project.source,
      author: {
        "@type": "Person",
        "@id": `${siteUrl}/#jayant`,
        name: author.name,
      },
    },
  };
}

/**
 * Returns BreadcrumbList schema for hierarchical navigation trails.
 * Validated against Schema.org/BreadcrumbList.
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
