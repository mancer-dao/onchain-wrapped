export async function getCachedUserData<TData>(
  userFid: number,
  fetchFunction: () => Promise<TData>,
  kvStore: KVNamespace
): Promise<TData> {
  const cacheKey = `user_${userFid}`;

  try {
    const cachedData = await kvStore.get(cacheKey);
    if (cachedData) {
      console.debug("[getCachedUserData] Cache hit:", userFid);
      const cachedResponse = JSON.parse(cachedData);
      return cachedResponse;
    }
  } catch (cacheGetErr) {
    console.error("[getCachedUserData] failed to read from cache:", cacheGetErr);
  }

  console.debug("[getCachedUserData] cache miss:", userFid);
  const responseData = await fetchFunction();
  try {
    await kvStore.put(cacheKey, JSON.stringify(responseData));
  } catch (cachePutErr) {
    console.error("[getCachedUserData] failed to write to cache:", cachePutErr);
  }

  return responseData;
}

export function withCache<TArgs extends any[], TData>(
  fn: (...args: TArgs) => Promise<TData>,
  kvStore: KVNamespace,
  options?: {
    keyPrefix?: string;
    keyGenerator?: (args: TArgs) => string;
  }
): (...args: TArgs) => Promise<TData> {
  return async (...args: TArgs): Promise<TData> => {
    // Calculate cache key
    const keyPrefix = options?.keyPrefix || fn.name || 'cached_fn';
    const cacheKey = options?.keyGenerator
      ? options.keyGenerator(args)
      : `${keyPrefix}_${(args.map(arg => arg?.toString())).filter(Boolean).join('_')}`;

    // Try to get from cache
    try {
      const cachedData = await kvStore.get(cacheKey);
      if (cachedData) {
        console.debug("[createCachedFunction] Cache hit:", cacheKey);
        return JSON.parse(cachedData);
      }
    } catch (cacheGetErr) {
      console.error("[createCachedFunction] failed to read from cache:", cacheGetErr);
    }

    // Cache miss - execute function
    console.debug("[createCachedFunction] cache miss:", cacheKey);
    const result = await fn(...args);

    // Store in cache
    try {
      await kvStore.put(cacheKey, JSON.stringify(result));
    } catch (cachePutErr) {
      console.error("[createCachedFunction] failed to write to cache:", cachePutErr);
    }

    return result;
  };
}

export async function clearCache(key: string, kvStore: KVNamespace) {
  await kvStore.delete(`user_${key}`);
}
