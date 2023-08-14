<script lang="ts">
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { Auth } from '@supabase/auth-ui-svelte';

	export let data;
</script>

<svelte:head>
	<title>Cashsense</title>
</svelte:head>

<div class="flex flex-col mx-auto justify-center max-w-sm p-12">
	<h1 class="text-center text-2xl">Login</h1>
	<Auth
		supabaseClient={data.supabase}
		providers={['google']}
		redirectTo={`${data.url}/auth/callback`}
		appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
		additionalData={{}}
	/>
</div>
