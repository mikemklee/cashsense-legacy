<script>
	import { page } from '$app/stores';

	$: pathname = $page.url.pathname;
</script>

<nav class="w-full max-h-16 bg-gray-800 border-b border-b-gray-700 flex items-center px-6 py-3">
	<a href="/" class="text-2xl font-semibold mr-8 mt-[-2px]"> cashsense </a>
	<div class="flex gap-x-8">
		<a
			href="/transactions"
			class="transition-opacity {pathname === '/transactions' ? 'opacity-100' : 'opacity-50'}"
		>
			Transactions
		</a>
		<a
			href="/accounts"
			class="transition-opacity {pathname === '/accounts' ? 'opacity-100' : 'opacity-50'}"
		>
			Accounts
		</a>
		<a
			href="/categories"
			class="transition-opacity {pathname === '/categories' ? 'opacity-100' : 'opacity-50'}"
		>
			Categories
		</a>
	</div>
</nav>
