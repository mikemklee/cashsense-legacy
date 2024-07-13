<script lang="ts" context="module">
	export interface Option {
		label: string;
		value: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	export let label = '';
	export let options: Option[] = [];
	export let value = '';
	export let isRequired = false;
	export let defaultValue = '';

	let showOptions = false;
	let selectedOption: Option | undefined = undefined;

	onMount(() => {
		if (!isRequired) return;

		if (defaultValue) {
			value = defaultValue;
		} else {
			value = options[0].value;
		}

		selectedOption = options.find((option) => option.value === value);
	});

	function handleShowOptions() {
		if (showOptions) {
			handleCloseOptions();
		} else {
			showOptions = true;
			document.body.addEventListener('click', handleCloseOptions);
		}
	}
	function handleCloseOptions() {
		showOptions = false;
		document.body.removeEventListener('click', handleCloseOptions);
	}

	function selectOption(option: Option) {
		if (selectedOption === option) {
			value = '';
			selectedOption = undefined;
		} else {
			value = option.value;
			selectedOption = option;
		}
		showOptions = false;
	}

	const sortedOptions = options.sort((a, b) => a.label.localeCompare(b.label));
</script>

<div class="flex flex-col relative">
	<span class="text-sm">{label}{isRequired ? '*' : ''}</span>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="px-2 py-1 border border-gray-600 bg-transparent rounded cursor-pointer"
		on:click|stopPropagation={handleShowOptions}
	>
		{selectedOption ? selectedOption.label : 'Select an option'}
	</div>
	{#if showOptions}
		<div
			class="absolute w-full mt-16 border border-gray-600 rounded bg-gray-700 z-10 options-container"
		>
			{#each sortedOptions as option (option.value)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="px-2 py-1 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last-of-type:border-b-0"
					on:click={() => selectOption(option)}
				>
					{option.label}
				</div>
			{/each}
			<div class="pointer-events-none text-xs opacity-50 py-0.5 text-center">End of list</div>
		</div>
	{/if}
</div>

<style>
	.options-container {
		max-height: 400px; /* Adjust the height as needed */
		overflow-y: auto;
		scrollbar-width: none; /* For Firefox */
		-ms-overflow-style: none; /* For Internet Explorer and Edge */
	}

	.options-container::-webkit-scrollbar {
		display: none; /* For Chrome, Safari, and Opera */
	}
</style>
