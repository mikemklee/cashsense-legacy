<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Profile } from '$lib/types';
	import Avatar from './Avatar.svelte';

	export let onLogout: Function;
	export let profile: Profile | null;

	let isMenuOpen = false;

	function goToProfile() {
		isMenuOpen = false;
		goto('/profile');
	}

	function handleLogout() {
		isMenuOpen = false;
		onLogout();
	}

	$: pathname = $page.url.pathname;
</script>

<nav class="w-full max-h-16 bg-gray-800 border-b border-b-gray-700 flex items-center px-6 py-3">
	<a href="/" class="text-2xl font-semibold mr-8 mt-[-2px]"> cashsense </a>
	<div class="flex gap-x-8">
		<a
			href="/transactions"
			class="transition-opacity {pathname === '/transactions' ? 'opacity-100' : 'opacity-50'}"
		>
			Transactions
		</a>
		<a
			href="/accounts"
			class="transition-opacity {pathname === '/accounts' ? 'opacity-100' : 'opacity-50'}"
		>
			Accounts
		</a>
		<a
			href="/categories"
			class="transition-opacity {pathname === '/categories' ? 'opacity-100' : 'opacity-50'}"
		>
			Categories
		</a>
	</div>

	<div class="ml-auto pr-6">
		<button on:click={() => (isMenuOpen = !isMenuOpen)} id="usermenu-toggle">
			<Avatar size={32} />
		</button>

		{#if isMenuOpen}
			<div
				id="usermenu"
				class="absolute right-[2rem] top-[4rem] bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10"
			>
				<div class="px-4 py-2 flex flex-col border-b border-gray-200">
					<span class="font-semibold">{profile?.full_name}</span>
					<span class="text-sm">{profile?.username}</span>
				</div>

				<div class="flex flex-col">
					<button on:click={goToProfile}>My profile</button>
					<button on:click={handleLogout}>Sign out</button>
				</div>
			</div>
		{/if}
	</div>
</nav>
