<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	export let data;

	$: ({ profile } = data);
</script>

<Navbar {profile} />

<slot />
