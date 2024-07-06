<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';

	let name = '';

	export let showModal: boolean;
	export let onSubmit = () => {};

	function resetFields() {
		name = '';
	}

	async function handleSubmit() {
		await fetch('/api/vendors', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name })
		});

		name = '';

		onSubmit();
		resetFields();
	}
</script>

<Modal show={showModal} on:close>
	<h2 slot="header">New vendor</h2>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-y-4">
		<TextInput label="Name" bind:value={name} isRequired />
		<Button type="submit" text="Save" isDisabled={!name} />
	</form>
</Modal>
