# 🔤 Anagram Finder UI

A GraphQL-powered web interface for finding anagrams, built with Apollo Server, Express, and TypeScript. Provides a beautiful UI that communicates with a Go-based REST API backend.

## Features

- GraphQL API with Apollo Server
- Responsive web interface with real-time results
- Multiple word support (comma-separated)
- REST API integration with Go backend
- TypeScript for type safety
- Health check endpoint

## Prerequisites

- Node.js v18+ and npm v9+
- Go Anagram Finder Backend running on `http://localhost:8080`

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Access the application:
- **Web UI**: http://localhost:4000/
- **GraphQL API**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

## Configuration

Create a `.env` file:

```env
PORT=4000
REST_API_BASE_URL=http://localhost:8080/v1/anagrams?word=test
API_TOKEN=
```

## GraphQL API

### Schema

```graphql
type Query {
  findAnagrams(text: String!): [AnagramGroup!]!
}

type AnagramGroup {
  word: String!
  anagrams: [String!]!
}
```

### Example Query

```graphql
query {
  findAnagrams(text: "listen,silent") {
    word
    anagrams
  }
}
```

## Project Structure

```
anagrams-ui/
├── src/
│   ├── index.ts              # Server entry point
│   ├── __tests__/            # Server integration tests
│   └── graphql/
│       ├── typeDefs/         # GraphQL schema
│       ├── resolvers/        # GraphQL resolvers
│       └── __tests__/        # GraphQL unit tests
├── public/
│   └── index.html            # Web UI
├── jest.config.js            # Jest configuration
├── .env.example              # Environment template
└── package.json
```

## Testing

The project includes comprehensive unit and integration tests:

- **TypeDefs Tests**: Validate GraphQL schema structure
- **Resolver Tests**: Test GraphQL resolver logic with mocked API calls
- **Server Tests**: Integration tests for HTTP endpoints and GraphQL API

Run tests with:
```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode for development
npm run test:coverage     # Generate coverage report
```

**Test Coverage**: 14 tests across 3 test suites covering schema validation, resolver logic, and server endpoints.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production server |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Tech Stack

- **Backend**: Apollo Server, Express, TypeScript
- **Frontend**: Vanilla JavaScript, GraphQL
- **Tools**: nodemon, ts-node


## Links

- [GitHub Repository](https://github.com/ryshah/anagrams-ui)
- [Go Backend](https://github.com/ryshah/AnagramFinderGo)
- [Issues](https://github.com/ryshah/anagrams-ui/issues)