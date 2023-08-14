<script lang="ts">
	import { writable } from 'svelte/store';

	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getSortedRowModel,
		type ColumnDef,
		type TableOptions,
		type ColumnSort,
		type Row
	} from '@tanstack/svelte-table';
	import type { Account, Transaction } from '$lib/types';
	import Icon from '@iconify/svelte';

	type Models = Transaction | Account;

	export let defaultData: Models[] = [];
	export let defaultColumns: ColumnDef<Models>[] = [];
	export let handleRowSelect: Function = () => {};
	export let selectedItem: Models | null = null;

	let sorting: ColumnSort[] = [];

	const setSorting = (updater: Function | ColumnSort[]) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				sorting
			}
		}));
	};

	const options = writable<TableOptions<Models>>({
		data: defaultData,
		columns: defaultColumns,
		state: {
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	$: {
		options.update((currentOptions) => ({
			...currentOptions,
			data: defaultData
		}));
	}

	const table = createSvelteTable(options);

	const getSortIcon = (str: string) => {
		if (str === 'asc') {
			return 'tabler:caret-up-filled';
		} else if (str === 'desc') {
			return 'tabler:caret-down-filled';
		} else {
			return '';
		}
	};

	function onRowSelect(row: Row<Models>) {
		if (row.original.id === selectedItem?.id) {
			// de-select current row
			handleRowSelect(null);
		} else {
			// select new row
			handleRowSelect(row.original);
		}
	}
</script>

<table class="w-full">
	<thead>
		{#each $table.getHeaderGroups() as headerGroup}
			<tr>
				{#each headerGroup.headers as header}
					<th class="px-2 py-1 bg-gray-700 border-l border-gray-400 text-left">
						{#if !header.isPlaceholder}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								class:cursor-pointer={header.column.getCanSort()}
								class:select-none={header.column.getCanSort()}
								on:click={header.column.getToggleSortingHandler()}
								class="flex items-center gap-x-1"
							>
								<svelte:component
									this={flexRender(header.column.columnDef.header, header.getContext())}
								/>
								{#if getSortIcon(header.column.getIsSorted().toString())}
									<Icon icon={getSortIcon(header.column.getIsSorted().toString())} />
								{/if}
							</div>
						{/if}
					</th>
				{/each}
			</tr>
		{/each}
	</thead>
	<tbody>
		{#each $table.getRowModel().rows as row}
			<tr
				class="hover:bg-gray-600 relative transition-all duration-75 cursor-pointer
				{selectedItem?.id === row.original.id && 'bg-gray-600'}"
				on:click={() => onRowSelect(row)}
			>
				{#each row.getVisibleCells() as cell}
					<td class="px-2 py-1 border border-gray-700">
						<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
