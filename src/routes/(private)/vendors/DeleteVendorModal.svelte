<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { Vendor } from '$lib/types';

	export let vendor: Vendor;
	export let showModal: boolean;
	export let onSubmit: Function;
</script>

<Modal show={showModal} on:close>
	<h2 slot="header">Delete vendor</h2>
	<form on:submit|preventDefault={() => onSubmit(vendor.id)} class="flex flex-col gap-y-4">
		<p>Are you sure you want to delete this vendor?</p>
		<div class="flex flex-col grow">
			<span class="font-semibold">{vendor.name}</span>
		</div>
		<div class="flex justify-end">
			<Button type="submit" style="alert" text="Yes, delete it" />
		</div>
	</form>
</Modal>
