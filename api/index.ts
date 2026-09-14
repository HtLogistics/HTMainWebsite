import path from "path";
import { createApp } from "../server/app";

// vercel.json ships dist/public inside this function's bundle (functions.includeFiles),
// where it lands at the same relative path as in the project, i.e. <bundle root>/dist/public.
const staticPath = path.resolve(process.cwd(), "dist", "public");

export default createApp(staticPath);
