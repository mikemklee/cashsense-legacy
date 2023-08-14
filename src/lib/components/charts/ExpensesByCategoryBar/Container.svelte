<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { format as d3Format } from 'd3-format';

	import Bar from './Bar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import type { ExpensesByCategoryMap } from '$lib/constants';

	export let expensesByCategory: ExpensesByCategoryMap;

	const xKey = 'total';
	const yKey = 'category';

	let data: any;

	$: data = Object.entries(expensesByCategory)
		.map(([key, obj]) => ({
			category: key,
			total: obj.total,
			fill: obj.color
		}))
		.sort((a, b) => b.total - a.total);
</script>

<div class="w-full h-full">
	<h1 class="mb-2 text-lg">Expenses by category</h1>
	<LayerCake
		padding={{ top: 0, bottom: 0, left: 60 }}
		x={xKey}
		y={yKey}
		yScale={scaleBand().paddingInner(0.2)}
		xScale={scaleLinear()}
		xDomain={[0, 225000]}
		{data}
	>
		<Svg>
			<AxisX
				gridlines={true}
				snapTicks={true}
				formatTick={(d) => d3Format('($,.0f')(d / 100)}
				ticks={5}
			/>
			<AxisY gridlines={false} />
			<Bar />
		</Svg>
	</LayerCake>
</div>
