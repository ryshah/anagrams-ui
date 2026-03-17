/**
 * GraphQL Resolvers for Anagram Finder
 *
 * This module defines the resolver functions that handle GraphQL queries
 * by communicating with the backend REST API service.
 *
 * @module resolvers
 */

/**
 * Represents a group of anagrams for a single word
 *
 * @interface AnagramGroup
 * @property {string} word - The original word that was queried
 * @property {string[]} anagrams - Array of anagrams found for the word
 */
interface AnagramGroup {
  word: string;
  anagrams: string[];
}

/**
 * GraphQL resolver object containing all query resolvers
 */
export const resolvers = {
  Query: {
    /**
     * Finds anagrams for one or more words by querying the backend REST API.
     *
     * This resolver accepts a comma-separated list of words and returns anagram
     * results for each word. It makes HTTP POST requests to the backend anagram
     * service running on localhost:8080.
     *
     * @async
     * @function findAnagrams
     * @param {any} _ - Parent resolver (unused)
     * @param {Object} args - GraphQL query arguments
     * @param {string} args.text - Comma-separated list of words to find anagrams for
     * @returns {Promise<AnagramGroup[]>} Array of anagram groups, one per input word
     *
     * @throws {Error} If the backend API request fails or returns an error
     *
     * @example
     * // GraphQL Query
     * query {
     *   findAnagrams(text: "listen,evil") {
     *     word
     *     anagrams
     *   }
     * }
     *
     * // Response
     * [
     *   { word: "listen", anagrams: ["silent", "enlist"] },
     *   { word: "evil", anagrams: ["vile", "live"] }
     * ]
     */
    findAnagrams: async (_: any, { text }: { text: string }): Promise<AnagramGroup[]> => {
      try {
        // Initialize array to store results for all words
        const anagrams: AnagramGroup[] = [];
        
        // Split input text by comma to handle multiple words
        const words = text.split(",");
        
        // Process each word sequentially
        for (const word of words) {
            // Make HTTP POST request to backend anagram service
            // Note: Despite using POST method, the word is passed as a query parameter
            const jsonResponse = await fetch(`http://localhost:8080/v1/anagrams?word=${word}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
          
          // Parse JSON response from backend
          const response = await jsonResponse.json();
          
          // Convert response to AnagramGroup type
          // The JSON.parse(JSON.stringify()) ensures proper type conversion
          const anagramData: AnagramGroup = JSON.parse(
            JSON.stringify(response)
          );
          
          // Add this word's anagram results to the array
          anagrams.push(anagramData);
        };
        
        // Return all anagram results
        return anagrams;
      } catch (error: any) {
        // Log detailed error information if available
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        
        // Throw a user-friendly error message
        throw new Error(`Failed to find anagrams: ${error.message}`);
      }
    },
  },
};
