<script lang="ts">
	import '@fontsource-variable/outfit';
	import '@fontsource/ubuntu-mono';

	import { onMount } from 'svelte';

	import { invalidate } from '$app/navigation';
	import '../app.css';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';

	export let data;

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>cashsense</title>
</svelte:head>

<main class="grow flex flex-col">
	<div class="w-full h-full">
		<slot />
	</div>
</main>

<ScrollToTop />
