/**
 * Anagram Finder UI Server
 *
 * This is the main entry point for the Anagram Finder GraphQL API server.
 * It provides a GraphQL interface to the anagram finding service and serves
 * a web UI for interacting with the API.
 *
 * Features:
 * - GraphQL API endpoint at /graphql
 * - Static web UI served from /public
 * - Health check endpoint at /health
 * - Request ID tracking for all requests
 * - CORS support for cross-origin requests
 *
 * @module index
 */

import express, { Request } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import addRequestId from "express-request-id";

// Load environment variables from .env file
dotenv.config();

/**
 * Server port number, defaults to 4000 if not specified in environment
 */
const PORT = process.env.PORT || 4000;

/**
 * Initializes and starts the Express server with Apollo GraphQL integration.
 *
 * This function performs the following setup:
 * 1. Creates an Express application
 * 2. Adds request ID middleware for tracking
 * 3. Initializes Apollo Server with GraphQL schema
 * 4. Configures static file serving for the web UI
 * 5. Sets up GraphQL endpoint with CORS and authentication context
 * 6. Adds health check endpoint
 * 7. Starts the HTTP server
 *
 * Endpoints:
 * - GET /: Serves the main web UI (index.html)
 * - POST /graphql: GraphQL API endpoint
 * - GET /health: Health check endpoint returning server status
 *
 * @async
 * @function startServer
 * @throws {Error} If server fails to start
 * @returns {Promise<void>}
 */
async function startServer() {
  // Create Express application instance
  const app = express();
  
  // Add unique request ID to each incoming request for tracking and debugging
  // Uses UUID v4 by default and attaches it to req.id
  app.use(addRequestId());

  // Initialize Apollo Server with GraphQL schema and resolvers
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server before applying middleware
  await server.start();

  // Serve static files (HTML, CSS, JS) from the public directory
  app.use(express.static(path.join(__dirname, '../public')));

  // Configure GraphQL endpoint with middleware stack
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: function (origin, callback) {
        const allowedOrigins = ["http://localhost:4000"];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      optionsSuccessStatus: 200,
      credentials: true,
    }), // Enable CORS for cross-origin requests
    bodyParser.json(), // Parse JSON request bodies
    expressMiddleware(server, {
      // Context function runs for each GraphQL request
      // Provides request-specific data to resolvers
      context: async ({ req }: { req: Request }) => {
        return {
          // Context object available to all resolvers
          // Can include user authentication, database connections, etc.
          token: req.headers.authorization || '',
        }
      },
    })
  );

  /**
   * Health check endpoint for monitoring server status
   *
   * @route GET /health
   * @returns {Object} JSON object with status and timestamp
   * @example
   * Response: { "status": "ok", "timestamp": "2024-03-24T22:20:00.000Z" }
   */
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  /**
   * Root endpoint serving the main web UI
   *
   * @route GET /
   * @returns {HTML} The index.html file from public directory
   */
  app.get('/anagrams', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // Start the HTTP server and listen on the configured port
  app.listen(PORT, () => {
    console.log(`🔤 Anagram Finder UI at http://localhost:${PORT}/anagrams`);
    console.log(`📡 GraphQL API at http://localhost:${PORT}/graphql`);
    console.log(`📊 Health check at http://localhost:${PORT}/health`);
  });
}

/**
 * Application entry point
 * Starts the server and handles any startup errors
 */
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

