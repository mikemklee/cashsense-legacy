import type { Category } from '$lib/types';
import { writable } from 'svelte/store';

interface ApiResponse<T> {
  data: Category[];
  loading: boolean;
  error: Error | null;
}

const createStore = <T>() => {
  const { subscribe, set, update } = writable<ApiResponse<T>>({
    data: [],
    loading: false,
    error: null
  });

  const fetchCategories = async () => {
    update((state) => ({ ...state, loading: true, error: null }));
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      update((state) => ({ ...state, data, loading: false }));
      return data;
    } catch (error) {
      update((state) => ({ ...state, loading: false, error: error as Error, }));
    }
  }

  return {
    fetchCategories,
    subscribe,
    set,
    update,
  };
};

const categoryStore = createStore();

export default categoryStore