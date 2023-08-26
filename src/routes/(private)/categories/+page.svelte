<script lang="ts">
	import { onDestroy } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import CategoryTag from '$lib/components/CategoryTag.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import categoryStore from '$lib/stores/categories';
	import type { Category } from '$lib/types';
	import EditCategoryModal from './EditCategoryModal.svelte';
	import NewCategoryModal from './NewCategoryModal.svelte';

	let categories: Category[] = [];

	let selectedCategory: Category | undefined = undefined;
	let showNewCategoryModal = false;
	let showEditCategoryModal = false;

	const unsubscribeFromCategoryStore = categoryStore.subscribe((state) => {
		categories = state.data;

		if (categories.length > 0 && !selectedCategory) selectedCategory = categories[0];
	});

	async function onDelete(id?: string) {
		if (!id) return;
		await categoryStore.deleteCategory(id);
	}

	async function onSaveEdit(enteredName: string, enteredColor: string) {
		showEditCategoryModal = false;

		if (!selectedCategory) return;

		await categoryStore.updateCategory({
			id: selectedCategory.id,
			name: enteredName,
			color: enteredColor
		});
	}

	onDestroy(() => {
		unsubscribeFromCategoryStore();
	});
</script>

<div class="flex h-full">
	<!-- Side -->
	<section class="border-r border-r-gray-700 w-[380px]">
		<div class="p-6 border-b border-b-gray-700 flex items-center justify-between">
			<Heading isSnug>Categories</Heading>
			<Button text="New category" onClick={() => (showNewCategoryModal = true)} />
		</div>

		{#if categories.length > 0}
			<div class="flex flex-col">
				{#each categories as category}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="border-y border-gray-700 px-6 py-4
						flex items-center
						cursor-pointer hover:bg-gray-700 transition-all
						{selectedCategory?.id === category.id
							? 'opacity-100 bg-gray-700 border-transparent'
							: 'opacity-40'}"
						on:click={() => (selectedCategory = category)}
					>
						<CategoryTag color={category.color} name={category.name} />
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-gray-400 text-center mt-10">
				<span>You don't have any categories yet.</span>
			</div>
		{/if}
	</section>

	<!-- Main -->
	<section class="flex-grow p-6 pr-12">
		{#if selectedCategory}
			<div class="flex items-center gap-x-2">
				<div class="text-xl">
					<CategoryTag color={selectedCategory.color} name={selectedCategory.name} />
				</div>
				<div class="ml-auto flex gap-2">
					<Button text="Edit" onClick={() => (showEditCategoryModal = true)} style="secondary" />
					<Button text="Delete" onClick={() => onDelete(selectedCategory?.id)} style="alert" />
				</div>
			</div>
			<EditCategoryModal
				category={selectedCategory}
				showModal={showEditCategoryModal}
				onSubmit={onSaveEdit}
				on:close={() => (showEditCategoryModal = false)}
			/>
		{/if}
	</section>
</div>

<NewCategoryModal
	showModal={showNewCategoryModal}
	on:close={() => (showNewCategoryModal = false)}
	onSubmit={() => (showNewCategoryModal = false)}
/>
