<script>
	export let label = '';
	export let value = '';
	export let isRequired = false;
</script>

<div class="flex flex-col">
	<span class="text-sm">{label}{isRequired ? '*' : ''}</span>
	<input
		type="text"
		bind:value
		required={isRequired}
		class="px-2 py-1 border border-gray-400 bg-transparent rounded"
	/>
</div>
