<script lang="ts">
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';
	import { v4 as uuid } from 'uuid';

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
		id: string;
		is_adjusted: boolean;
		description: string;
		amount: number;
		direction: string;
		transaction_id: string;
	};

	let adjustmentsData: Adjustment[] = [];
	let adjustmentsToDelete: string[] = [];

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
			...adjustment,
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
		const formattedAdjustments = adjustmentsData
			.filter((item) => {
				return adjustmentsToDelete.includes(item.id) === false;
			})
			.map((adjustment) => ({
				id: adjustment.id,
				description: adjustment.description,
				is_adjusted: adjustment.is_adjusted,
				amount: formatAmountForSave(adjustment.amount, adjustment.direction),
				transaction_id: transaction.id
			}));

		await transactionStore.upsertTransactionAdjustments(formattedAdjustments);
		await transactionStore.deleteTransactionAdjustments(adjustmentsToDelete);
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

	const onAddAdjustment = () => {
		adjustmentsData = [
			...adjustmentsData,
			{
				id: uuid(),
				is_adjusted: false,
				description: 'Enter a description',
				amount: 0,
				direction: '1',
				transaction_id: transaction.id
			}
		];
	};

	const onRemoveAdjustment = async (adjustmentId?: string) => {
		if (!adjustmentId) return;
		const existingAdjustmentIds = transaction.adjustments.map((adjustment) => adjustment.id);
		if (existingAdjustmentIds.includes(adjustmentId)) {
			if (adjustmentsToDelete.includes(adjustmentId)) {
				adjustmentsToDelete = adjustmentsToDelete.filter((id) => id !== adjustmentId);
			} else {
				adjustmentsToDelete = [...adjustmentsToDelete, adjustmentId];
			}
		} else {
			adjustmentsData = adjustmentsData.filter((adjustment) => adjustment.id !== adjustmentId);
		}
	};
</script>

<div class="flex flex-col gap-y-4 px-6">
	<div class="grid grid-cols-2 gap-x-4">
		<SelectInput
			label="Category"
			isRequired
			options={categoryOptions}
			bind:value={selectedCategory}
		/>
		<SelectInput label="Account" isRequired options={accountOptions} bind:value={selectedAccount} />
	</div>

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

	<div class="flex flex-col gap-y-2 my-4">
		<div class="flex items-center justify-between">
			<Heading isSnug size="lg">Adjustments</Heading>
			<button on:click={onAddAdjustment} class="rounded border border-gray-600 px-4 py-[1px]">
				Add
			</button>
		</div>
		{#if adjustmentsData.length > 0}
			{#each adjustmentsData as adjustment}
				<div
					class="flex items-end {adjustmentsToDelete.includes(adjustment.id)
						? 'opacity-25'
						: 'opacity-100'}"
				>
					<div class="grow mr-4">
						<TextInput label="Description" bind:value={adjustment.description} isRequired />
					</div>
					<div class="flex mr-4 justify-evenly h-[34px]">
						<button
							class="border border-gray-400 w-full rounded rounded-r-none transition-all px-3 text-xl
								{adjustment.direction === '-1' ? 'bg-red-400 border-red-400 text-white' : 'opacity-40'}"
							on:click={() => (adjustment.direction = '-1')}
						>
							-
						</button>
						<button
							class="border border-gray-400 w-full rounded rounded-l-none transition-all px-3 text-xl
									{adjustment.direction === '1' ? 'bg-green-400 border-green-400 text-white' : 'opacity-40'}"
							on:click={() => (adjustment.direction = '1')}
						>
							+
						</button>
					</div>

					<div class="grow mr-4">
						<NumberInput label="Amount" bind:value={adjustment.amount} isRequired />
					</div>
					<button on:click={() => onRemoveAdjustment(adjustment?.id)}>
						<Icon icon="tabler:x" class="w-6 h-6 mb-1 shrink" />
					</button>
				</div>
			{/each}
		{:else}
			<span class="text-sm text-gray-400">No adjustments to show.</span>
		{/if}
	</div>

	{#if adjustmentsToDelete.length > 0}
		<span class="text-right text-sm text-red-400">
			{adjustmentsToDelete.length} adjustments will be deleted
		</span>
	{/if}

	<div class="flex justify-end gap-4 mt-4">
		<Button text="Cancel" style="secondary" onClick={onClose} />
		<Button onClick={handleSubmit} text="Save" />
	</div>
</div>
