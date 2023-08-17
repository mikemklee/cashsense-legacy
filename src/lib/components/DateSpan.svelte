<script>
	import { format } from 'date-fns';

	export let value;

	const date = new Date(value);

	const timeMs = date.getTime();
	const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
	const adjustedTimeMs = timeMs + tzOffsetMs;
</script>

<div>
	{format(adjustedTimeMs, 'MMM d, yyyy')}
</div>
