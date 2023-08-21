<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	export let show: boolean = true;
	export let onClose = () => {};
</script>

{#if show}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="absolute w-full h-full bg-[#00000040] z-10"
		on:click={onClose}
		transition:fade={{ duration: 100 }}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="border-r border-gray-700 bg-gray-800 w-auto max-w-[500px] h-screen sticky top-14"
			on:click|stopPropagation
		>
			<slot name="header" />
			<slot />
		</div>
	</div>
{/if}
