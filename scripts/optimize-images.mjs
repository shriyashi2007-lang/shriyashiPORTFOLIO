import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";
async function walk(dir) {
  for (const file of await readdir(dir, { withFileTypes: true })) {
    const source = path.join(dir, file.name);
    if (file.isDirectory()) await walk(source);
    else if (/\.(png|jpe?g)$/i.test(source)) {
      const output = source.replace(/\.(png|jpe?g)$/i, ".webp");
      await sharp(source)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(output);
      console.log(output);
    }
  }
}
await walk("public/assets");
