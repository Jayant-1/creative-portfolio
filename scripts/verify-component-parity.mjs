import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const mapping = [
  { slug: "overlapping-text-hero", file: "components/showcase/OverlappingTextHero.tsx" },
  { slug: "telescope-hero", file: "components/showcase/TelescopeHero.tsx" },
  { slug: "binary-grid", file: "components/showcase/BinaryGrid.tsx" },
  { slug: "bubble-text", file: "components/showcase/BubbleText.tsx" },
  { slug: "magnetic-button", file: "components/showcase/MagneticButton.tsx" },
  { slug: "radial-gradient-card", file: "components/showcase/RadialGradientAnimateCard.tsx" },
];

const dataPath = path.resolve("lib/components-data.ts");
const source = fs.readFileSync(dataPath, "utf8");
const ast = ts.createSourceFile(dataPath, source, ts.ScriptTarget.Latest, true);
const entries = new Map();
function visit(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const properties = node.properties.filter(ts.isPropertyAssignment);
    const slug = properties.find((p) => p.name.getText(ast) === "slug")?.initializer;
    const code = properties.find((p) => p.name.getText(ast) === "code")?.initializer;
    if (slug && ts.isStringLiteral(slug) && code && ts.isNoSubstitutionTemplateLiteral(code)) entries.set(slug.text, code);
  }
  ts.forEachChild(node, visit);
}
visit(ast);
const edits = [];
let failed = false;
for (const { slug, file } of mapping) {
  const actual = fs.readFileSync(file, "utf8").trim();
  const node = entries.get(slug);
  if (!node) { console.error(`${slug}: missing source template`); failed = true; continue; }
  if (node.text.trim() === actual) { console.log(`${slug}: source/copy parity PASS`); continue; }
  if (process.argv.includes("--write")) {
    const escaped = actual.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
    edits.push({ start: node.getStart(ast), end: node.end, text: "`" + escaped + "`" });
  } else { console.error(`${slug}: runtime and displayed source differ`); failed = true; }
}
if (edits.length) {
  let updated = source;
  for (const edit of edits.sort((a,b) => b.start-a.start)) updated = updated.slice(0, edit.start) + edit.text + updated.slice(edit.end);
  fs.writeFileSync(dataPath, updated);
  console.log(`Synced ${edits.length} source templates from their runtime files.`);
}
process.exitCode = failed ? 1 : 0;
