import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesPath = path.join(__dirname, "..", "fixtures");
const fixturesFilenames = new Set(fs.readdirSync(fixturesPath));

const hostname = "127.0.0.1";
const port = 0;

const mimeTypes = {
  ".json": "application/json; charset=UTF-8",
  ".yaml": "text/yaml; charset=UTF-8",
};

const server = createServer((request, response) => {
  const { url } = request;

  if (fixturesFilenames.has(url.replace(/^\//, ""))) {
    response.statusCode = 200;
    response.setHeader("Content-Type", mimeTypes[path.extname(url)]);
    fs.createReadStream(path.join(fixturesPath, url)).pipe(response);
  } else {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end("Not found");
  }
});

export const startServer = () =>
  new Promise((resolve, reject) => {
    server.listen(port, hostname, () => {
      const { port } = server.address();
      console.log(`Server running at http://${hostname}:${port}`);
      resolve({ port, hostname });
    });
    server.once("error", reject);
  });

export const stopServer = () =>
  new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
