import crypto from "crypto";
import { writeFileSync, existsSync } from "node:fs";

try {
  if (existsSync(".env")) {
    console.log(".env file already exists.");
    console.log(
      "If you have any issues - Delete the .env in root first before rerunning this script"
    );
    process.exit(1);
  }

  const accessSecret = crypto.randomBytes(64).toString("hex");
  const refreshSecret = crypto.randomBytes(64).toString("hex");

  const envContent = `PORT=8000
ACCESS_SECRET=${accessSecret}
REFRESH_SECRET=${refreshSecret}`;

  writeFileSync(".env", envContent);

  console.log(".env file created - Double check values!");
  console.log("PORT - 8000");
  console.log(`\nAccess: ${accessSecret}`);
  console.log(`\nRefresh: ${refreshSecret}`);
} catch (err) {
  console.error("Error creating .env file:", err.message);
  process.exit(1);
}
