#!/usr/bin/env node

import fs from "node:fs";
import consumers from "node:stream/consumers";
import SwaggerParser from "@apidevtools/swagger-parser";
import yaml from "js-yaml";

const argv = process.argv.slice(2);
const { stdin } = process;

const handleError = (error) => {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const isPipedIn = await new Promise((resolve) => {
  fs.fstat(0, (error, stats) => {
    handleError(error);
    resolve(stats.isFIFO());
  });
});

const definition = isPipedIn ? await consumers.text(stdin) : argv[0];

let json;
try {
  json = yaml.load(definition);
} catch (error) {
  handleError(new Error(`Invalid JSON or YAML: ${error.message}`));
}

SwaggerParser.validate(json, handleError);
