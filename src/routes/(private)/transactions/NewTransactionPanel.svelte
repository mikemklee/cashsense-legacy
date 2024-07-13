<script lang="ts">
	import Icon from '@iconify/svelte';
	import { format } from 'date-fns';
	import { onDestroy } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import Collapsible from '$lib/components/Collapsible.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import DateInput from '$lib/components/inputs/DateInput.svelte';
	import NumberInput from '$lib/components/inputs/NumberInput.svelte';
	import SelectInput, { type Option } from '$lib/components/inputs/SelectInput.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';
	import type { Account, Category, Vendor } from '$lib/types';
	import accountStore from '$lib/stores/accounts';
	import categoryStore from '$lib/stores/categories';
	import vendorStore from '$lib/stores/vendors';
	import transactionStore from '$lib/stores/transactions';

	export let showPanel: boolean;
	export let onClose = () => {};
	export let onSubmit = () => {};

	let selectedDate = format(new Date(), 'yyyy-MM-dd');
	let enteredDescription = '';
	let selectedDirection = '-1';
	let enteredAmount = 0;

	let selectedVendor = '';
	let vendorOptions: Option[] = [];

	let selectedCategory = '';
	let categoryOptions: Option[] = [];

	let selectedAccount = '';
	let accountOptions: Option[] = [];

	const unsubscribeFromVendorStore = vendorStore.subscribe((state) => {
		vendorOptions = state.data.map((vendor: Vendor) => ({
			label: vendor.name,
			value: vendor.id
		}));
	});

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

	onDestroy(() => {
		unsubscribeFromCategoryStore();
		unsubscribeFromVendorStore();
		unsubscribeFromAccountStore();
	});

	function resetFields() {
		enteredDescription = '';
		enteredAmount = 0;
		selectedCategory = '';
		selectedVendor = '';

		if (categoryOptions.length > 0) {
			selectedCategory = categoryOptions[0].value;
		}
	}

	async function handleSubmit() {
		const rawDollarAmount = enteredAmount;
		const amountInCents = Math.round(rawDollarAmount * 100);
		const centsWithDirection = selectedDirection === '-1' ? -amountInCents : amountInCents;

		await transactionStore.createTransaction({
			posted_at: new Date(selectedDate),
			description: enteredDescription,
			amount: centsWithDirection,
			category_id: selectedCategory,
			account_id: selectedAccount,
			vendor_id: selectedVendor || null
		});

		onSubmit();
		resetFields();
	}
</script>

<Collapsible show={showPanel}>
	<div slot="header" class="flex items-center justify-between mb-4 text-lg">
		<Heading isSnug size="lg">New record</Heading>
		<button on:click={onClose}>
			<Icon icon="tabler:x" />
		</button>
	</div>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-y-4">
		<DateInput label="Date" bind:value={selectedDate} />

		<SelectInput label="Vendor" options={vendorOptions} bind:value={selectedVendor} />
		<TextInput label="Description" bind:value={enteredDescription} isRequired />
		<SelectInput
			label="Category"
			isRequired
			options={categoryOptions}
			bind:value={selectedCategory}
		/>
		<SelectInput label="Account" isRequired options={accountOptions} bind:value={selectedAccount} />

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

		<Button type="submit" text="Save" />
	</form>
</Collapsible>
