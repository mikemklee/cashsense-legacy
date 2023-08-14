<script>
	export let getValue;

	$: ({ getValue, ...rest } = $$props);

	const rawCentAmount = getValue();
	const absCentAmount = Math.abs(rawCentAmount);
	const formattedDollarAmount = (absCentAmount / 100).toLocaleString();

	const isNegative = rawCentAmount < 0;

	const direction = isNegative ? '-' : '';
	const color = isNegative ? 'text-red-400' : 'text-green-400';
</script>

<div class={color}>{direction}${formattedDollarAmount}</div>
