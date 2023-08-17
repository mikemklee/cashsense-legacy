<script lang="ts">
	import '@fontsource/ubuntu-mono';

	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { Auth } from '@supabase/auth-ui-svelte';

	export let data;
</script>

<svelte:head>
	<title>cashsense</title>
</svelte:head>

<div class="flex flex-col mx-auto justify-center max-w-sm p-12 h-full">
	<div class="text-left">
		<div class="flex items-center">
			<h1 class="text-3xl logo mr-2 mb-1">cashsense</h1>
			<span class="font-mono mr-8 text-[10px] rounded border border-gray-300 px-2 py-[2px]">
				pre-alpha
			</span>
		</div>

		<p class="mb-4">Your personal finance copilot.</p>
	</div>

	<Auth
		supabaseClient={data.supabase}
		providers={['google']}
		redirectTo={`${data.url}/auth/callback`}
		appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
		additionalData={{}}
		onlyThirdPartyProviders
	/>
</div>

<style>
	.logo {
		font-family: 'Ubuntu Mono', sans-serif;
	}
</style>
