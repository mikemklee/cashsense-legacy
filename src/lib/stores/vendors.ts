import type { Vendor } from '$lib/types';
import toast from 'svelte-french-toast';
import { writable } from 'svelte/store';

interface ApiResponse<T> {
  data: Vendor[];
  loading: boolean;
  error: Error | null;
}

const createStore = <T>() => {
  const { subscribe, set, update } = writable<ApiResponse<T>>({
    data: [],
    loading: false,
    error: null
  });

  const fetchVendors = async () => {
    update((state) => ({ ...state, loading: true, error: null }));
    try {
      const response = await fetch('/api/vendors');
      const data = await response.json();

      update((state) => ({ ...state, data, loading: false }));
      return data;
    } catch (error) {
      update((state) => ({ ...state, loading: false, error: error as Error, }));
    }
  }

  const deleteVendor = async (id: string) => {
    update((state) => ({ ...state, loading: true, error: null }));

    try {
      const response = await fetch(`/api/vendors?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        update((state) => {
          const updatedData = state.data.filter((vendor) => vendor.id !== id);
          return { ...state, data: updatedData, loading: false }
        });

        toast.success(`Vendor deleted`);
      } else {
        throw response
      }
    } catch (error) {
      console.error(error)
      update((state) => ({ ...state, loading: false, error: error as Error }));
      toast.error(`Something went wrong while deleting vendor`);
    }
  }

  return {
    fetchVendors,
    deleteVendor,
    subscribe,
    set,
    update,
  };
};

const vendorStore = createStore();

export default vendorStore