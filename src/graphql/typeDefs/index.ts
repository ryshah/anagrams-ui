/**
 * GraphQL Schema Type Definitions for Anagram Finder
 *
 * This module defines the GraphQL schema using SDL (Schema Definition Language).
 * It specifies the available queries and the structure of data types returned
 * by the API.
 *
 * @module typeDefs
 */

/**
 * GraphQL schema definition for the Anagram Finder API
 *
 * Schema Overview:
 * - Query.findAnagrams: Main query for finding anagrams of words
 * - AnagramGroup: Type representing anagram results for a single word
 *
 * Type Definitions:
 *
 * Query:
 *   - findAnagrams(text: String!): [AnagramGroup!]!
 *     Finds anagrams for one or more comma-separated words
 *     @param text - Required string containing word(s) to find anagrams for
 *     @returns Non-nullable array of AnagramGroup objects
 *
 * AnagramGroup:
 *   - word: String! - The original word that was queried (required)
 *   - anagrams: [String!]! - Non-nullable array of anagram strings (required)
 *
 * @example
 * // Query example
 * query {
 *   findAnagrams(text: "listen") {
 *     word
 *     anagrams
 *   }
 * }
 *
 * // Response example
 * {
 *   "data": {
 *     "findAnagrams": [
 *       {
 *         "word": "listen",
 *         "anagrams": ["silent", "enlist", "inlets"]
 *       }
 *     ]
 *   }
 * }
 */
export const typeDefs = `#graphql
  type Query {
    findAnagrams(text: String!): [AnagramGroup!]!
  }

  type AnagramGroup {
    word: String!
    anagrams: [String!]!
  }
`;

