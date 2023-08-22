<script>
	import Icon from '@iconify/svelte';

	export let value = '';
	export let placeholder = '';
	export let isDisabled = false;
</script>

<form on:submit|preventDefault class="flex relative">
	<span class="absolute top-2 text-lg left-2 text-gray-400">
		<Icon icon="tabler:search" />
	</span>
	<input
		type="search"
		bind:value
		on:input
		{placeholder}
		disabled={isDisabled}
		class="pl-8 pr-2 py-1 border border-gray-600 bg-transparent rounded outline-none w-[220px]
    {isDisabled ? 'opacity-40' : ''}"
	/>
</form>

<style>
	input::placeholder {
		@apply text-gray-500;
	}
</style>
