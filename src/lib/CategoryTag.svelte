<script lang="ts">
	export let color: string;
	export let name: string;
</script>

<div class="flex items-center gap-x-2">
	<span class="w-1.5 h-4 rounded-sm" style="background-color: {color};" />
	<span>{name}</span>
</div>
