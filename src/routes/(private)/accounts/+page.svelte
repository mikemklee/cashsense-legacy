<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import accountStore from '$lib/stores/accounts';
	import type { Account } from '$lib/types';
	import { humanizeAccountType } from '$lib/utils/format';
	import NewAccountModal from './NewAccountModal.svelte';
	import DeleteAccountModal from './DeleteAccountModal.svelte';

	let accounts: Account[] = [];

	let selectedAccount: Account | undefined = undefined;
	let showNewAccountModal = false;
	let showDeleteAccountModal = false;

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

	async function onDeleteAccount(id?: string) {
		showDeleteAccountModal = false;
		if (!id) return;
		await accountStore.deleteAccount(id);
	}
</script>

<div class="flex h-full">
	<!-- Side -->
	<section class="border-r border-r-gray-700 w-[340px]">
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
					<Button text="Delete" onClick={() => (showDeleteAccountModal = true)} style="alert" />
				</div>
			</div>
			<DeleteAccountModal
				account={selectedAccount}
				showModal={showDeleteAccountModal}
				onSubmit={onDeleteAccount}
				on:close={() => (showDeleteAccountModal = false)}
			/>
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
