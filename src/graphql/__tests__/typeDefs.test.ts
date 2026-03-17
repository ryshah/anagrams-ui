/**
 * GraphQL Type Definitions Unit Tests
 *
 * This test suite validates the GraphQL schema definition (typeDefs).
 * It ensures that all required types, queries, and fields are properly
 * defined in the schema string.
 *
 * Tests verify:
 * - Schema structure and syntax
 * - Presence of required types (Query, AnagramGroup)
 * - Correct field definitions and types
 * - Query signatures
 *
 * @module typeDefs.test
 */

import { typeDefs } from '../typeDefs';

/**
 * Test suite for GraphQL schema type definitions
 * Validates the structure and completeness of the GraphQL schema
 */
describe('GraphQL TypeDefs', () => {
  /**
   * Verifies that the typeDefs export exists and is a valid string
   * This is a basic sanity check for the schema definition
   */
  it('should define the schema correctly', () => {
    expect(typeDefs).toBeDefined();
    expect(typeof typeDefs).toBe('string');
  });

  /**
   * Verifies that the schema includes the root Query type
   * The Query type is required for all GraphQL schemas
   */
  it('should include Query type', () => {
    expect(typeDefs).toContain('type Query');
  });

  /**
   * Verifies that the findAnagrams query is defined with correct signature
   * Checks for the query name and required String parameter
   */
  it('should include findAnagrams query', () => {
    expect(typeDefs).toContain('findAnagrams(text: String!)');
  });

  /**
   * Verifies that the AnagramGroup type is defined in the schema
   * This type represents the structure of anagram query results
   */
  it('should include AnagramGroup type', () => {
    expect(typeDefs).toContain('type AnagramGroup');
  });

  /**
   * Verifies that the AnagramGroup type has all required fields
   * Checks for both 'word' and 'anagrams' fields with correct types
   */
  it('should define AnagramGroup fields correctly', () => {
    expect(typeDefs).toContain('word: String!');
    expect(typeDefs).toContain('anagrams: [String!]!');
  });
});

// Made with Bob
