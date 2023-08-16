<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import CategoryTag from '$lib/components/CategoryTag.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import type { Category } from '$lib/types';
	import EditRecordModal from './EditRecordModal.svelte';
	import NewRecordModal from './NewRecordModal.svelte';

	let categories: Category[] = [];

	let selectedRecord: Category | undefined = undefined;
	let showNewRecordModal = false;
	let showEditRecordModal = false;

	async function fetchCategories() {
		const response = await fetch('/api/categories');
		const data = await response.json();
		categories = data;

		if (categories.length > 0) selectedRecord = categories[0];
	}

	async function onDelete(accountId: number) {
		await fetch(`/api/categories?id=${accountId}`, {
			method: 'DELETE'
		});

		fetchCategories();
	}

	function onEdit(record: Category) {
		showEditRecordModal = true;
		selectedRecord = record;
	}

	function onClick(record: Category) {
		selectedRecord = record;
	}

	onMount(() => {
		fetchCategories();
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
						on:click={() => onClick(category)}
					>
						<CategoryTag color={category.color} name={category.name} />

						<div class="ml-auto flex gap-x-2 text-lg">
							<button on:click={() => onEdit(category)}>
								<Icon icon="tabler:edit" />
							</button>
							<button on:click={() => onDelete(category.id)}>
								<Icon icon="tabler:trash" />
							</button>
						</div>
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
			<div class="flex items-center gap-x-2 text-xl">
				<CategoryTag color={selectedRecord.color} name={selectedRecord.name} />
			</div>
		{/if}
	</section>
</div>

<NewRecordModal
	showModal={showNewRecordModal}
	on:close={() => (showNewRecordModal = false)}
	onSubmit={() => {
		fetchCategories();
		showNewRecordModal = false;
	}}
/>
{#if selectedRecord}
	<EditRecordModal
		record={selectedRecord}
		showModal={showEditRecordModal}
		on:close={() => {
			showEditRecordModal = false;
			selectedRecord = undefined;
		}}
		onSubmit={() => {
			fetchCategories();
			showEditRecordModal = false;
		}}
	/>
{/if}
