<script lang="ts">
	import Icon from '@iconify/svelte';

	export let show: boolean;

	let dialog: HTMLDialogElement;
	$: if (dialog && show) dialog.showModal();
	$: if (dialog && !show) dialog.close();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close
	on:click|self={() => dialog.close()}
	class="bg-gray-800 text-[#d7d7d7] border border-gray-700 rounded"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<div class="flex items-center text-lg">
			<slot name="header" />
			<button on:click={() => dialog.close()} class="ml-auto">
				<Icon icon="tabler:x" />
			</button>
		</div>
		<hr class="my-4" />
		<slot />
	</div>
</dialog>

<style>
	dialog {
		width: 32em;
		padding: 0;
	}
	dialog::backdrop {
		background: #00000080;
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
