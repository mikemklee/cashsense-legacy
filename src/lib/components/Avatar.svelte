<script lang="ts">
	import avatar from '$lib/assets/avatar.jpg';
	export let url: string | undefined | null;
	export let size: number;
</script>

<div>
	<img src={url || avatar} width={size} height={size} alt="Avatar" class="rounded" />
	<!-- {#if url}
	{:else}
		<div style="height: {size}px; width: {size}px" />
	{/if} -->
</div>
