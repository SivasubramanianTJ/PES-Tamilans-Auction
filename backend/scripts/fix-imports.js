import fs from "fs";
import path from "path";

const ROOT = path.resolve("./src");

function processFile(file) {
  let code = fs.readFileSync(file, "utf8");

  code = code.replace(
    /(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
    (_, p1, imp, p3) => {
      if (
        imp.endsWith(".js") ||
        imp.endsWith(".json") ||
        imp.endsWith(".node")
      ) {
        return p1 + imp + p3;
      }

      return p1 + imp + ".js" + p3;
    }
  );

  code = code.replace(
    /(import\s*\(\s*['"])(\.{1,2}\/[^'"]+)(['"]\s*\))/g,
    (_, p1, imp, p3) => {
      if (
        imp.endsWith(".js") ||
        imp.endsWith(".json") ||
        imp.endsWith(".node")
      ) {
        return p1 + imp + p3;
      }

      return p1 + imp + ".js" + p3;
    }
  );

  fs.writeFileSync(file, code);
  console.log("✓", file);
}

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith(".ts")) {
      processFile(full);
    }
  }
}

walk(ROOT);

console.log("\nDone!");