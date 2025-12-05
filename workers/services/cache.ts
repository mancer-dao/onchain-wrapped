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

export async function clearCache(key: string, kvStore: KVNamespace) {
  await kvStore.delete(`user_${key}`);
}
