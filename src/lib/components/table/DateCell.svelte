<script>
	import DateSpan from '../DateSpan.svelte';

	export let getValue;

	$: ({ getValue, ...rest } = $$props);

	const date = getValue();
</script>

<DateSpan value={date} />
