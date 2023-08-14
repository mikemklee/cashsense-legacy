<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ColorInput from '$lib/components/inputs/ColorInput.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';
	import type { Category } from '$lib/types';

	export let record: Category;
	export let showModal: boolean;
	export let onSubmit = () => {};

	let enteredName = record.name;
	let enteredColor = record.color;

	function resetFields() {
		enteredName = '';
		enteredColor = '#AAB7B8';
	}

	async function handleSubmit() {
		await fetch('/api/categories', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: record.id,
				name: enteredName,
				color: enteredColor
			})
		});

		onSubmit();
		resetFields();
	}
</script>

<Modal show={showModal} on:close>
	<h2 slot="header">Edit category</h2>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-y-4">
		<TextInput label="Name" bind:value={enteredName} isRequired />
		<ColorInput label="Color" bind:value={enteredColor} isRequired />

		<Button type="submit" text="Save" isDisabled={!enteredName || !enteredColor} />
	</form>
</Modal>
