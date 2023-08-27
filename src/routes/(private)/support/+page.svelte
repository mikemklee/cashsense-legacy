<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import toast from 'svelte-french-toast';

	let feedback = '';

	const handleFeedbackChange = (event: Event) => {
		feedback = (event.target as HTMLInputElement).value;
	};

	const handleSubmit = () => {
		toast(
			"Thank you for reaching out! We appreciate your feedback. \n\nWe'll get in touch with you at your email if needed.",
			{
				duration: 10000
			}
		);

		feedback = '';
	};
</script>

<div class="flex flex-col mx-auto justify-center max-w-xl p-12">
	<h1 class="text-2xl mb-4">Need support?</h1>
	<p>We're here to help!</p>
	<p class="mb-4">If you're facing any issues or have suggestions, please share with us.</p>
	<form on:submit|preventDefault={handleSubmit}>
		<textarea
			class="rounded w-full p-2 text-black"
			value={feedback}
			on:change={handleFeedbackChange}
			placeholder="Tell us about your experience"
			rows="4"
		/>
		<div class="flex justify-end">
			<Button type="submit" text="Submit" />
		</div>
	</form>
	<p class="mt-4">If you prefer, you can also email us directly at:</p>
	<a href="mailto:mikemunkyu.lee@gmail.com" class="text-indigo-400">mikemunkyu.lee@gmail.com</a>
</div>
