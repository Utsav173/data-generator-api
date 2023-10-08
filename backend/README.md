
# Data Generator API

A RESTful API for generating random data based on provided structure.

## Features

- Generate random data with a defined structure
- Support for various data types (string, number, boolean, etc.)
- Nested data generation (arrays of objects, arrays of arrays)
- ...

## Installation and Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the server with `npm start`.

## Usage

### Generate Random Data

Endpoint: `POST /api/generateRandomData`

Request:

```
{
  "structure": {
    "name": "string",
    "age": "number",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zip": "string"
    }
  },
  "arrayLength": 3
}
```


Response:

```
[
  {
    "name": "John Doe",
    "age": 30,
    "address": {
      "street": "123 Main St",
      "city": "Example City",
      "state": "CA",
      "zip": "12345"
    }
  },
  // More generated objects...
]
```

### Generate API Key

To generate an API key, make a `POST` request to `/api/generateApiKey` with your email address.

Request:

```
{
  "email": "your.email@example.com"
}
```

Response:

```
{
  "apiKey": "your_generated_api_key"
}
```

## Examples

### Example 1

// Example request and response here...

### Example 2

// Example request and response here...

## Contributing

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://chat.openai.com/c/LICENSE) file for details.

## Badges

[![Build Status](https://travis-ci.com/utsavKhatri/data-generator-api.svg?branch=main)](https://travis-ci.com/utsavKhatri/data-generator-api)

## Contact

For inquiries, contact Utsav Khatri at [utsav@example.com](mailto:utsav@example.com).

## Acknowledgements

* Thanks to the [Faker.js](https://github.com/Marak/Faker.js) library for generating realistic data.
