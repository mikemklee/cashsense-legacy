<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';

	import toast from 'svelte-french-toast';

	import Button from '$lib/components/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import accountStore from '$lib/stores/accountStore';
	import type { Account } from '$lib/types';
	import NewAccountModal from './NewAccountModal.svelte';

	let accounts: Account[] = [];
	let showNewAccountModal = false;
	let selectedAccount: Account | undefined = undefined;

	const unsubscribeFromAccountStore = accountStore.subscribe((state) => {
		accounts = state.data;

		if (accounts.length > 0) selectedAccount = accounts[0];
	});

	onDestroy(() => {
		unsubscribeFromAccountStore();
	});

	function onSelectAccount(account: Account) {
		selectedAccount = account;
	}

	async function onDeleteAccount(accountId?: string) {
		if (!accountId) return;

		try {
			const response = await fetch(`/api/accounts?id=${accountId}`, {
				method: 'DELETE'
			});
			if (response.ok) {
				toast.success('Account deleted');
			} else {
				throw response;
			}
		} catch (error) {
			toast.error('Something went wrong while deleting account');
		}
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
					<!-- svelte-ignore a11y-no-static-element-interactions -->
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
		{:else}
			<div class="text-gray-400 text-center mt-10">
				<span>You don't have any accounts yet.</span>
			</div>
		{/if}
	</section>

	<!-- Main -->
	<section class="flex-grow p-6 pr-12">
		{#if selectedAccount}
			<div class="flex items-center gap-x-2">
				<div class="text-xl">
					{selectedAccount.name}
				</div>
				<div class="ml-auto">
					<Button
						text="Delete"
						onClick={() => onDeleteAccount(selectedAccount?.id)}
						style="alert"
					/>
				</div>
			</div>
		{/if}
	</section>
</div>

<NewAccountModal
	showModal={showNewAccountModal}
	on:close={() => (showNewAccountModal = false)}
	onSubmit={() => {
		showNewAccountModal = false;
	}}
/>
