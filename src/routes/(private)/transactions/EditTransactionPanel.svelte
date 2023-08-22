<script lang="ts">
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	import Button from '$lib/components/Button.svelte';
	import DateInput from '$lib/components/inputs/DateInput.svelte';
	import NumberInput from '$lib/components/inputs/NumberInput.svelte';
	import SelectInput, { type Option } from '$lib/components/inputs/SelectInput.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';
	import accountStore from '$lib/stores/accountStore';
	import categoryStore from '$lib/stores/categories';
	import transactionStore from '$lib/stores/transactions';
	import type { Account, Category, LiftedTransaction } from '$lib/types';

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
	}

	async function handleSubmit() {
		const rawDollarAmount = enteredAmount;
		const amountInCents = Math.round(rawDollarAmount * 100);
		const centsWithDirection = selectedDirection === '-1' ? -amountInCents : amountInCents;

		await transactionStore.updateTransaction({
			id: transaction.id,
			posted_at: new Date(selectedDate),
			description: enteredDescription,
			amount: centsWithDirection,
			category_id: selectedCategory,
			account_id: selectedAccount
		});

		onSubmit();
		resetFields();
	}
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

	<div class="flex justify-end gap-4 mt-4">
		<Button text="Cancel" style="secondary" onClick={onClose} />
		<Button onClick={handleSubmit} text="Save" />
	</div>
</div>
