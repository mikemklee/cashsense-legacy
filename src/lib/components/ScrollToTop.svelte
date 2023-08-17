<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let threshold = 200;
	let visible = false;

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		function handleScroll() {
			visible = window.scrollY > threshold;
		}

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

{#if visible}
	<button
		transition:fade
		class="w-12 h-12 fixed bottom-4 right-4 rounded border border-gray-500 text-gray-500 text-xl
    transition-all opacity-60 hover:opacity-100"
		on:click={scrollToTop}
	>
		↑
	</button>
{/if}
