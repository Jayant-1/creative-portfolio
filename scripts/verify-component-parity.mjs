import fs from "fs";
import path from "path";

const mapping = [
  { slug: "overlapping-text-hero", file: "components/showcase/OverlappingTextHero.tsx" },
  { slug: "telescope-hero", file: "components/showcase/TelescopeHero.tsx" },
  { slug: "binary-grid", file: "components/showcase/BinaryGrid.tsx" },
  { slug: "bubble-text", file: "components/showcase/BubbleText.tsx" },
  { slug: "magnetic-button", file: "components/showcase/MagneticButton.tsx" },
  { slug: "radial-gradient-card", file: "components/showcase/RadialGradientAnimateCard.tsx" },
];

const dataPath = path.resolve(process.cwd(), "lib/components-data.ts");
const dataContent = fs.readFileSync(dataPath, "utf8");

let allPassed = true;
for (const { slug, file } of mapping) {
  const filePath = path.resolve(process.cwd(), file);
  const actualSource = fs.readFileSync(filePath, "utf8").trim();
  const slugIdx = dataContent.indexOf(`slug: "${slug}"`);
  if (slugIdx === -1) {
    console.error(`✗ ${slug}: not found in lib/components-data.ts`);
    allPassed = false;
    continue;
  }
  const codeIdx = dataContent.indexOf("code: `", slugIdx);
  if (codeIdx === -1) {
    console.error(`✗ ${slug}: code property not found in lib/components-data.ts`);
    allPassed = false;
    continue;
  }
  const codeStart = codeIdx + 7;
  const codeEnd = dataContent.indexOf("`,\n    usage:", codeStart);
  const rawDataCode = dataContent.slice(codeStart, codeEnd);
  const evaluatedCode = eval("`" + rawDataCode + "`").trim();

  if (evaluatedCode === actualSource) {
    console.log(`✓ ${slug}: 100% byte-for-byte parity verified`);
  } else {
    allPassed = false;
    console.error(`✗ ${slug}: mismatch between ${file} and lib/components-data.ts!`);
  }
}

if (!allPassed) {
  console.error("\nComponent parity verification failed.");
  process.exit(1);
} else {
  console.log("\n[PARITY GATE PASSED] All 6 showcase components have exact 1:1 code parity.");
}
