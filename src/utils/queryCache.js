// Simple in-memory cache for queries (60 seconds TTL)
const queryCache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

export const getCachedQuery = (queryKey) => {
  const cached = queryCache.get(queryKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { ...cached.data, cached: true };
  }
  queryCache.delete(queryKey);
  return null;
};

export const setCachedQuery = (queryKey, data) => {
  queryCache.set(queryKey, {
    data: { ...data, cached: false },
    timestamp: Date.now()
  });
  
  // Clean up expired entries periodically
  if (queryCache.size > 1000) {
    const now = Date.now();
    for (const [key, value] of queryCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        queryCache.delete(key);
      }
    }
  }
};

export const clearUserCache = (userId) => {
  for (const [key] of queryCache.entries()) {
    if (key.startsWith(`${userId}:`)) {
      queryCache.delete(key);
    }
  }
};