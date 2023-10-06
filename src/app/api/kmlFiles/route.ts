import path from "path";
import * as fs from "fs";

const kmlDirectory = path.resolve(process.cwd(), "public", "files", "kml");

export function getAllKmlFiles() {
  return fs.readdirSync(kmlDirectory);
}

export async function GET(request: Request) {
  const kmlFiles = getAllKmlFiles();
  return Response.json(kmlFiles);
}
