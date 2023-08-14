<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	export let show: boolean = true;
	export let onClose = () => {};
</script>

{#if show}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="absolute w-full h-full bg-[#00000040] z-10"
		on:click={onClose}
		transition:fade={{ duration: 100 }}
	>
		<div
			transition:slide={{ duration: 100, axis: 'x' }}
			class="border-r border-gray-700 bg-gray-800 w-auto max-w-[500px] h-full"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click|stopPropagation class="h-full">
				<slot name="header" />
				<slot />
			</div>
		</div>
	</div>
{/if}
