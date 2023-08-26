<script lang="ts">
	export let isSelected = false;
</script>

<button
	class="border border-gray-600 rounded px-2 py-0.5
		flex items-center gap-x-2
		cursor-pointer hover:bg-gray-700 hover:border-gray-600 transition-all
		{isSelected ? 'opacity-100' : 'opacity-25'}"
	on:click
>
	<slot />
</button>
