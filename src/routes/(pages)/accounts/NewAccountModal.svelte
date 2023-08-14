<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import SelectInput from '$lib/components/inputs/SelectInput.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';

	let name = '';
	let type = '';

	export let showModal: boolean;
	export let onSubmit = () => {};

	function resetFields() {
		name = '';
		type = '';
	}

	async function handleSubmit() {
		await fetch('/api/accounts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, type })
		});

		name = '';
		type = '';

		onSubmit();
		resetFields();
	}

	const accountTypeOptions = [
		{ label: 'Bank account', value: 'bank_account' },
		{ label: 'Credit card', value: 'credit_card' }
	];
</script>

<Modal show={showModal} on:close>
	<h2 slot="header">New account</h2>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-y-4">
		<TextInput label="Name" bind:value={name} isRequired />
		<SelectInput label="Type" isRequired options={accountTypeOptions} bind:value={type} />
		<Button type="submit" text="Save" isDisabled={!name || !type} />
	</form>
</Modal>
