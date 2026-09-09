import { useCallback, useEffect, useState } from 'react';

/**
 * Hook simples para chamadas de leitura com estados de loading/erro/dados.
 * fetcher deve ser uma funcao estavel (ex: useCallback) que retorna uma Promise.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | error | empty
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      const isEmpty = Array.isArray(result) && result.length === 0;
      setStatus(isEmpty ? 'empty' : 'success');
    } catch (err) {
      setError(err);
      setStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, status, error, reload: load };
}

export function useAsyncAction() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);

  const run = useCallback(async (fn) => {
    setStatus('loading');
    setError(null);
    try {
      const result = await fn();
      setStatus('success');
      return result;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, run, reset };
}
