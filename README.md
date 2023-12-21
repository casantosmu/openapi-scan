# openapi-scan

## Overview

`openapi-scan` is a command-line interface (CLI) tool designed to validate Swagger 2.0 or OpenAPI 3.0 definitions in JSON or YAML format. Leveraging the power of [@apidevtools/swagger-parser](https://www.npmjs.com/package/@apidevtools/swagger-parser), this tool ensures that your API specifications adhere to the standard.

## Features

- **Validation:** Ensures your Swagger 2.0 or OpenAPI 3.0 definitions are syntactically correct and adhere to the specified standards.
- **CLI Convenience:** Easily validate API definitions using standard input, a local file, or a URL.
- **Versatility:** Supports both JSON and YAML formats for API definitions.

## Installation

To use `openapi-scan`, first, install the package via npm:

```bash
npm install -g openapi-scan
```

## Usage

### Validate from Standard Input

```bash
cat openapi.json | openapi-scan
```

### Validate from Local File

```bash
openapi-scan openapi.json
```

### Validate from URL

```bash
openapi-scan http://localhost:3000/openapi.json
```

## Contributing

Feel free to contribute by submitting issues or pull requests on the [GitHub repository](https://github.com/casantosmu/openapi-scan).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
