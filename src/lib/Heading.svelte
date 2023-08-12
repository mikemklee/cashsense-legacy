<script>
	export let isSnug = false;
	export let size = 'xl';
</script>

<h1 class="{`text-${size}`} font-semibold {isSnug ? 'm-0' : 'mb-4'}"><slot /></h1>
