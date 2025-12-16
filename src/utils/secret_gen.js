import crypto from "crypto";

const accessSecret = crypto.randomBytes(64).toString("hex");
const refreshSecret = crypto.randomBytes(64).toString("hex");

console.log(`\nAccess: ${accessSecret}`);
console.log(`\nRefresh: ${refreshSecret}`);
