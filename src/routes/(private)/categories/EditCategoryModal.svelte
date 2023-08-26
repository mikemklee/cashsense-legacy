<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ColorInput from '$lib/components/inputs/ColorInput.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';
	import type { Category } from '$lib/types';

	export let record: Category;
	export let showModal: boolean;
	export let onSubmit = (name: string, color: string) => {};

	$: enteredName = record.name;
	$: enteredColor = record.color;

	async function onNameChange(event: Event) {
		const name = (event.target as HTMLInputElement).value;
		enteredName = name;
	}

	async function onColorChange(event: Event) {
		const color = (event.target as HTMLInputElement).value;
		enteredColor = color;
	}

	async function handleSubmit() {
		onSubmit(enteredName, enteredColor);
	}
</script>

<Modal show={showModal} on:close>
	<h2 slot="header">Edit category</h2>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-y-4">
		<TextInput label="Name" value={enteredName} onChange={onNameChange} isRequired />
		<ColorInput label="Color" value={enteredColor} onChange={onColorChange} isRequired />
		<Button type="submit" text="Save" isDisabled={!enteredName || !enteredColor} />
	</form>
</Modal>
