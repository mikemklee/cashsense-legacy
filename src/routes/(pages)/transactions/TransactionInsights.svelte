<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import ExpensesByCategoryBarChart from '$lib/components/charts/ExpensesByCategoryBar/Container.svelte';
	import type { ExpenseByCategory, ExpensesByCategoryMap } from '$lib/constants';
	import type { LiftedTransaction } from '$lib/types';

	export let transactions: LiftedTransaction[] = [];
	$: expenses = transactions.filter((transaction) => transaction.amount < 0);

	let expensesByCategory: ExpensesByCategoryMap;
	let totalExpenses: number;
	let topThreeExpenseCategories: ExpenseByCategory[];
	$: {
		expensesByCategory = expenses.reduce((result, expense) => {
			const categoryName = expense.category.name;
			const categoryColor = expense.category.color;
			const amount = expense.amount;

			// If the category exists in the result object, add the amount to the existing value
			if (result[categoryName]) {
				result[categoryName].total += Math.abs(amount);
			} else {
				// If the category doesn't exist, initialize it with the amount
				result[categoryName] = {
					category: categoryName,
					total: Math.abs(amount),
					color: categoryColor
				};
			}

			return result;
		}, {} as ExpensesByCategoryMap);

		totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

		topThreeExpenseCategories = Object.entries(expensesByCategory)
			.map(([key, obj]) => ({
				category: key,
				total: obj.total,
				color: obj.color
			}))
			.sort((a, b) => b.total - a.total)
			.slice(0, 3);
	}
</script>

<div>
	<Heading>Insights</Heading>

	<div class="flex mt-4 mb-24">
		{#if expenses.length > 0}
			<div class="w-full max-w-[600px] h-72 overflow-x-clip">
				<ExpensesByCategoryBarChart {expensesByCategory} />
			</div>
		{/if}
		<div class="ml-6">
			<div class="mb-6">
				<div class="text-lg">Total expenses</div>
				<div class="text-2xl font-bold text-gray-100">
					-${Math.abs(totalExpenses / 100).toLocaleString()}
				</div>
			</div>
			<div class="">
				<div class="text-lg">Top 3 spending categories</div>
				<div class="flex gap-16 mt-2">
					{#each topThreeExpenseCategories as { category, total, color }}
						<div class="flex flex-col">
							<div class="flex items-center gap-x-2">
								<span class="w-1.5 h-4 rounded-sm" style="background-color: {color};" />
								<span class="font-semibold">{category}</span>
							</div>
							<span class="text-xl font-bold text-gray-100">
								-${Math.abs(total / 100).toLocaleString()}
							</span>
							<span class="text-sm">
								{`${((Math.abs(total) / Math.abs(totalExpenses)) * 100).toFixed(0)}%`} of total
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
