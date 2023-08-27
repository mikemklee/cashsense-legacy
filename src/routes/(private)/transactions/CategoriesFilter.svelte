<script lang="ts">
	import Icon from '@iconify/svelte';

	import CategoryTag from '$lib/components/CategoryTag.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Selectable from '$lib/components/Selectable.svelte';
	import type { Category } from '$lib/types';

	export let categories: Category[] = [];
	export let selectedCategories: string[] = [];
	export let onSelectCategoryFilterItem: (id: string) => void;
	export let onClearAllCategories: () => void;
	export let onSelectAllCategories: () => void;
</script>

<Heading size="md">
	<div class="flex">
		Categories
		{#if categories.length === 0}
			<span class="relative flex h-2.5 w-2.5 ml-1">
				<span
					class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
				/>
				<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
			</span>
		{/if}
	</div>
</Heading>

{#if categories.length > 0}
	<div class="my-2 flex flex-col gap-2">
		{#each categories as category}
			<Selectable
				on:click={() => onSelectCategoryFilterItem(category.id)}
				isSelected={selectedCategories.includes(category.id)}
			>
				<div class="h-8 flex justify-between items-center w-full">
					<CategoryTag color={category.color} name={category.name} />
					{#if selectedCategories.includes(category.id) && selectedCategories.length === 1}
						<!-- Option to select all, if this is the only one selected -->
						<button
							class="ml-auto opacity-10 text-sm hover:opacity-100"
							on:click|stopPropagation={onSelectAllCategories}
						>
							All
						</button>
					{:else}
						<!-- Otherwise, give option to select only this one -->
						<button
							class="ml-auto opacity-10 text-sm hover:opacity-100"
							on:click|stopPropagation={() => {
								onClearAllCategories();
								onSelectCategoryFilterItem(category.id);
							}}
						>
							Only
						</button>
					{/if}
				</div>
			</Selectable>
		{/each}
	</div>

	<div class="flex justify-between">
		<span class="text-sm text-gray-400">
			{selectedCategories.length} categories selected
		</span>
		{#if selectedCategories.length > 0}
			<button
				class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
				on:click={onClearAllCategories}>Clear all</button
			>
		{:else}
			<button
				class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
				on:click={onSelectAllCategories}>Select all</button
			>
		{/if}
	</div>
{:else}
	<div class="text-sm text-gray-400">
		<span>You don't have any categories yet.</span>
		<span class="flex items-center">
			<a
				href="/categories"
				class="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
			>
				Add one here
				<Icon icon="tabler:arrow-right" class="inline-block text-lg" />
			</a>
		</span>
	</div>
{/if}
