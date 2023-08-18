<script lang="ts">
	export let text = '';
	export let onClick = () => {};
	export let type: 'submit' | 'button' = 'button';
	export let style: 'primary' | 'secondary' | 'alert' = 'primary';
	export let isDisabled = false;

	function getButtonStyle(disabled: boolean) {
		let styles = 'rounded h-9 min-w-[6rem] hover:opacity-80 transition-opacity px-4 ';

		if (style === 'primary') {
			styles += 'bg-indigo-600 text-white';
		} else if (style === 'secondary') {
			styles += 'border border-gray-400 text-gray-400';
		} else if (style === 'alert') {
			styles += 'border border-red-400 text-red-400';
		}

		if (disabled) {
			styles += ' opacity-30 cursor-default pointer-events-none';
		}

		return styles;
	}

	$: btnStyles = getButtonStyle(isDisabled);
</script>

<button on:click={onClick} {type} class=" {btnStyles}" disabled={isDisabled}>{text}</button>
