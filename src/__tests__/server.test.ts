/**
 * Server Integration Tests
 *
 * This test suite validates the complete server setup including:
 * - Express server configuration
 * - Apollo GraphQL server integration
 * - Health check endpoint functionality
 * - GraphQL query processing
 * - Error handling for invalid queries
 *
 * @module server.test
 */

import request from 'supertest';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import bodyParser from 'body-parser';
import { typeDefs } from '../graphql/typeDefs';
import { resolvers } from '../graphql/resolvers';

// Mock the global fetch function to avoid making real HTTP requests during tests
global.fetch = jest.fn();

/**
 * Integration test suite for the Anagram Finder server
 * Tests the complete server stack from HTTP endpoints to GraphQL resolvers
 */
describe('Server Integration Tests', () => {
  let app: express.Application;
  let server: ApolloServer;

  /**
   * Setup function that runs once before all tests
   * Initializes the Express app and Apollo Server for testing
   */
  beforeAll(async () => {
    app = express();
    server = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await server.start();

    app.use(
      '/graphql',
      bodyParser.json(),
      expressMiddleware(server)
    );

    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  });

  /**
   * Cleanup function that runs once after all tests
   * Stops the Apollo Server to free resources
   */
  afterAll(async () => {
    await server.stop();
  });

  /**
   * Setup function that runs before each test
   * Clears all mock function calls to ensure test isolation
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite for the /health endpoint
   * Validates that the health check returns proper status information
   */
  describe('Health Check Endpoint', () => {
    /**
     * Verifies that the health endpoint returns HTTP 200 with status "ok"
     * and includes a timestamp in the response
     */
    it('should return 200 and status ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  /**
   * Test suite for the /graphql endpoint
   * Validates GraphQL query processing, error handling, and variable validation
   */
  describe('GraphQL Endpoint', () => {
    /**
     * Tests successful GraphQL query execution
     * Mocks the backend API response and verifies the resolver processes it correctly
     */
    it('should accept GraphQL queries', async () => {
      const mockResponse = {
        word: 'test',
        anagrams: ['sett', 'stet'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const query = `
        query FindAnagrams($text: String!) {
          findAnagrams(text: $text) {
            word
            anagrams
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({
          query,
          variables: { text: 'test' },
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.findAnagrams).toEqual([mockResponse]);
    });

    /**
     * Tests error handling for malformed GraphQL queries
     * Verifies that invalid syntax returns HTTP 400 with error details
     */
    it('should handle invalid GraphQL queries', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({
          query: 'invalid query',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    /**
     * Tests validation of required GraphQL query variables
     * Verifies that missing required variables returns HTTP 400 with error details
     */
    it('should handle missing required variables', async () => {
      const query = `
        query FindAnagrams($text: String!) {
          findAnagrams(text: $text) {
            word
            anagrams
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
