const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");

const destinationFolder = "frontend/types";

// Adjust these paths as per your project structure
const files = [
  {
    src: path.join(__dirname, "./backend/types/generated/contentTypes.d.ts"),
    dest: path.join(__dirname, `./${destinationFolder}/contentTypes.d.ts`),
  },
  {
    src: path.join(__dirname, "./backend/types/generated/components.d.ts"),
    dest: path.join(__dirname, `./${destinationFolder}/components.d.ts`),
  },
];

async function generateTypes() {
  console.log("🚀 Generating Strapi types...");
  return new Promise((resolve, reject) => {
    exec(
      "cd backend && yarn strapi ts:generate-types",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error generating types: ${error}`);
          reject(error);
          return;
        }
        console.log("📄 Types generated successfully");
        resolve(stdout);
      }
    );
  });
}

async function copyFile({ src, dest }) {
  try {
    const destinationDir = path.dirname(dest);

    await fs.mkdir(destinationDir, { recursive: true }).catch((err) => {
      if (err.code !== "EEXIST") throw err; // Ignore if the directory exists
    });

    const fileExists = await fs
      .stat(src)
      .then(() => true)
      .catch((err) => {
        if (err.code === "ENOENT") {
          console.log(
            `⚠️ Source file does not exist, will be generated: ${src}`
          );
        }
        return false;
      });

    // Generate types before copying
    await generateTypes();

    // Copy the file directly
    await fs.copyFile(src, dest);

    if (fileExists) {
      console.log(`🔄 Updated and copied: ${dest}`);
    } else {
      console.log(`✨ Created and copied: ${dest}`);
    }
  } catch (err) {
    console.error(`❌ Error: Failed to copy ${src} to ${dest}: ${err}`);
    process.exit(1);
  }
}

async function main() {
  for (const file of files) {
    await copyFile(file);
  }
}

main().catch((err) => console.error(`❌ Error during execution: ${err}`));
