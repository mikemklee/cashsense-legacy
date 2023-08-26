import type { Category } from '$lib/types';
import toast from 'svelte-french-toast';
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
      console.error(error)
      update((state) => ({ ...state, loading: false, error: error as Error, }));
    }
  }

  const createCategory = async (createData: any) => {
    update((state) => ({ ...state, loading: true, error: null }));

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      });

      const [createdCategory] = await response.json();

      update((state) => ({
        ...state, data: [
          ...state.data,
          createdCategory
        ], loading: false,
      }));

      toast.success(`Category created`);
    } catch (error) {
      console.error(error)
      update((state) => ({ ...state, loading: false, error: error as Error }));
      toast.error(`Something went wrong while creating category`);
    }
  }

  const updateCategory = async (updateData: any) => {
    update((state) => ({ ...state, loading: true, error: null }));

    try {
      const response = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const [updatedRecord] = await response.json();

      update((state) => {
        const updatedData = state.data
          .map((category) => category.id === updatedRecord.id
            ? updatedRecord
            : category
          );
        return { ...state, data: updatedData, loading: false }
      });

      toast.success(`Category updated`);
    } catch (error) {
      console.error(error)
      update((state) => ({ ...state, loading: false, error: error as Error }));
      toast.error(`Something went wrong while updating category`);
    }
  }

  const deleteCategory = async (id: string) => {
    update((state) => ({ ...state, loading: true, error: null }));

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        update((state) => {
          const updatedData = state.data.filter((category) => category.id !== id);
          return { ...state, data: updatedData, loading: false }
        });

        toast.success(`Category deleted`);
      } else {
        throw response
      }
    } catch (error) {
      console.error(error)
      update((state) => ({ ...state, loading: false, error: error as Error }));
      toast.error(`Something went wrong while deleting category`);
    }
  }

  return {
    createCategory,
    fetchCategories,
    updateCategory,
    deleteCategory,
    subscribe,
    set,
    update,
  };
};

const categoryStore = createStore();

export default categoryStore