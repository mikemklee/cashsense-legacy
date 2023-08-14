<script lang="ts">
	import '@fontsource-variable/outfit';
	import '@fontsource-variable/inter';
	
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'

	import '../app.css';
	import Navbar from '$lib/Navbar.svelte';


	export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => data.subscription.unsubscribe()
	})
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<main class="grow flex flex-col bg-gray-800">
	<Navbar />
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
