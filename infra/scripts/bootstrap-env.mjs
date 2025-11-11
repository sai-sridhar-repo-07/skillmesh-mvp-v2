import fs from "node:fs";
import path from "node:path";

const pairs = [
  ["apps/api/.env.example", "apps/api/.env"],
  ["apps/api/.env.example", "apps/api/.env.local"],
  ["apps/web/.env.example", "apps/web/.env"],
  ["apps/web/.env.example", "apps/web/.env.local"]
];

for (const [src, dst] of pairs) {
  const s = path.resolve(src);
  const d = path.resolve(dst);
  if (!fs.existsSync(d)) {
    fs.copyFileSync(s, d);
    console.log("Created", d);
  } else {
    console.log("Exists", d);
  }
}
