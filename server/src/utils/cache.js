/**
 * Simple in-memory cache for AI responses
 * Reduces redundant API calls when users switch between modes for the same content
 */

const crypto = require('crypto');

class ResponseCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 100; // Maximum number of cached entries
    this.ttl = options.ttl || 30 * 60 * 1000; // Time to live: 30 minutes default
    
    // Cleanup expired entries every 10 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  /**
   * Generate a hash key from the input text
   * @param {string} text - Input text to hash
   * @returns {string} Hash string
   */
  hashText(text) {
    return crypto.createHash('sha256').update(text).digest('hex').substring(0, 16);
  }

  /**
   * Generate cache key from parameters
   * @param {string} category - Type of request (summarize, search, extract, chat)
   * @param {string} text - Input text
   * @param {string} mode - Mode/preset identifier
   * @param {string} [extra] - Additional identifier (e.g., query for search)
   * @returns {string} Cache key
   */
  generateKey(category, text, mode, extra = '') {
    const textHash = this.hashText(text);
    return `${category}:${textHash}:${mode}${extra ? ':' + extra : ''}`;
  }

  /**
   * Get cached response
   * @param {string} key - Cache key
   * @returns {string|null} Cached response or null
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    entry.accessCount++;
    entry.lastAccessed = Date.now();
    return entry.data;
  }

  /**
   * Store response in cache
   * @param {string} key - Cache key
   * @param {string} data - Response data to cache
   */
  set(key, data) {
    // If cache is full, remove least recently used entry
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      expiresAt: Date.now() + this.ttl,
      accessCount: 0
    });
  }

  /**
   * Evict least recently used entry
   */
  evictLRU() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Remove expired entries
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Clear all cached entries
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        createdAt: new Date(entry.createdAt).toISOString(),
        lastAccessed: new Date(entry.lastAccessed).toISOString(),
        accessCount: entry.accessCount,
        expiresIn: Math.max(0, Math.round((entry.expiresAt - Date.now()) / 1000)) + 's'
      }))
    };
  }

  /**
   * Destroy the cache and cleanup interval
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Export singleton instance
const cacheInstance = new ResponseCache({
  maxSize: 100,
  ttl: 30 * 60 * 1000 // 30 minutes
});

module.exports = cacheInstance;
