<script>
	import AmountSpan from '../AmountSpan.svelte';

	export let getValue;

	$: ({ getValue, ...rest } = $$props);

	const rawCentAmount = getValue();
</script>

<AmountSpan value={rawCentAmount} />
