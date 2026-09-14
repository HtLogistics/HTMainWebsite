import path from "path";
import { createApp } from "./app";

// vercel.json ships dist/public inside the function (functions.includeFiles) at the same
// relative path as in the project, and the function runs with the project root as its cwd.
const staticPath = path.resolve(process.cwd(), "dist", "public");

export default createApp(staticPath);
