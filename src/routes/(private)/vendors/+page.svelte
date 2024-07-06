<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import vendorStore from '$lib/stores/vendors';
	import type { Vendor } from '$lib/types';
	import NewVendorModal from './NewVendorModal.svelte';
	import DeleteVendorModal from './DeleteVendorModal.svelte';

	let vendors: Vendor[] = [];

	let selectedVendor: Vendor | undefined = undefined;
	let showNewVendorModal = false;
	let showDeleteVendorModal = false;

	const unsubscribeFromVendorStore = vendorStore.subscribe((state) => {
		vendors = state.data;

		if (vendors.length > 0) selectedVendor = vendors[0];
	});

	onDestroy(() => {
		unsubscribeFromVendorStore();
	});

	function onSelectVendor(vendor: Vendor) {
		selectedVendor = vendor;
	}

	async function onDeleteVendor(id?: string) {
		showDeleteVendorModal = false;
		if (!id) return;
		await vendorStore.deleteVendor(id);
	}
</script>

<div class="flex h-full">
	<!-- Side -->
	<section class="border-r border-r-gray-700 w-[340px]">
		<div class="p-6 border-b border-b-gray-700 flex items-center justify-between">
			<Heading isSnug>Vendors</Heading>
			<Button text="New vendor" onClick={() => (showNewVendorModal = true)} />
		</div>

		{#if vendors.length > 0}
			<div class="flex flex-col">
				{#each vendors as vendor}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="border-y border-gray-700 px-6 py-4
							flex items-center
							cursor-pointer hover:bg-gray-700 transition-all
							{selectedVendor?.id === vendor.id ? 'opacity-100 bg-gray-700 border-transparent' : 'opacity-40'}"
						on:click={() => onSelectVendor(vendor)}
					>
						<div class="flex flex-col grow">
							<span class="font-semibold">{vendor.name}</span>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-gray-400 text-center mt-10">
				<span>You don't have any vendors yet.</span>
			</div>
		{/if}
	</section>

	<!-- Main -->
	<section class="flex-grow p-6 pr-12">
		{#if selectedVendor}
			<div class="flex items-center gap-x-2">
				<div class="text-xl">
					{selectedVendor.name}
				</div>
				<div class="ml-auto">
					<Button text="Delete" onClick={() => (showDeleteVendorModal = true)} style="alert" />
				</div>
			</div>
			<DeleteVendorModal
				vendor={selectedVendor}
				showModal={showDeleteVendorModal}
				onSubmit={onDeleteVendor}
				on:close={() => (showDeleteVendorModal = false)}
			/>
		{/if}

		{#if vendors.length === 0}
			<div class="rounded border border-indigo-400 max-w-md p-2 text-sm">
				<span class="text-indigo-400">Tip</span>
				<div class="flex flex-col gap-y-2">
					<p>A vendor is a person or company that was invovled in a transaction with you.</p>
					<p>Click on the "New vendor" button on the top left corner to add your first vendor!</p>
				</div>
			</div>
		{/if}
	</section>
</div>

<NewVendorModal
	showModal={showNewVendorModal}
	on:close={() => (showNewVendorModal = false)}
	onSubmit={() => {
		showNewVendorModal = false;
	}}
/>
