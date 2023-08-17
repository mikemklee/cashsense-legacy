<script>
	export let value; // raw amount in cents

	const absCentAmount = Math.abs(value);
	const formattedDollarAmount = (absCentAmount / 100).toLocaleString();

	const isNegative = value < 0;

	const direction = isNegative ? '-' : '';
	const color = isNegative ? 'text-red-400' : 'text-green-400';
</script>

<div class={color}>{direction}${formattedDollarAmount}</div>
