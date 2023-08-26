<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { Account } from '$lib/types';
	import { humanizeAccountType } from '$lib/utils/format';

	export let account: Account;
	export let showModal: boolean;
	export let onSubmit: Function;
</script>

<Modal show={showModal} on:close>
	<h2 slot="header">Delete account</h2>
	<form on:submit|preventDefault={() => onSubmit(account.id)} class="flex flex-col gap-y-4">
		<p>Are you sure you want to delete this account?</p>
		<div class="flex flex-col grow">
			<span class="font-semibold">{account.name}</span>
			<span class="text-sm">{humanizeAccountType(account.type)}</span>
		</div>
		<div class="flex justify-end">
			<Button type="submit" style="alert" text="Yes, delete it" />
		</div>
	</form>
</Modal>
