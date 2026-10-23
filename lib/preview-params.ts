import { getManifest, ComponentManifest } from "./component-manifests";

export const PREVIEW_STORAGE_PREFIX = "craft_preview_config_";

export function normalizeSlug(slug: string): string {
  return slug === "radial-gradient-animate-card" ? "radial-gradient-card" : slug;
}

/**
 * Builds the fully qualified relative preview URL with query parameters
 * for preset selection and custom field overrides.
 *
 * Example:
 *   /preview/overlapping-text-hero?preset=developer
 *   /preview/overlapping-text-hero?preset=developer&title=CUSTOM+TITLE
 */
export function buildPreviewUrl(
  slug: string,
  presetId?: string,
  customProps?: Record<string, any>
): string {
  const normalized = normalizeSlug(slug);
  const manifest = getManifest(normalized);
  const params = new URLSearchParams();

  // Find the selected preset or default to first
  const activePreset =
    manifest.examples.find((ex) => ex.id === presetId) || manifest.examples[0];

  if (activePreset) {
    params.set("preset", activePreset.id);
  }

  // Add any prop overrides that differ from the preset defaults
  if (customProps) {
    const baseProps = activePreset.props || {};
    for (const [key, val] of Object.entries(customProps)) {
      if (val !== undefined && val !== null && val !== baseProps[key]) {
        if (typeof val === "object") {
          try {
            params.set(key, JSON.stringify(val));
          } catch {
            // Ignore non-serializable objects
          }
        } else {
          params.set(key, String(val));
        }
      }
    }
  }

  const queryString = params.toString();
  return `/preview/${normalized}${queryString ? `?${queryString}` : ""}`;
}

export interface ParsedPreviewState {
  presetId: string;
  props: Record<string, any>;
  hasUrlOverrides: boolean;
}

/**
 * Parses query parameters from URL search string and applies them on top
 * of the target preset's default props.
 */
export function parsePreviewParams(
  slug: string,
  searchString: string
): ParsedPreviewState {
  const normalized = normalizeSlug(slug);
  const manifest = getManifest(normalized);
  const params = new URLSearchParams(searchString);

  let hasUrlOverrides = false;

  // 1. Identify active preset
  const presetQuery = params.get("preset");
  let activePreset = manifest.examples[0];

  if (presetQuery) {
    const matched = manifest.examples.find(
      (ex) =>
        ex.id.toLowerCase() === presetQuery.toLowerCase() ||
        ex.name.toLowerCase() === presetQuery.toLowerCase()
    );
    if (matched) {
      activePreset = matched;
      hasUrlOverrides = true;
    }
  }

  // Clone base props
  const resolvedProps: Record<string, any> = { ...activePreset.props };

  // Accept only documented keys and types. Shared links and storage are untrusted input.
  const fieldKeyMap = new Map([...manifest.fields, ...manifest.customFields].map((f) => [f.key, f]));
  const apply = (key: string, value: unknown) => {
    if (["__proto__", "prototype", "constructor"].includes(key)) return;
    const field = fieldKeyMap.get(key);
    const fallback = activePreset.props[key];
    if (!field && !Object.prototype.hasOwnProperty.call(activePreset.props, key)) return;
    if (field?.type === "number" || typeof fallback === "number") {
      const number = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
      if (!Number.isFinite(number)) return;
      resolvedProps[key] = Math.max(field?.min ?? -10000, Math.min(field?.max ?? 10000, number));
    } else if (typeof fallback === "boolean") {
      if (![true, false, "true", "false"].includes(value as boolean | string)) return;
      resolvedProps[key] = value === true || value === "true";
    } else {
      if (typeof value !== "string" || value.length > 4096) return;
      if (field?.type === "select" && !field.options?.some((option) => option.value === value)) return;
      resolvedProps[key] = value;
    }
    hasUrlOverrides = true;
  };
  const jsonParam = params.get("config") || params.get("props");
  if (jsonParam && jsonParam.length <= 32768) {
    try {
      // URLSearchParams has already decoded the value; decoding again corrupts literal percentages.
      const parsed: unknown = JSON.parse(jsonParam);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [key, value] of Object.entries(parsed)) apply(key, value);
      }
    } catch { /* Malformed links keep the documented defaults. */ }
  }
  params.forEach((value, key) => {
    if (!["preset", "config", "props"].includes(key)) apply(key, value);
  });

  return {
    presetId: activePreset.id,
    props: resolvedProps,
    hasUrlOverrides,
  };
}

/**
 * Persists the latest selected preset and customizer values to localStorage
 * so that /preview/[slug] automatically loads the user's active configuration.
 */
export function savePreviewConfig(
  slug: string,
  presetId: string,
  props: Record<string, any>
): void {
  if (typeof window === "undefined") return;
  try {
    const normalized = normalizeSlug(slug);
    const key = `${PREVIEW_STORAGE_PREFIX}${normalized}`;
    const payload = {
      slug: normalized,
      presetId,
      props,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn("Failed to save preview config to localStorage", err);
  }
}

/**
 * Loads the stored preview configuration for a slug from localStorage.
 */
export function loadPreviewConfig(
  slug: string
): { presetId: string; props: Record<string, any> } | null {
  if (typeof window === "undefined") return null;
  try {
    const normalized = normalizeSlug(slug);
    const key = `${PREVIEW_STORAGE_PREFIX}${normalized}`;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (data && data.props && typeof data.props === "object") {
      const params = new URLSearchParams({ preset: String(data.presetId || ""), config: JSON.stringify(data.props) });
      const validated = parsePreviewParams(normalized, params.toString());
      return { presetId: validated.presetId, props: validated.props };
    }
  } catch (err) {
    console.warn("Failed to load preview config from localStorage", err);
  }
  return null;
}
