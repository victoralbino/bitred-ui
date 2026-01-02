<script setup lang="ts">
import { CodeBlock, PropsTable } from '@/components/docs';

definePageMeta({
  layout: 'docs',
});

const sortableProps = [
  { name: 'column', type: 'Column<TData>', description: 'TanStack Table column instance', required: true },
  { name: 'title', type: 'string', description: 'Header title text', required: true },
];

const advancedProps = [
  { name: 'column', type: 'Column<TData>', description: 'TanStack Table column instance', required: true },
  { name: 'title', type: 'string', description: 'Header title text', required: true },
];

const sortableExample = `<script setup lang="ts">
import { DataTableSortableHeader } from '@/components/datatable/headers';
import type { ColumnDef } from '@tanstack/vue-table';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableSortableHeader, {
      column,
      title: 'Name',
    }),
  },
];
<\/script>`;

const advancedExample = `<script setup lang="ts">
import { DataTableAdvancedHeader } from '@/components/datatable/headers';
import type { ColumnDef } from '@tanstack/vue-table';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableAdvancedHeader, {
      column,
      title: 'Name',
    }),
  },
];
<\/script>

<!-- Advanced header includes:
  - Sort ascending/descending
  - Hide column option
  - Pin to left/right options
-->`;

const selectCheckboxExample = `<script setup lang="ts">
import { createSelectColumn } from '@/components/datatable/headers';
import type { ColumnDef } from '@tanstack/vue-table';

const columns: ColumnDef<User>[] = [
  createSelectColumn<User>(), // Adds checkbox column
  {
    accessorKey: 'name',
    header: 'Name',
  },
  // ... other columns
];
<\/script>`;
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Sortable Header</h1>
      <p class="text-xl text-muted-foreground">
        Header components with sorting functionality and advanced options.
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Import</h2>
      <CodeBlock
        code="import {
  DataTableSortableHeader,
  DataTableAdvancedHeader,
  SelectCheckbox,
  createSelectColumn,
} from '@/components/datatable/headers';"
        language="typescript"
      />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">DataTableSortableHeader</h2>
      <p class="text-muted-foreground">
        Simple header with sort toggle button. Click to cycle through: none → ascending → descending.
      </p>
      <CodeBlock :code="sortableExample" language="vue" />
      <h3 class="text-lg font-semibold">Props</h3>
      <PropsTable :props="sortableProps" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">DataTableAdvancedHeader</h2>
      <p class="text-muted-foreground">
        Full-featured header with dropdown menu for sorting, hiding, and pinning.
      </p>
      <CodeBlock :code="advancedExample" language="vue" />
      <h3 class="text-lg font-semibold">Props</h3>
      <PropsTable :props="advancedProps" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Row Selection</h2>
      <p class="text-muted-foreground">
        Use <code class="rounded bg-muted px-1.5 py-0.5">createSelectColumn</code> to add a checkbox column for row selection.
      </p>
      <CodeBlock :code="selectCheckboxExample" language="vue" />
    </div>
  </div>
</template>
