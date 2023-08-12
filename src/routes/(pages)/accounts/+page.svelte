<script lang="ts">
	import type { Account } from '@prisma/client';
	import Icon from '@iconify/svelte';

	import Button from '$lib/Button.svelte';
	import { onMount } from 'svelte';
	import Heading from '$lib/Heading.svelte';
	import NewAccountModal from './NewAccountModal.svelte';

	let accounts: Account[] = [];
	let showNewAccountModal = false;
	let selectedAccount: Account | undefined = undefined;

	async function fetchAccounts() {
		const response = await fetch('/api/accounts');
		const data = await response.json();
		accounts = data;

		if (accounts.length > 0) selectedAccount = accounts[0];
	}

	onMount(() => {
		fetchAccounts();
	});

	function onSelectAccount(account: Account) {
		selectedAccount = account;
	}

	async function onDeleteAccount(accountId?: number) {
		if (!accountId) return;
		await fetch(`/api/accounts?id=${accountId}`, {
			method: 'DELETE'
		});

		fetchAccounts();
	}

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
			<Heading isSnug>Accounts</Heading>
			<Button text="New account" onClick={() => (showNewAccountModal = true)} />
		</div>

		{#if accounts.length > 0}
			<div class="flex flex-col">
				{#each accounts as account}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="border-y border-gray-700 px-6 py-4
							flex items-center
							cursor-pointer hover:bg-gray-700 transition-all
							{selectedAccount?.id === account.id ? 'opacity-100 bg-gray-700 border-transparent' : 'opacity-40'}"
						on:click={() => onSelectAccount(account)}
					>
						<Icon
							icon={account.type === 'bank_account' ? 'tabler:building-bank' : 'tabler:credit-card'}
							height={26}
							class="mr-2"
						/>
						<div class="flex flex-col grow">
							<span class="font-semibold">{account.name}</span>
							<span class="text-sm">{humanizeAccountType(account.type)}</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Main -->
	<section class="flex-grow p-6 pr-12">
		{#if selectedAccount}
			<div class="flex items-center gap-x-2 text-xl">{selectedAccount.name}</div>
			<div class="self-end">
				<Button
					text="Delete"
					onClick={() => onDeleteAccount(selectedAccount?.id)}
					style="outline"
				/>
			</div>
		{/if}
	</section>
</div>

<NewAccountModal
	showModal={showNewAccountModal}
	on:close={() => (showNewAccountModal = false)}
	onSubmit={() => {
		fetchAccounts();
		showNewAccountModal = false;
	}}
/>
