<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Profile } from '$lib/types';

	import Avatar from './Avatar.svelte';

	export let profile: Profile | null;

	let isMenuOpen = false;

	function goToProfile() {
		isMenuOpen = false;
		goto('/profile');
	}

	async function handleLogout() {
		isMenuOpen = false;
		await fetch('/api/auth/signout', {
			method: 'POST'
		});
		goto('/');
	}

	$: pathname = $page.url.pathname;

	function handleMenuOpen() {
		if (isMenuOpen) {
			handleMenuClose();
		} else {
			isMenuOpen = true;
			document.body.addEventListener('click', handleMenuClose);
		}
	}
	function handleMenuClose() {
		isMenuOpen = false;
		document.body.removeEventListener('click', handleMenuClose);
	}
</script>

<nav
	class="w-full h-14 border-b border-b-gray-700 flex items-center px-6 sticky top-0 z-20 bg-gray-800"
>
	<a href="/" class="text-2xl font-semibold mr-2 mt-[-2px] logo">cashsense</a>
	<span class="font-mono mr-10 text-[10px] rounded border border-gray-300 px-2 py-[2px]">
		pre-alpha
	</span>
	<div class="flex gap-x-8">
		<a
			href="/transactions"
			class="transition-opacity {pathname === '/transactions' ? 'opacity-100' : 'opacity-50'}"
		>
			Transactions
		</a>
		<a
			href="/vendors"
			class="transition-opacity {pathname === '/vendors' ? 'opacity-100' : 'opacity-50'}"
		>
			Vendors
		</a>
		<a
			href="/categories"
			class="transition-opacity {pathname === '/categories' ? 'opacity-100' : 'opacity-50'}"
		>
			Categories
		</a>
		<a
			href="/accounts"
			class="transition-opacity {pathname === '/accounts' ? 'opacity-100' : 'opacity-50'}"
		>
			Accounts
		</a>
		<a
			href="/support"
			class="transition-opacity {pathname === '/support' ? 'opacity-100' : 'opacity-50'}"
		>
			Support
		</a>
	</div>

	<div class="ml-auto pr-2 flex items-center">
		<button on:click|stopPropagation={handleMenuOpen} id="usermenu-toggle">
			<Avatar url={profile?.avatar_url} size={32} />
		</button>

		{#if isMenuOpen}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				on:click|stopPropagation
				id="usermenu"
				class="absolute right-[2rem] top-[4rem] bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10"
			>
				<div class="px-4 py-4 flex flex-col border-b border-gray-600">
					<span class="font-semibold">{profile?.full_name}</span>
					<span class="text-sm">{profile?.email || ''}</span>
				</div>

				<div class="flex flex-col">
					<button
						class="text-left px-4 py-2 hover:bg-gray-600 transition-colors cursor-pointer border-b border-gray-700"
						on:click={goToProfile}>My profile</button
					>
					<button
						class="text-left px-4 py-2 hover:bg-gray-600 transition-colors cursor-pointer"
						on:click={handleLogout}>Sign out</button
					>
				</div>
			</div>
		{/if}
	</div>
</nav>

<style>
	.logo {
		font-family: 'Ubuntu Mono', sans-serif;
	}
</style>
