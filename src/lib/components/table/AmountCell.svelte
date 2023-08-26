<script lang="ts">
	import type { LiftedTransaction } from '$lib/types';
	import Icon from '@iconify/svelte';
	import AmountSpan from '../AmountSpan.svelte';

	export let getValue;
	let transaction: LiftedTransaction;

	$: {
		let { getValue, row, ...rest } = $$props;
		transaction = row.original;
	}

	const rawCentAmount = getValue();
</script>

<div class="flex items-center gap-2">
	<AmountSpan value={rawCentAmount} />
	{#if transaction.adjustments.length > 0}
		<Icon icon="tabler:asterisk" class="text-gray-400" />
	{/if}
</div>
