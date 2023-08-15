<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';

	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';

	export let data;
	export let form;

	let { session, profile } = data;
	$: ({ session, profile } = data);

	let profileForm: HTMLFormElement;
	let loading = false;
	let fullName: string = profile?.full_name ?? '';
	let username: string = profile?.username ?? '';
	let website: string = profile?.website ?? '';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};
</script>

<div class="flex flex-col mx-auto justify-center max-w-md p-12">
	<h1 class="text-2xl mb-4">My profile</h1>
	<form
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
		class="flex flex-col gap-4"
	>
		<TextInput id="email" label="Email" bind:value={session.user.email} isDisabled />
		<TextInput id="fullName" label="Full Name" value={form?.fullName ?? fullName} />
		<TextInput id="username" label="Username" value={form?.username ?? username} />
		<TextInput id="website" label="Website" value={form?.website ?? website} />

		<Button type="submit" text={loading ? 'Loading...' : 'Update'} isDisabled={loading} />
	</form>
</div>
