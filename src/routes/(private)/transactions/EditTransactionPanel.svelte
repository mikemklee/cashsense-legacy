<script lang="ts">
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import DateInput from '$lib/components/inputs/DateInput.svelte';
	import NumberInput from '$lib/components/inputs/NumberInput.svelte';
	import SelectInput, { type Option } from '$lib/components/inputs/SelectInput.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';
	import accountStore from '$lib/stores/accountStore';
	import categoryStore from '$lib/stores/categories';
	import type { Account, Category, LiftedTransaction, TransactionAdjustment } from '$lib/types';
	import Heading from '$lib/components/Heading.svelte';
	import Icon from '@iconify/svelte';
	import transactionStore from '$lib/stores/transactions';

	export let transaction: LiftedTransaction;
	export let onClose = () => {};
	export let onSubmit = () => {};

	let selectedDate = format(new Date(), 'yyyy-MM-dd');
	let enteredDescription = '';
	let selectedDirection = '-1';
	let enteredAmount = 0;

	let selectedCategory = '';
	let categoryOptions: Option[] = [];

	let selectedAccount = '';
	let accountOptions: Option[] = [];

	type Adjustment = {
		id?: string;
		is_adjusted: boolean;
		description: string;
		amount: number;
		direction: string;
	};

	let adjustmentsData: Adjustment[] = [];

	const unsubscribeFromCategoryStore = categoryStore.subscribe((state) => {
		categoryOptions = state.data.map((category: Category) => ({
			label: category.name,
			value: category.id
		}));
	});

	const unsubscribeFromAccountStore = accountStore.subscribe((state) => {
		accountOptions = state.data.map((account: Account) => ({
			label: account.name,
			value: account.id
		}));
	});

	onMount(() => {
		// TODO: move date formatting to util
		const date = new Date(transaction.posted_at);
		const timeMs = date.getTime();
		const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
		const adjustedTimeMs = timeMs + tzOffsetMs;

		selectedDate = format(adjustedTimeMs, 'yyyy-MM-dd');
		enteredDescription = transaction.description;
		selectedDirection = transaction.amount < 0 ? '-1' : '1';
		enteredAmount = Math.abs(transaction.amount) / 100;
		selectedCategory = transaction.category_id;
		selectedAccount = transaction.account_id;

		adjustmentsData = transaction.adjustments.map((adjustment) => ({
			id: adjustment.id,
			is_adjusted: adjustment.is_adjusted,
			description: adjustment.description,
			amount: Math.abs(adjustment.amount) / 100,
			direction: adjustment.amount < 0 ? '-1' : '1'
		}));
	});

	onDestroy(() => {
		unsubscribeFromCategoryStore();
		unsubscribeFromAccountStore();
	});

	function resetFields() {
		selectedDate = format(new Date(), 'yyyy-MM-dd');
		enteredDescription = '';
		enteredAmount = 0;
		selectedCategory = '';
		selectedAccount = '';

		if (categoryOptions.length > 0) {
			selectedCategory = categoryOptions[0].value;
		}

		if (accountOptions.length > 0) {
			selectedAccount = accountOptions[0].value;
		}

		adjustmentsData = [];
	}

	function formatAmountForSave(rawDollarAmount: number, direction = '1') {
		const amountInCents = Math.round(rawDollarAmount * 100);
		return direction === '-1' ? -amountInCents : amountInCents;
	}

	async function handleSubmit() {
		const formattedAdjustments = adjustmentsData.map((adjustment) => ({
			id: adjustment.id,
			description: adjustment.description,
			is_adjusted: adjustment.is_adjusted,
			amount: formatAmountForSave(adjustment.amount, adjustment.direction),
			transaction_id: transaction.id
		}));

		await transactionStore.updateTransactionAdjustments(transaction.id, formattedAdjustments);

		await transactionStore.updateTransaction({
			id: transaction.id,
			posted_at: new Date(selectedDate),
			description: enteredDescription,
			amount: formatAmountForSave(enteredAmount, selectedDirection),
			category_id: selectedCategory,
			account_id: selectedAccount
		});

		onSubmit();
		resetFields();
	}

	const onRemoveAdjustment = (id?: string) => {
		if (!id) return;
		adjustmentsData = adjustmentsData.filter((adjustment) => adjustment.id !== id);
	};
</script>

<div class="flex flex-col gap-y-4 px-6">
	<SelectInput label="Account" isRequired options={accountOptions} bind:value={selectedAccount} />

	<DateInput label="Date" bind:value={selectedDate} />
	<TextInput label="Description" bind:value={enteredDescription} isRequired />

	<div class="grid grid-cols-2 gap-x-4">
		<div class="flex flex-col">
			<span class="text-sm">Direction</span>
			<div class="flex justify-evenly h-[34px]">
				<button
					class="border border-gray-400 w-full rounded rounded-r-none transition-all
          {selectedDirection === '-1' ? 'bg-red-400 border-red-400 text-white' : 'opacity-40'}"
					on:click={() => (selectedDirection = '-1')}
				>
					Expense
				</button>
				<button
					class="border border-gray-400 w-full rounded rounded-l-none transition-all
            {selectedDirection === '1' ? 'bg-green-400 border-green-400 text-white' : 'opacity-40'}"
					on:click={() => (selectedDirection = '1')}
				>
					Income
				</button>
			</div>
		</div>
		<div class="">
			<NumberInput label="Amount" bind:value={enteredAmount} isRequired />
		</div>
	</div>

	<SelectInput
		label="Category"
		isRequired
		options={categoryOptions}
		bind:value={selectedCategory}
	/>

	{#if adjustmentsData}
		<div class="flex flex-col gap-y-2 my-4">
			<div class="flex items-center justify-between">
				<Heading isSnug size="md">Edit adjustments</Heading>
				<button>Add</button>
			</div>
			{#each adjustmentsData as adjustment}
				<div class="flex items-center">
					<div class="grow mr-4">
						<TextInput label="Description" bind:value={adjustment.description} isRequired />
					</div>
					<div class="grow mr-4">
						<NumberInput label="Amount" bind:value={adjustment.amount} isRequired />
					</div>
					<button on:click={() => onRemoveAdjustment(adjustment?.id)}>
						<Icon icon="tabler:x" class="w-6 h-6 mt-4 shrink" />
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex justify-end gap-4 mt-4">
		<Button text="Cancel" style="secondary" onClick={onClose} />
		<Button onClick={handleSubmit} text="Save" />
	</div>
</div>
