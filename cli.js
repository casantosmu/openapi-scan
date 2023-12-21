#!/usr/bin/env node

import consumers from "node:stream/consumers";
import SwaggerParser from "@apidevtools/swagger-parser";
import yaml from "js-yaml";

const { stdin, argv } = process;
const arg = argv[2];

const handleError = (error) => {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const definition =
  arg?.startsWith("--file=") || arg?.startsWith("--url=")
    ? arg.split("=", 2)[1]
    : await consumers.text(stdin);

let json;
try {
  json = yaml.load(definition);
} catch (error) {
  handleError(new Error(`Invalid JSON or YAML: ${error.message}`));
}

SwaggerParser.validate(json, handleError);
