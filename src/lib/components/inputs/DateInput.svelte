<script>
	export let label = '';
	export let value = '';
	export let onChange = () => {};
</script>

<div class="flex flex-col">
	<span class="text-sm">
		{label}
	</span>
	<input
		type="date"
		required
		bind:value
		on:change={onChange}
		class="px-2 py-1 border border-gray-400 bg-transparent rounded min-w-0 w-full"
	/>
</div>

<style>
	input {
		cursor: pointer;
		color-scheme: dark;
	}

	::-webkit-calendar-picker-indicator {
		cursor: pointer;
	}
</style>
