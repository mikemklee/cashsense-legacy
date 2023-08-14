<script lang="ts">
	import '@fontsource-variable/inter';
	import '@fontsource-variable/outfit';
	import { onMount } from 'svelte';

	import { invalidate } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';

	export let data;

	let { supabase, session, profile } = data;
	$: ({ supabase, session, profile } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	async function handleLogout() {
		await fetch('/auth/signout', {
			method: 'POST'
		});
	}
</script>

<svelte:head>
	<title>Cashsense</title>
</svelte:head>

<main class="grow flex flex-col bg-gray-800">
	<Navbar {profile} onLogout={handleLogout} />
	<div class="w-full h-full">
		<slot />
	</div>
</main>

<style>
	:global(body) {
		font-family: 'Outfit Variable', sans-serif;
		/* font-family: 'Inter Variable', sans-serif; */
		color: #d7d7d7;
		overflow-x: hidden;
	}
</style>
