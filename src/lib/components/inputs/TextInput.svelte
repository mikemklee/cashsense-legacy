<script>
	export let id = '';
	export let label = '';
	export let value = '';
	export let isRequired = false;
	export let isDisabled = false;
</script>

<div class="flex flex-col">
	<span class="text-sm">{label}{isRequired ? '*' : ''}</span>
	<label for={id} />
	<input
		{id}
		name={id}
		type="text"
		bind:value
		required={isRequired}
		disabled={isDisabled}
		class="px-2 py-1 border border-gray-400 bg-transparent rounded {isDisabled ? 'opacity-40' : ''}"
	/>
</div>
