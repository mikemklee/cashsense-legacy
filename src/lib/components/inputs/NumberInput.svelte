<script lang="ts">
	export let label = '';
	export let value = 0;
	export let isRequired = false;

	const onFocus = (e: FocusEvent) => {
		(e.target as HTMLInputElement).select();
	};
</script>

<div class="flex flex-col">
	<span class="text-sm">{label}{isRequired ? '*' : ''}</span>
	<input
		type="number"
		step=".01"
		bind:value
		required={isRequired}
		class="px-2 py-1 border border-gray-400 bg-transparent rounded"
		on:focus={onFocus}
	/>
</div>
