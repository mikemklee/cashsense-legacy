<script lang="ts">
	import { onDestroy } from 'svelte';
	import toast from 'svelte-french-toast';

	import Button from '$lib/components/Button.svelte';
	import CategoryTag from '$lib/components/CategoryTag.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import categoryStore from '$lib/stores/categoryStore';
	import type { Category } from '$lib/types';
	import EditRecordModal from './EditRecordModal.svelte';
	import NewRecordModal from './NewRecordModal.svelte';

	let categories: Category[] = [];

	let selectedRecord: Category | undefined = undefined;
	let showNewRecordModal = false;
	let showEditRecordModal = false;

	const unsubscribeFromCategoryStore = categoryStore.subscribe((state) => {
		categories = state.data;

		if (categories.length > 0 && !selectedRecord) selectedRecord = categories[0];
	});

	async function onDelete(accountId?: string) {
		try {
			const response = await fetch(`/api/categories?id=${accountId}`, {
				method: 'DELETE'
			});
			if (response.ok) {
				toast.success('Category deleted');
			} else {
				throw response;
			}
		} catch (error) {
			toast.error('Something went wrong while deleting category');
		}
	}

	async function onSaveEdit(enteredName: string, enteredColor: string) {
		showEditRecordModal = false;

		if (!selectedRecord) return;

		await fetch('/api/categories', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: selectedRecord.id,
				name: enteredName,
				color: enteredColor
			})
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
			<Button text="New category" onClick={() => (showNewRecordModal = true)} />
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
						{selectedRecord?.id === category.id ? 'opacity-100 bg-gray-700 border-transparent' : 'opacity-40'}"
						on:click={() => (selectedRecord = category)}
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
		{#if selectedRecord}
			<div class="flex items-center gap-x-2">
				<div class="text-xl">
					<CategoryTag color={selectedRecord.color} name={selectedRecord.name} />
				</div>
				<div class="ml-auto flex gap-2">
					<Button text="Edit" onClick={() => (showEditRecordModal = true)} style="secondary" />
					<Button text="Delete" onClick={() => onDelete(selectedRecord?.id)} style="alert" />
				</div>
			</div>
			<EditRecordModal
				record={selectedRecord}
				showModal={showEditRecordModal}
				onSubmit={onSaveEdit}
				on:close={() => (showEditRecordModal = false)}
			/>
		{/if}
	</section>
</div>

<NewRecordModal
	showModal={showNewRecordModal}
	on:close={() => (showNewRecordModal = false)}
	onSubmit={() => (showNewRecordModal = false)}
/>
