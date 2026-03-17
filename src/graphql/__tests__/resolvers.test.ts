/**
 * GraphQL Resolvers Unit Tests
 *
 * This test suite validates the resolver functions that handle GraphQL queries.
 * It tests the findAnagrams resolver with various scenarios including:
 * - Single word queries
 * - Multiple word queries
 * - Error handling
 * - Edge cases (empty input)
 *
 * All tests use mocked fetch calls to avoid real HTTP requests.
 *
 * @module resolvers.test
 */

import { resolvers } from '../resolvers';

// Mock the global fetch function to simulate backend API responses
global.fetch = jest.fn();

/**
 * Test suite for GraphQL resolver functions
 * Validates the behavior of all query resolvers
 */
describe('GraphQL Resolvers', () => {
  /**
   * Setup function that runs before each test
   * Clears all mock function calls to ensure test isolation
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite specifically for the findAnagrams query resolver
   * Tests various input scenarios and error conditions
   */
  describe('Query.findAnagrams', () => {
    /**
     * Verifies that the findAnagrams resolver function exists and is callable
     */
    it('should be defined', () => {
      expect(resolvers.Query.findAnagrams).toBeDefined();
      expect(typeof resolvers.Query.findAnagrams).toBe('function');
    });

    /**
     * Tests successful anagram lookup for a single word
     * Mocks the backend API response and verifies the resolver returns correct data
     */
    it('should fetch anagrams for a single word', async () => {
      const mockResponse = {
        word: 'listen',
        anagrams: ['silent', 'enlist'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await resolvers.Query.findAnagrams(null, { text: 'listen' });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/anagrams?word=listen',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual([mockResponse]);
    });

    /**
     * Tests anagram lookup for multiple comma-separated words
     * Verifies that the resolver makes multiple API calls and aggregates results
     */
    it('should fetch anagrams for multiple words', async () => {
      const mockResponse1 = {
        word: 'listen',
        anagrams: ['silent', 'enlist'],
      };
      const mockResponse2 = {
        word: 'evil',
        anagrams: ['vile', 'live'],
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ json: async () => mockResponse1 })
        .mockResolvedValueOnce({ json: async () => mockResponse2 });

      const result = await resolvers.Query.findAnagrams(null, { text: 'listen,evil' });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockResponse1, mockResponse2]);
    });

    /**
     * Tests error handling when the backend API fails
     * Verifies that network errors are caught and re-thrown with descriptive messages
     */
    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        resolvers.Query.findAnagrams(null, { text: 'test' })
      ).rejects.toThrow('Failed to find anagrams: Network error');
    });

    /**
     * Tests edge case of empty string input
     * Verifies that the resolver handles empty input without crashing
     */
    it('should handle empty text input', async () => {
      const mockResponse = {
        word: '',
        anagrams: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await resolvers.Query.findAnagrams(null, { text: '' });

      expect(result).toEqual([mockResponse]);
    });
  });
});

// Made with Bob
