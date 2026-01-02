<script setup lang="ts">
import { CodeBlock, PropsTable } from '@/components/docs';

definePageMeta({
  layout: 'docs',
});

const props = [
  { name: 'table', type: 'Table<TData>', description: 'TanStack Table instance', required: true },
];

const example = `<script setup lang="ts">
import { DataTableColumnManager } from '@/components/datatable';
<\/script>

<template>
  <DataTable :columns="columns" :data="data">
    <template #toolbar="{ table }">
      <div class="flex items-center gap-2 p-4">
        <Input placeholder="Search..." />
        <DataTableColumnManager :table="table" />
      </div>
    </template>
  </DataTable>
</template>`;

const columnMetaExample = `import type { ColumnDef } from '@tanstack/vue-table';
import { createColumnMeta } from '@/components/datatable';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: createColumnMeta({
      columnName: 'Full Name', // Display name in column manager
    }),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableHiding: false, // Cannot be hidden
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enablePinning: true, // Can be pinned
  },
];`;

const subComponents = `// Column Manager is composed of several sub-components:
import {
  ColumnManagerTrigger,  // Button that opens the dropdown
  ColumnManagerHeader,   // Dropdown header with reset button
  ColumnManagerSearch,   // Search input for columns
  ColumnManagerItem,     // Individual column toggle
  ColumnManagerActions,  // Visibility/pinning actions
  ColumnManagerEmpty,    // Empty state when no columns match
} from '@/components/datatable/column-manager';`;
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Column Manager</h1>
      <p class="text-xl text-muted-foreground">
        Dropdown component for managing column visibility and pinning.
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Import</h2>
      <CodeBlock
        code="import { DataTableColumnManager } from '@/components/datatable';"
        language="typescript"
      />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Usage</h2>
      <p class="text-muted-foreground">
        Add the column manager to your table toolbar:
      </p>
      <CodeBlock :code="example" language="vue" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Features</h2>
      <ul class="space-y-2 text-muted-foreground">
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Search columns by name
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Toggle column visibility
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Pin columns to left or right
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Reset all columns to default
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Shows badge with hidden column count
        </li>
      </ul>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Column Configuration</h2>
      <p class="text-muted-foreground">
        Configure column behavior using column meta and TanStack Table options:
      </p>
      <CodeBlock :code="columnMetaExample" language="typescript" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Sub-components</h2>
      <p class="text-muted-foreground">
        The column manager is composed of reusable sub-components:
      </p>
      <CodeBlock :code="subComponents" language="typescript" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Props</h2>
      <PropsTable :props="props" />
    </div>
  </div>
</template>
