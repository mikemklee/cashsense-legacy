<script lang="ts">
	import Icon from '@iconify/svelte';

	import Heading from '$lib/components/Heading.svelte';
	import Selectable from '$lib/components/Selectable.svelte';
	import type { Account } from '$lib/types';
	import { humanizeAccountType } from '$lib/utils/format';
	import { flip } from 'svelte/animate';

	export let selectedAccounts: string[] = [];
	export let accounts: Account[] = [];
	export let onSelectAccountFilterItem: (id: string) => void;
	export let onClearAllAccounts: () => void;
	export let onSelectAllAccounts: () => void;
</script>

<Heading size="md">
	<div class="flex">
		Accounts
		{#if accounts.length === 0}
			<span class="relative flex h-2.5 w-2.5 ml-1">
				<span
					class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
				/>
				<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
			</span>
		{/if}
	</div>
</Heading>

{#if accounts.length > 0}
	<div class="my-2 flex flex-col gap-2">
		{#each accounts as account}
			<Selectable
				on:click={() => onSelectAccountFilterItem(account.id)}
				isSelected={selectedAccounts.includes(account.id)}
			>
				<div class="flex items-center px-4 py-2 rounded">
					<Icon
						icon={account.type === 'bank_account' ? 'tabler:building-bank' : 'tabler:credit-card'}
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
{:else}
	<div class="text-sm text-gray-400">
		<span>You don't have any accounts yet.</span>
		<span class="flex items-center">
			<a
				href="/accounts"
				class="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
			>
				Add one here
				<Icon icon="tabler:arrow-right" class="inline-block text-lg" />
			</a>
		</span>
	</div>
{/if}
