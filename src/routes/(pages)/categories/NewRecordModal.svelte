<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Modal from '$lib/Modal.svelte';
	import TextInput from '$lib/inputs/TextInput.svelte';
	import ColorInput from '$lib/inputs/ColorInput.svelte';

	export let showModal: boolean;
	export let onSubmit = () => {};

	let enteredName = '';
	let enteredColor = '#AAB7B8';

	function resetFields() {
		enteredName = '';
		enteredColor = '#AAB7B8';
	}

	async function handleSubmit() {
		await fetch('/api/categories', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: enteredName,
				color: enteredColor
			})
		});

		onSubmit();
		resetFields();
	}
</script>

<Modal show={showModal} on:close>
	<h2 slot="header">New category</h2>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-y-4">
		<TextInput label="Name" bind:value={enteredName} isRequired />
		<ColorInput label="Color" bind:value={enteredColor} isRequired />

		<Button type="submit" text="Save" isDisabled={!enteredName || !enteredColor} />
	</form>
</Modal>
