const fetcher = async <T = unknown,>(
    ...args: Parameters<typeof fetch>
  ): Promise<T> => {
    const response = await fetch(...args);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  };

export default fetcher;