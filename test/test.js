import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, after, before } from "node:test";
import assert from "node:assert";
import { execa } from "execa";
import { startServer, stopServer } from "./mocks/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const relativePathToAbsolute = (...paths) => path.join(__dirname, ...paths);

const execute = (...args) => {
  const cli = relativePathToAbsolute("..", "cli.js");
  if (typeof args[0] === "object") {
    return execa("node", [cli], args[0]);
  }
  return execa("node", [cli, ...args]);
};

let serverUrl;

before(async () => {
  const { port, hostname } = await startServer();
  serverUrl = `http://${hostname}:${port}`;
});

after(async () => {
  await stopServer();
});

describe("CLI", () => {
  describe("When receives valid JSON OpenAPI specification from stdin", () => {
    it("Should exit with 0", async () => {
      const fixture = relativePathToAbsolute("fixtures", "fixture.json");
      const expected = {
        exitCode: 0,
        stdout: "",
        stderr: "",
      };

      const { exitCode, stdout, stderr } = await execute({
        inputFile: fixture,
      });

      assert.strictEqual(exitCode, expected.exitCode);
      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });

  describe("When receives invalid JSON OpenAPI specification from stdin", () => {
    it("Should exit with error", async () => {
      const fixture = `
        {
          "openapi": "3.0.0",
          "info": {
            "title": "OpenAPI 3",
            "version": "1.0.0"
          },
          "paths": {
            "/hello": {
              "invalid": "invalid"
            }
          }
        }      
      `;
      const expected = {
        exitCode: 1,
        stdout: "",
        stderr: new RegExp("Swagger schema validation failed."),
      };

      const result = () => execute({ input: fixture });

      await assert.rejects(result, expected);
    });
  });

  describe("When receives valid YAML OpenAPI specification from stdin", () => {
    it("Should exit with 0", async () => {
      const fixture = relativePathToAbsolute("fixtures", "fixture.yaml");
      const expected = {
        exitCode: 0,
        stdout: "",
        stderr: "",
      };

      const { exitCode, stdout, stderr } = await execute({
        input: fixture,
      });

      assert.strictEqual(exitCode, expected.exitCode);
      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });

  describe("When receives invalid YAML OpenAPI specification from stdin", () => {
    it("Should exit with error", async () => {
      const fixture = `
        openapi: 3.0.0
        info:
          title: OpenAPI 3
          version: 1.0.0
        paths:
          /hello:
            invalid: invalid
      `;
      const expected = {
        exitCode: 1,
        stdout: "",
        stderr: new RegExp("Swagger schema validation failed."),
      };

      const result = () => execute({ input: fixture });

      await assert.rejects(result, expected);
    });
  });

  describe("When receives invalid JSON from stdin", () => {
    it("Should exit with error", async () => {
      const fixture = `
        {
          "openapi": "3.0.0"
          "info": {
            "title": "OpenAPI 3",
            "version": "1.0.0"
          }
        }      
      `;
      const expected = {
        exitCode: 1,
        stdout: "",
        stderr: new RegExp("^Invalid JSON or YAML"),
      };

      const result = () => execute({ input: fixture });

      await assert.rejects(result, expected);
    });
  });

  describe("When receives invalid YAML from stdin", () => {
    it("Should exit with error", async () => {
      const fixture = `
             openapi: 3.0.0
        info:
          title: OpenAPI 3
          version: 1.0.0
      `;
      const expected = {
        exitCode: 1,
        stdout: "",
        stderr: new RegExp("^Invalid JSON or YAML"),
      };

      const result = () => execute({ input: fixture });

      await assert.rejects(result, expected);
    });
  });

  describe("When receives a valid JSON OpenAPI specification from --file flag", () => {
    it("Should exit with 0", async () => {
      const fixture = relativePathToAbsolute("fixtures", "fixture.json");
      const expected = {
        exitCode: 0,
        stdout: "",
        stderr: "",
      };

      const { exitCode, stdout, stderr } = await execute(`--file=${fixture}`);

      assert.strictEqual(exitCode, expected.exitCode);
      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });

  describe("When receives a valid YAML OpenAPI specification from --file flag", () => {
    it("Should exit with 0", async () => {
      const fixture = relativePathToAbsolute("fixtures", "fixture.yaml");
      const expected = {
        exitCode: 0,
        stdout: "",
        stderr: "",
      };

      const { exitCode, stdout, stderr } = await execute(`--file=${fixture}`);

      assert.strictEqual(exitCode, expected.exitCode);
      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });

  describe("When receives a valid OpenAPI specification from --url flag", () => {
    it("Should exit with 0", async () => {
      const fixture = "/fixture.json";
      const expected = {
        exitCode: 0,
        stdout: "",
        stderr: "",
      };

      const { exitCode, stdout, stderr } = await execute(
        `--url=${serverUrl}${fixture}`,
      );

      assert.strictEqual(exitCode, expected.exitCode);
      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });
});
