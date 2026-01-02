<script setup lang="ts">
import { CodeBlock, InstallationTabs, PropsTable } from '@/components/docs';

definePageMeta({
  layout: 'docs',
});

const dependencies = ['@tanstack/vue-table'];
const registryDependencies = [
  'table',
  'button',
  'select',
  'skeleton',
  'dropdown-menu',
  'badge',
  'checkbox',
  'input',
  'tooltip',
  'spinner',
];

const mainProps = [
  { name: 'columns', type: 'ColumnDef<TData>[]', description: 'Column definitions for the table', required: true },
  { name: 'data', type: 'TData[]', description: 'Data to be displayed in the table', required: true },
  { name: 'meta', type: 'PaginationMeta', description: 'Pagination metadata (for server-side pagination)' },
  { name: 'isLoadingData', type: 'boolean', default: 'false', description: 'Shows loading skeleton' },
  { name: 'isFetchingData', type: 'boolean', default: 'false', description: 'Shows spinner during refetch' },
  { name: 'manualPagination', type: 'boolean', default: 'false', description: 'Enable server-side pagination' },
  { name: 'manualSorting', type: 'boolean', default: 'false', description: 'Enable server-side sorting' },
  { name: 'withoutPagination', type: 'boolean', default: 'false', description: 'Hide pagination controls' },
  { name: 'pagination', type: 'PaginationState', default: '{ pageIndex: 0, pageSize: 10 }', description: 'Current pagination state' },
  { name: 'enableRowClick', type: 'boolean', default: 'false', description: 'Enable row click events' },
  { name: 'variant', type: "'default' | 'striped' | 'bordered' | 'minimal'", default: "'default'", description: 'Visual variant' },
  { name: 'pinHeader', type: 'boolean', default: 'false', description: 'Make header sticky' },
  { name: 'enableColumnPinning', type: 'boolean', default: 'false', description: 'Enable column pinning' },
  { name: 'enableReorder', type: 'boolean', default: 'false', description: 'Enable column reordering' },
  { name: 'textWrap', type: 'boolean', default: 'false', description: 'Enable text wrapping in cells' },
];

const basicExample = `<script setup lang="ts">
import { DataTable } from '@/components/datatable';
import type { ColumnDef } from '@tanstack/vue-table';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive' },
];
<\/script>

<template>
  <DataTable :columns="columns" :data="data" />
</template>`;

const serverPaginationExample = `<script setup lang="ts">
import { ref, watch } from 'vue';
import { DataTable, buildTableQueryParams } from '@/components/datatable';
import type { TableChangeData, PaginationMeta } from '@/components/datatable/types';

const data = ref([]);
const meta = ref<PaginationMeta>();
const isLoading = ref(true);

async function fetchData(params: TableChangeData) {
  isLoading.value = true;
  const queryParams = buildTableQueryParams(params);

  const response = await fetch(\`/api/users?\${new URLSearchParams(queryParams)}\`);
  const result = await response.json();

  data.value = result.data;
  meta.value = result.meta;
  isLoading.value = false;
}

function handleTableChange(params: TableChangeData) {
  fetchData(params);
}
<\/script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :meta="meta"
    :is-loading-data="isLoading"
    manual-pagination
    manual-sorting
    @table-change="handleTableChange"
  />
</template>`;
</script>

<template>
  <div class="space-y-12">
    <!-- Header -->
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Data Table</h1>
      <p class="text-xl text-muted-foreground">
        A powerful and flexible data table component built with @tanstack/vue-table.
        Supports sorting, pagination, column pinning, reordering, and editable cells.
      </p>
    </div>

    <!-- Features -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Features</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Sorting</h3>
          <p class="text-sm text-muted-foreground">Client-side and server-side sorting support</p>
        </div>
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Pagination</h3>
          <p class="text-sm text-muted-foreground">Built-in client and server pagination</p>
        </div>
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Column Pinning</h3>
          <p class="text-sm text-muted-foreground">Pin columns to left or right</p>
        </div>
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Column Reordering</h3>
          <p class="text-sm text-muted-foreground">Drag and drop column reordering</p>
        </div>
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Editable Cells</h3>
          <p class="text-sm text-muted-foreground">Inline cell editing with validation</p>
        </div>
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold">Row Selection</h3>
          <p class="text-sm text-muted-foreground">Single and multi-row selection</p>
        </div>
      </div>
    </div>

    <!-- Installation -->
    <InstallationTabs
      component-name="datatable"
      :dependencies="dependencies"
      :registry-dependencies="registryDependencies"
    />

    <!-- CSS Import -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">CSS Setup</h2>
      <p class="text-muted-foreground">
        Import the datatable CSS in your main stylesheet:
      </p>
      <CodeBlock
        code='@import "@/components/datatable/css/datatable.css";'
        language="css"
        filename="assets/css/main.css"
      />
    </div>

    <!-- Basic Usage -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Basic Usage</h2>
      <CodeBlock :code="basicExample" language="vue" filename="MyTable.vue" />
    </div>

    <!-- Server-side Pagination -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Server-side Pagination</h2>
      <p class="text-muted-foreground">
        For large datasets, use server-side pagination with the <code class="rounded bg-muted px-1.5 py-0.5">manualPagination</code> prop.
      </p>
      <CodeBlock :code="serverPaginationExample" language="vue" filename="ServerTable.vue" />
    </div>

    <!-- Props -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Props</h2>
      <PropsTable :props="mainProps" />
    </div>

    <!-- Components -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Sub-components</h2>
      <p class="text-muted-foreground">
        The DataTable is composed of several sub-components that can be used independently:
      </p>
      <div class="grid gap-2">
        <NuxtLink
          to="/docs/datatable/datatable"
          class="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h3 class="font-semibold">DataTable</h3>
          <p class="text-sm text-muted-foreground">Main table component</p>
        </NuxtLink>
        <NuxtLink
          to="/docs/datatable/header"
          class="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h3 class="font-semibold">DataTableHeader</h3>
          <p class="text-sm text-muted-foreground">Table header with sorting and pinning</p>
        </NuxtLink>
        <NuxtLink
          to="/docs/datatable/body"
          class="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h3 class="font-semibold">DataTableBody</h3>
          <p class="text-sm text-muted-foreground">Table body with row rendering</p>
        </NuxtLink>
        <NuxtLink
          to="/docs/datatable/pagination"
          class="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h3 class="font-semibold">Pagination</h3>
          <p class="text-sm text-muted-foreground">Client and server pagination components</p>
        </NuxtLink>
        <NuxtLink
          to="/docs/datatable/column-manager"
          class="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h3 class="font-semibold">Column Manager</h3>
          <p class="text-sm text-muted-foreground">Column visibility and pinning controls</p>
        </NuxtLink>
        <NuxtLink
          to="/docs/datatable/sortable-header"
          class="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h3 class="font-semibold">Sortable Header</h3>
          <p class="text-sm text-muted-foreground">Header cell with sorting functionality</p>
        </NuxtLink>
        <NuxtLink
          to="/docs/datatable/editable-cells"
          class="rounded-lg border p-4 transition-colors hover:bg-muted"
        >
          <h3 class="font-semibold">Editable Cells</h3>
          <p class="text-sm text-muted-foreground">Inline cell editing component</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
