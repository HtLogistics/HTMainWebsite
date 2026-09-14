import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: pnpm hash-password <plaintext-password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nADMIN_PASSWORD_HASH=" + hash + "\n");
console.log("Copy the line above into your .env file. The plaintext password is never stored.");
