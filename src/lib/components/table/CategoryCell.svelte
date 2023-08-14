<script>
	import CategoryTag from '$lib/components/CategoryTag.svelte';

	export let getValue;

	$: ({ getValue, ...rest } = $$props);

	const category = getValue();
</script>

<CategoryTag color={category.color} name={category.name} />
