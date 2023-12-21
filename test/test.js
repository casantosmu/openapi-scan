import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, after, before } from "node:test";
import assert from "node:assert";
import child_process from "node:child_process";
import util from "node:util";
import { startServer, stopServer } from "./mocks/server.js";

const exec = util.promisify(child_process.exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const relativePathToAbsolute = (...paths) => path.join(__dirname, ...paths);

const cli = relativePathToAbsolute("..", "cli.js");

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
    it("Should exit without error", async () => {
      const fixture = relativePathToAbsolute("fixtures", "valid-oa3.json");
      const expected = {
        stdout: "",
        stderr: "",
      };

      const { stdout, stderr } = await exec(`cat ${fixture} | node ${cli}`);

      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });

  describe("When receives invalid JSON OpenAPI specification from stdin", () => {
    it("Should exit with error", async () => {
      const fixture = relativePathToAbsolute("fixtures", "invalid-oa3.json");
      const expected = {
        stdout: "",
        stderr: new RegExp("Swagger schema validation failed."),
      };

      const result = () => exec(`cat ${fixture} | node ${cli}`);

      await assert.rejects(result, expected);
    });
  });

  describe("When receives valid YAML OpenAPI specification from stdin", () => {
    it("Should exit without error", async () => {
      const fixture = relativePathToAbsolute("fixtures", "valid-oa3.yaml");
      const expected = {
        stdout: "",
        stderr: "",
      };

      const { stdout, stderr } = await exec(`cat ${fixture} | node ${cli}`);

      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });

  describe("When receives invalid YAML OpenAPI specification from stdin", () => {
    it("Should exit with error", async () => {
      const fixture = relativePathToAbsolute("fixtures", "invalid-oa3.yaml");
      const expected = {
        stdout: "",
        stderr: new RegExp("Swagger schema validation failed."),
      };

      const result = () => exec(`cat ${fixture} | node ${cli}`);

      await assert.rejects(result, expected);
    });
  });

  describe("When receives invalid JSON from stdin", () => {
    it("Should exit with error", async () => {
      const fixture = relativePathToAbsolute("fixtures", "invalid-json.json");
      const expected = {
        stdout: "",
        stderr: new RegExp("^Invalid JSON or YAML"),
      };

      const result = () => exec(`cat ${fixture} | node ${cli}`);

      await assert.rejects(result, expected);
    });
  });

  describe("When receives invalid YAML from stdin", () => {
    it("Should exit with error", async () => {
      const fixture = relativePathToAbsolute("fixtures", "invalid-yaml.yaml");
      const expected = {
        stdout: "",
        stderr: new RegExp("^Invalid JSON or YAML"),
      };

      const result = () => exec(`cat ${fixture} | node ${cli}`);

      await assert.rejects(result, expected);
    });
  });

  describe("When receives a valid JSON OpenAPI specification from a file path", () => {
    it("Should exit without error", async () => {
      const fixture = relativePathToAbsolute("fixtures", "valid-oa3.json");
      const expected = {
        stdout: "",
        stderr: "",
      };

      const { stdout, stderr } = await exec(`node ${cli} ${fixture}`);

      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });

  describe("When receives a valid YAML OpenAPI specification from a file path", () => {
    it("Should exit without error", async () => {
      const fixture = relativePathToAbsolute("fixtures", "valid-oa3.yaml");
      const expected = {
        stdout: "",
        stderr: "",
      };

      const { stdout, stderr } = await exec(`node ${cli} ${fixture}`);

      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });

  describe("When receives an error from a file path", () => {
    it("Should exit without error", async () => {
      const fixture = relativePathToAbsolute(
        "fixtures",
        "non-existent-file-path.json",
      );
      const expected = {
        stdout: "",
        stderr: new RegExp("^Error opening file"),
      };

      const result = () => exec(`node ${cli} ${fixture}`);

      await assert.rejects(result, expected);
    });
  });

  describe("When receives a valid OpenAPI specification from a url", () => {
    it("Should exit without error", async () => {
      const fixture = `${serverUrl}/valid-oa3.json`;
      const expected = {
        stdout: "",
        stderr: "",
      };

      const { stdout, stderr } = await exec(`node ${cli} ${fixture}`);

      assert.strictEqual(stdout, expected.stdout);
      assert.strictEqual(stderr, expected.stderr);
    });
  });

  describe("When receives an error from a url", () => {
    it("Should exit with error", async () => {
      const fixture = `${serverUrl}/non-existent-file-path.json`;
      const expected = {
        stdout: "",
        stderr: new RegExp(`^Error downloading ${fixture}`),
      };

      const result = () => exec(`node ${cli} ${fixture}`);

      await assert.rejects(result, expected);
    });
  });
});
