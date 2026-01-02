<script setup lang="ts">
import { CodeBlock, PropsTable } from '@/components/docs';

definePageMeta({
  layout: 'docs',
});

const props = [
  { name: 'table', type: 'Table<TData>', description: 'TanStack Table instance', required: true },
  { name: 'columns', type: 'ColumnDef<TData>[]', description: 'Column definitions', required: true },
  { name: 'enableRowClick', type: 'boolean', default: 'false', description: 'Enable row click events' },
  { name: 'rowClassName', type: '(row: TData) => string', description: 'Dynamic row class function' },
  { name: 'isLoading', type: 'boolean', default: 'false', description: 'Show loading skeleton' },
];

const events = [
  { name: 'row-click', type: 'TData', description: 'Fired when a row is clicked (if enableRowClick is true)' },
];

const example = `<script setup lang="ts">
import { DataTableBody } from '@/components/datatable';

function handleRowClick(row: User) {
  console.log('Clicked row:', row);
}
<\/script>

<template>
  <table>
    <DataTableHeader :table="table" />
    <DataTableBody
      :table="table"
      :columns="columns"
      :enable-row-click="true"
      @row-click="handleRowClick"
    />
  </table>
</template>`;

const rowClassExample = `<DataTableBody
  :table="table"
  :columns="columns"
  :row-class-name="(row) => row.status === 'inactive' ? 'opacity-50' : ''"
/>`;
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">DataTableBody</h1>
      <p class="text-xl text-muted-foreground">
        Renders the table body with rows and cells. Supports row click events and dynamic styling.
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Import</h2>
      <CodeBlock
        code="import { DataTableBody } from '@/components/datatable';"
        language="typescript"
      />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Usage</h2>
      <CodeBlock :code="example" language="vue" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Dynamic Row Classes</h2>
      <p class="text-muted-foreground">
        Use <code class="rounded bg-muted px-1.5 py-0.5">rowClassName</code> to apply conditional styles to rows.
      </p>
      <CodeBlock :code="rowClassExample" language="vue" />
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
