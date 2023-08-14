<script lang="ts">
	import Icon from '@iconify/svelte';
	import { format as dateFormat, startOfMonth } from 'date-fns';
	import { onMount } from 'svelte';

	import Button from '$lib/Button.svelte';
	import CategoryTag from '$lib/CategoryTag.svelte';
	import Drawer from '$lib/Drawer.svelte';
	import Heading from '$lib/Heading.svelte';
	import Selectable from '$lib/Selectable.svelte';
	import DateInput from '$lib/inputs/DateInput.svelte';
	import AmountCell from '$lib/table/AmountCell.svelte';
	import CategoryCell from '$lib/table/CategoryCell.svelte';
	import DataTable from '$lib/table/DataTable.svelte';
	import type { Account, Category, LiftedTransaction } from '$lib/types';
	import NewTransactionPanel from './NewTransactionPanel.svelte';
	import TransactionInsights from './TransactionInsights.svelte';

	let transactions: LiftedTransaction[] = [];
	let selectedStartDate: Date | null = startOfMonth(new Date('2023-07-02'));
	let selectedEndDate: Date | null = new Date();

	let showCollapsible = false;
	let selectedTransaction: LiftedTransaction | null = null;

	$: formattedStartDate = selectedStartDate ? dateFormat(selectedStartDate, 'yyyy-MM-dd') : '';
	$: formattedEndDate = selectedEndDate ? dateFormat(selectedEndDate, 'yyyy-MM-dd') : '';

	async function fetchTransactions() {
		let queryPath = '/api/transactions';

		queryPath += `?startDate=${formattedStartDate}`;
		queryPath += `&endDate=${formattedEndDate}`;

		const response = await fetch(queryPath);
		const data = await response.json();

		console.log(data);

		transactions = data.filter(
			(transaction: LiftedTransaction) =>
				selectedCategories.includes(transaction.category_id) &&
				selectedAccounts.includes(transaction.account_id)
		);
	}

	async function onDelete(transactionId: number) {
		await fetch(`/api/transactions?id=${transactionId}`, {
			method: 'DELETE'
		});

		await fetchTransactions();
	}

	function onSelectTransaction(transaction: LiftedTransaction | null) {
		selectedTransaction = transaction;
	}

	function onDeselectTransaction() {
		selectedTransaction = null;
	}

	let accounts: Account[] = [];
	let selectedAccounts: number[] = [];

	async function fetchAccounts() {
		const response = await fetch('/api/accounts');
		const data = await response.json();
		accounts = data;
		selectedAccounts = data.map((account: Account) => account.id);
	}

	async function onSelectAccountFilterItem(accountId: number) {
		if (selectedAccounts.includes(accountId)) {
			selectedAccounts = selectedAccounts.filter((id) => id !== accountId);
		} else {
			selectedAccounts = [...selectedAccounts, accountId];
		}

		await fetchTransactions();
	}

	async function onClearAllAccounts() {
		selectedAccounts = [];
		await fetchTransactions();
	}

	async function onSelectAllAccounts() {
		selectedAccounts = accounts.map((account) => account.id);
		await fetchTransactions();
	}

	let categories: Category[] = [];
	let selectedCategories: number[] = [];

	async function fetchCategories() {
		const response = await fetch('/api/categories');
		const data = await response.json();

		categories = data;
		selectedCategories = data
			.map((category: Category) => category.id)
			.filter((id: number) => id !== 3);
	}

	async function onSelectCategoryFilterItem(categoryId: number) {
		if (selectedCategories.includes(categoryId)) {
			selectedCategories = selectedCategories.filter((id) => id !== categoryId);
		} else {
			selectedCategories = [...selectedCategories, categoryId];
		}

		await fetchTransactions();
	}

	async function onClearAllCategories() {
		selectedCategories = [];
		await fetchTransactions();
	}

	async function onSelectAllCategories() {
		selectedCategories = categories.map((category) => category.id);
		await fetchTransactions();
	}

	onMount(async () => {
		await fetchCategories();
		await fetchAccounts();
		await fetchTransactions();
	});

	const columns = [
		{
			header: 'Date',
			accessorKey: 'posted_at',
			cell: (info) => {
				const date = new Date(info.getValue());

				const timeMs = date.getTime();
				const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
				const adjustedTimeMs = timeMs + tzOffsetMs;

				return dateFormat(adjustedTimeMs, 'MMM d, yyyy');
			}
		},
		{
			header: 'Description',
			accessorKey: 'description'
		},
		{
			header: 'Category',
			accessorFn: (transaction: LiftedTransaction) => transaction.category,
			cell: () => CategoryCell
		},
		{
			header: 'Account',
			accessorFn: (transaction: LiftedTransaction) => transaction.account.name
		},
		{
			header: 'Amount',
			accessorKey: 'amount',
			cell: () => AmountCell
		}
	];

	const humanizeAccountType = (type: string) => {
		switch (type) {
			case 'bank_account':
				return 'Bank account';
			case 'credit_card':
				return 'Credit card';
			default:
				return 'Unknown';
		}
	};
