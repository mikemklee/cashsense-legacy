<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CategoryTag from '$lib/components/CategoryTag.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { Category } from '$lib/types';

	export let category: Category;
	export let showModal: boolean;
	export let onSubmit: Function;
</script>

<Modal show={showModal} on:close>
	<h2 slot="header">Delete category</h2>
	<form on:submit|preventDefault={() => onSubmit(category.id)} class="flex flex-col gap-y-4">
		<p>Are you sure you want to delete this category?</p>
		<CategoryTag color={category.color} name={category.name} />
		<div class="flex justify-end">
			<Button type="submit" style="alert" text="Yes, delete it" />
		</div>
	</form>
</Modal>
