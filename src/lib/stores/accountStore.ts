import type { Account } from '$lib/types';
import { writable } from 'svelte/store';

interface ApiResponse<T> {
  data: Account[];
  loading: boolean;
  error: Error | null;
}

const createStore = <T>() => {
  const { subscribe, set, update } = writable<ApiResponse<T>>({
    data: [],
    loading: false,
    error: null
  });

  const fetchAccounts = async () => {
    update((state) => ({ ...state, loading: true, error: null }));
    try {
      const response = await fetch('/api/accounts');
      const data = await response.json();

      update((state) => ({ ...state, data, loading: false }));
      return data;
    } catch (error) {
      update((state) => ({ ...state, loading: false, error: error as Error, }));
    }
  }

  return {
    fetchAccounts,
    subscribe,
    set,
    update,
  };
};

const accountStore = createStore();

export default accountStore