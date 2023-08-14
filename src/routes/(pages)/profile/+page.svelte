<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';

	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';

	export let data;
	export let form;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	let profileForm: HTMLFormElement;
	let loading = false;
	let fullName: string = profile?.full_name ?? '';
	let username: string = profile?.username ?? '';
	let website: string = profile?.website ?? '';
	let avatarUrl: string = profile?.avatar_url ?? '';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<div class="form-widget">
	<form
		class="form-widget"
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<TextInput id="email" label="Email" bind:value={session.user.email} isDisabled />
		<TextInput id="fullName" label="Full Name" value={form?.fullName ?? fullName} />
		<TextInput id="username" label="Username" value={form?.username ?? username} />
		<TextInput id="website" label="Website" value={form?.website ?? website} />

		<Button type="submit" text={loading ? 'Loading...' : 'Update'} isDisabled={loading} />
	</form>

	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<Button type="submit" text="Sign out" isDisabled={loading} style="outline" />
	</form>
</div>
