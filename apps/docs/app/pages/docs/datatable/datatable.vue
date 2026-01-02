<script setup lang="ts">
import { CodeBlock, PropsTable } from '@/components/docs';

definePageMeta({
  layout: 'docs',
});

const props = [
  { name: 'columns', type: 'ColumnDef<TData>[]', description: 'Column definitions for the table', required: true },
  { name: 'data', type: 'TData[]', description: 'Data array to display', required: true },
  { name: 'meta', type: 'PaginationMeta', description: 'Server pagination metadata' },
  { name: 'isLoadingData', type: 'boolean', default: 'false', description: 'Initial loading state' },
  { name: 'isFetchingData', type: 'boolean', default: 'false', description: 'Background refetch state' },
  { name: 'manualPagination', type: 'boolean', default: 'false', description: 'Server-side pagination' },
  { name: 'manualSorting', type: 'boolean', default: 'false', description: 'Server-side sorting' },
  { name: 'withoutPagination', type: 'boolean', default: 'false', description: 'Hide pagination' },
  { name: 'pagination', type: 'PaginationState', default: '{ pageIndex: 0, pageSize: 10 }', description: 'Pagination state' },
  { name: 'totalCount', type: 'number', default: '0', description: 'Total record count' },
  { name: 'enableRowClick', type: 'boolean', default: 'false', description: 'Enable row click' },
  { name: 'rowClassName', type: '(row: TData) => string', description: 'Dynamic row class' },
  { name: 'variant', type: "'default' | 'striped' | 'bordered' | 'minimal'", default: "'default'", description: 'Table variant' },
  { name: 'containerClass', type: 'string | string[]', description: 'Container CSS classes' },
  { name: 'pinHeader', type: 'boolean', default: 'false', description: 'Sticky header' },
  { name: 'enableRowPinning', type: 'boolean', default: 'false', description: 'Row pinning' },
  { name: 'enableColumnPinning', type: 'boolean', default: 'false', description: 'Column pinning' },
  { name: 'enableReorder', type: 'boolean', default: 'false', description: 'Column reordering' },
  { name: 'textWrap', type: 'boolean', default: 'false', description: 'Cell text wrapping' },
  { name: 'onTableReady', type: '(table: Table<TData>) => void', description: 'Callback when table is ready' },
];

const events = [
  { name: 'sorting-change', type: 'Updater<SortingState>', description: 'Fired when sorting changes' },
  { name: 'visibility-change', type: 'VisibilityState', description: 'Fired when column visibility changes' },
  { name: 'pagination-change', type: 'PaginationState', description: 'Fired when pagination changes' },
  { name: 'table-change', type: 'TableChangeData', description: 'Fired on any table state change' },
  { name: 'row-click', type: 'TData', description: 'Fired when row is clicked' },
  { name: 'cell-commit', type: '{ row, columnId, value }', description: 'Fired when cell edit is committed' },
];

const slotExample = `<DataTable :columns="columns" :data="data">
  <template #toolbar="{ table, isFetching }">
    <div class="flex items-center gap-2 p-4">
      <Input placeholder="Search..." />
      <DataTableColumnManager :table="table" />
    </div>
  </template>
</DataTable>`;

const variantsExample = `<!-- Default -->
<DataTable :columns="columns" :data="data" variant="default" />

<!-- Striped rows -->
<DataTable :columns="columns" :data="data" variant="striped" />

<!-- Bordered cells -->
<DataTable :columns="columns" :data="data" variant="bordered" />

<!-- Minimal style -->
<DataTable :columns="columns" :data="data" variant="minimal" />`;
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">DataTable</h1>
      <p class="text-xl text-muted-foreground">
        The main table component that orchestrates all sub-components.
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Import</h2>
      <CodeBlock
        code="import { DataTable } from '@/components/datatable';"
        language="typescript"
      />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Slots</h2>
      <p class="text-muted-foreground">
        The DataTable provides a <code class="rounded bg-muted px-1.5 py-0.5">toolbar</code> slot for custom toolbar content.
      </p>
      <CodeBlock :code="slotExample" language="vue" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Variants</h2>
      <p class="text-muted-foreground">
        The table supports multiple visual variants:
      </p>
      <CodeBlock :code="variantsExample" language="vue" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Props</h2>
      <PropsTable :props="props" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Events</h2>
      <PropsTable :props="events" />
    </div>
  </div>
</template>