</script>

<div class="flex h-full">
	<!-- Side -->
	<section class="border-r border-r-gray-700 w-[380px]">
		<div class="p-6 border-b border-b-gray-700 flex items-center justify-between">
			<Heading isSnug>Transactions</Heading>
			<Button text="New record" onClick={() => (showCollapsible = !showCollapsible)} />
		</div>

		<NewTransactionPanel
			showPanel={showCollapsible}
			onClose={() => (showCollapsible = false)}
			onSubmit={() => {
				fetchTransactions();
				showCollapsible = false;
			}}
		/>

		<div class="p-6">
			<Heading size="lg">Filters</Heading>

			<div class="flex items-end gap-x-4 mt-6">
				<DateInput label="From" bind:value={formattedStartDate} onChange={fetchTransactions} />
				<DateInput label="To" bind:value={formattedEndDate} onChange={fetchTransactions} />
			</div>

			{#if categories.length > 0}
				<div class="mt-6">
					<Heading size="md">Categories</Heading>

					<div class="my-2 flex flex-wrap gap-2">
						{#each categories as category}
							<Selectable
								on:click={() => onSelectCategoryFilterItem(category.id)}
								isSelected={selectedCategories.includes(category.id)}
							>
								<CategoryTag color={category.color} name={category.name} />
							</Selectable>
						{/each}
					</div>

					<div class="flex justify-between">
						<span class="text-sm text-gray-400">
							{selectedCategories.length} categories selected
						</span>
						{#if selectedCategories.length > 0}
							<button
								class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
								on:click={onClearAllCategories}>Clear all</button
							>
						{:else}
							<button
								class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
								on:click={onSelectAllCategories}>Select all</button
							>
						{/if}
					</div>
				</div>
			{/if}

			{#if accounts.length > 0}
				<div class="mt-6">
					<Heading size="md">Accounts</Heading>

					<div class="my-2 flex flex-col gap-2">
						{#each accounts as account}
							<Selectable
								on:click={() => onSelectAccountFilterItem(account.id)}
								isSelected={selectedAccounts.includes(account.id)}
							>
								<div class="flex items-center px-4 py-2 rounded">
									<Icon
										icon={account.type === 'bank_account'
											? 'tabler:building-bank'
											: 'tabler:credit-card'}
										height={26}
										class="mr-2"
									/>
									<div class="flex flex-col text-left">
										<span class="font-semibold mr-4">{account.name}</span>
										<span class="text-sm">{humanizeAccountType(account.type)}</span>
									</div>
								</div>
							</Selectable>
						{/each}
					</div>

					<div class="flex justify-between">
						<span class="text-sm text-gray-400">
							{selectedAccounts.length} accounts selected
						</span>
						{#if selectedAccounts.length > 0}
							<button
								class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
								on:click={onClearAllAccounts}>Clear all</button
							>
						{:else}
							<button
								class="ml-auto text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
								on:click={onSelectAllAccounts}>Select all</button
							>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Main -->
	<div class="relative flex-grow">
		<Drawer show={!!selectedTransaction} onClose={onDeselectTransaction}>
			<div slot="header" class="p-6 flex items-center justify-between mb-4 text-lg">
				<Heading isSnug>Transaction details</Heading>
				<button on:click={onDeselectTransaction}>
					<Icon icon="tabler:x" />
				</button>
			</div>

			<div class="p-6">TODO: Show details here</div>
			<div class="p-6">TODO: Show picture here</div>
			<div class="p-6">TODO: Show memo here</div>
		</Drawer>
		<section class="p-6 pr-12">
			{#if transactions.length > 0}
				<TransactionInsights {transactions} />

				<div>
					<Heading>Recorded transactions</Heading>
					<DataTable
						defaultColumns={columns}
						defaultData={transactions}
						selectedItem={selectedTransaction}
						handleRowSelect={onSelectTransaction}
					/>
				</div>
			{/if}
		</section>
	</div>
</div>
