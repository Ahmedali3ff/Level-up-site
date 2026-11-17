import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

// GET helper. Pass null to skip the request (for example while waiting for another request).
export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: null });

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null });
      return undefined;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path)
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error }));
    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}
