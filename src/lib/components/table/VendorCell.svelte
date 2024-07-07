<script lang="ts">
	import type { LiftedTransaction } from '$lib/types';

	let transaction: LiftedTransaction;

	$: {
		let { row, ...rest } = $$props;
		transaction = row.original;
	}
</script>

<div class="flex items-center gap-2">
	{transaction?.vendor?.name || ''}
</div>
