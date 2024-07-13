<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	export let label = '';
	export let value = '';
	export let onChange: ChangeEventHandler<HTMLInputElement> = () => {};
	export let isRequired = false;
</script>

<div class="flex flex-col">
	<span class="text-sm">{label}{isRequired ? '*' : ''}</span>
	<input
		type="color"
		bind:value
		class="px-2 py-1 border border-gray-600 rounded"
		on:change={onChange}
		required={isRequired}
	/>
</div>
