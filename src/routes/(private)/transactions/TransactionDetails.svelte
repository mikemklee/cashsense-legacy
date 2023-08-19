<script lang="ts">
	import Icon from '@iconify/svelte';

	import AmountSpan from '$lib/components/AmountSpan.svelte';
	import Button from '$lib/components/Button.svelte';
	import CategoryTag from '$lib/components/CategoryTag.svelte';
	import DateSpan from '$lib/components/DateSpan.svelte';
	import Drawer from '$lib/components/Drawer.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import type { LiftedTransaction } from '$lib/types';

	import EditTransactionPanel from './EditTransactionPanel.svelte';
	import toast from 'svelte-french-toast';

	let showEditPanel = false;
	export let transaction: LiftedTransaction | null = null;

	export let onDeselect = () => {};

	// TODO: use transaction store
	const onDelete = async (transactionId?: string) => {
		await fetch(`/api/transactions?id=${transactionId}`, {
			method: 'DELETE'
		});

		toast.success('Transaction record deleted');

		handleDeselect();
	};

	const handleDeselect = () => {
		showEditPanel = false;
		onDeselect();
	};
</script>

<Drawer show={!!transaction} onClose={handleDeselect}>
	<div slot="header" class="p-6 flex items-center justify-between text-lg">
		<Heading isSnug>
			{#if showEditPanel}
				Edit record
			{:else}
				Transaction details
			{/if}
		</Heading>
	</div>

	{#if transaction && !showEditPanel}
		<div class="px-6 flex flex-col gap-2">
			<div>
				<span class="text-sm text-gray-400">Date</span>
				<DateSpan value={transaction.posted_at} />
			</div>

			<div>
				<span class="text-sm text-gray-400">Description</span>
				<div>{transaction.description}</div>
			</div>

			<div>
				<span class="text-sm text-gray-400">Category</span>
				<CategoryTag color={transaction.category.color} name={transaction.category.name} />
			</div>

			<div>
				<span class="text-sm text-gray-400">Account</span>
				<div>{transaction.account.name}</div>
			</div>

			<div>
				<span class="text-sm text-gray-400">Amount</span>
				<AmountSpan value={transaction.amount} />
			</div>
		</div>

		<div class="flex justify-end px-6 gap-4 mt-4">
			<Button text="Edit" style="secondary" onClick={() => (showEditPanel = true)} />
			<Button text="Delete" style="alert" onClick={() => onDelete(transaction?.id)} />
		</div>
	{:else if transaction && showEditPanel}
		<EditTransactionPanel
			{transaction}
			onClose={() => (showEditPanel = false)}
			onSubmit={handleDeselect}
		/>
	{/if}
</Drawer>
