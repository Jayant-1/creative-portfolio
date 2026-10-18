#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const OUTPUT_FILE = path.resolve(process.cwd(), 'lib/lqip-manifest.json');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const SKIP_PATTERNS = ['favicon.svg', 'logos/'];

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function processImage(filePath) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const routePath = '/' + relativePath.split(path.sep).join('/');

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      return null;
    }

    // Dominant color
    const stats = await image.stats();
    const dominant = stats.dominant;
    const hex =
      '#' +
      [dominant.r, dominant.g, dominant.b]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('');

    // Ultra-compact 24px wide blurred WebP preview
    const lqipWidth = 24;
    const lqipHeight = Math.max(1, Math.round(lqipWidth * (metadata.height / metadata.width)));

    const lqipBuffer = await sharp(filePath)
      .resize(lqipWidth, lqipHeight, { fit: 'fill' })
      .webp({ quality: 20 })
      .toBuffer();

    const blurDataURL = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;

    return {
      routePath,
      data: {
        width: metadata.width,
        height: metadata.height,
        aspectRatio: +(metadata.width / metadata.height).toFixed(4),
        dominantColor: hex,
        blurDataURL,
        byteSize: lqipBuffer.length,
      },
    };
  } catch (err) {
    console.warn(`[LQIP] Could not process ${relativePath}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('[LQIP] Scanning public directory for static images...');
  const allFiles = getAllFiles(PUBLIC_DIR);
  const imageFiles = allFiles.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    const rel = path.relative(PUBLIC_DIR, f);
    if (!IMAGE_EXTENSIONS.has(ext)) return false;
    for (const p of SKIP_PATTERNS) {
      if (rel.includes(p)) return false;
    }
    return true;
  });

  console.log(`[LQIP] Found ${imageFiles.length} candidate images. Generating LQIPs via sharp...`);
  const manifest = {};
  let totalBytes = 0;

  for (const file of imageFiles) {
    const result = await processImage(file);
    if (result) {
      manifest[result.routePath] = result.data;
      totalBytes += result.data.byteSize;
    }
  }

  const libDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest), 'utf-8');
  const manifestStats = fs.statSync(OUTPUT_FILE);

  console.log(
    `[LQIP] Successfully generated manifest with ${Object.keys(manifest).length} images!`
  );
  console.log(`[LQIP] Manifest size: ${(manifestStats.size / 1024).toFixed(2)} KB`);
  console.log(`[LQIP] Average LQIP payload: ${(totalBytes / Object.keys(manifest).length).toFixed(0)} bytes`);
}

run().catch((err) => {
  console.error('[LQIP] Fatal error:', err);
  process.exit(1);
});
