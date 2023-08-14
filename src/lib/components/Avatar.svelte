<script lang="ts">
	export let url: string;
	export let size: number;
</script>

<div>
	{#if url}
		<img src={url} width={size} height={size} alt="Avatar" class="rounded" />
	{:else}
		<div style="height: {size}px; width: {size}px" />
	{/if}
</div>
