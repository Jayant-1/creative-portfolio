export function isDarkProjectHero(slug?: string): boolean {
  if (!slug) return true;
  // Malaria Detection System has a bright white/cream UI hero card
  if (slug === "malaria-detection" || slug === "light") {
    return false;
  }
  // All other engineering projects (AstroPixel, Krypton, 3D Portfolio, NeuralNet) have dark backgrounds
  return true;
}

