<script lang="ts">
	import { slide } from 'svelte/transition';

	export let show: boolean;
</script>

{#if show}
	<div
		transition:slide={{ duration: 200 }}
		class="border-b border-gray-700 rounded flex flex-col p-6"
	>
		<slot name="header" />
		<slot />
	</div>
{/if}
