import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.resolve(__dirname, "../src/assets");

async function convertDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await convertDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".png", ".jpg", ".jpeg"].includes(ext)) {
        const baseName = path.basename(entry.name, path.extname(entry.name));
        const webpPath = path.join(dir, `${baseName}.webp`);

        // Convert only if webp doesn't already exist or original is newer
        try {
          const originalStats = fs.statSync(fullPath);
          let shouldConvert = true;

          if (fs.existsSync(webpPath)) {
            const webpStats = fs.statSync(webpPath);
            if (webpStats.mtime >= originalStats.mtime) {
              shouldConvert = false;
            }
          }

          if (shouldConvert) {
            await sharp(fullPath)
              .webp({ quality: 80 })
              .toFile(webpPath);

            const webpStats = fs.statSync(webpPath);
            const origSize = (originalStats.size / 1024).toFixed(1);
            const newSize = (webpStats.size / 1024).toFixed(1);
            const savings = (
              ((originalStats.size - webpStats.size) / originalStats.size) *
              100
            ).toFixed(1);

            console.log(
              `Converted: ${entry.name} (${origSize} KB) -> ${baseName}.webp (${newSize} KB) [${savings}% saved]`
            );
          }
        } catch (err) {
          console.error(`Error converting ${entry.name}:`, err.message);
        }
      }
    }
  }
}

console.log("Starting WebP conversion for assets in:", assetsDir);
convertDirectory(assetsDir)
  .then(() => console.log("WebP conversion completed successfully!"))
  .catch((err) => console.error("Conversion failed:", err));
