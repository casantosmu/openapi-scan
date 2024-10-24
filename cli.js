#!/usr/bin/env node

import process from 'node:process';
import consumers from 'node:stream/consumers';
import SwaggerParser from '@apidevtools/swagger-parser';
import yaml from 'js-yaml';

const argv = process.argv.slice(2);
const {stdin} = process;

const handleError = error => {
	if (error) {
		console.error(error.message);
		process.exit(1);
	}
};

const definition = argv[0] ?? (await consumers.text(stdin));

let api;
try {
	api = yaml.load(definition);
} catch (error) {
	handleError(new Error(`Invalid JSON or YAML: ${error.message}`));
}

SwaggerParser.validate(api, handleError);
