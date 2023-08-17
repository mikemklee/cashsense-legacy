<script lang="ts" context="module">
	export interface Option {
		label: string;
		value: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	export let label = '';
	export let options: Option[] = [];
	export let value = '';
	export let isRequired = false;
	export let defaultValue = '';

	onMount(() => {
		if (defaultValue) {
			value = defaultValue;
		} else {
			value = options[0].value;
		}
	});
</script>

<div class="flex flex-col">
	<span class="text-sm">{label}{isRequired ? '*' : ''}</span>
	<select
		bind:value
		class="px-2 py-1 border border-gray-400 bg-transparent rounded"
		required={isRequired}
	>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>

<style>
	select {
		appearance: none; /* Remove default appearance */
		background-color: transparent; /* Remove default background */
	}
</style>
