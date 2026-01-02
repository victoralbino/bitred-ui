<script setup lang="ts">
import { CodeBlock, PropsTable } from '@/components/docs';

definePageMeta({
  layout: 'docs',
});

const clientProps = [
  { name: 'table', type: 'Table<TData>', description: 'TanStack Table instance', required: true },
  { name: 'isLoadingData', type: 'boolean', default: 'false', description: 'Disable controls during loading' },
];

const serverProps = [
  { name: 'meta', type: 'PaginationMeta', description: 'Server pagination metadata', required: true },
  { name: 'isLoadingData', type: 'boolean', default: 'false', description: 'Disable controls during loading' },
];

const serverEvents = [
  { name: 'pagination-change', type: 'PaginationState', description: 'Fired when pagination changes' },
];

const clientExample = `<script setup lang="ts">
import { PaginationClient } from '@/components/datatable';
<\/script>

<template>
  <DataTable :columns="columns" :data="data">
    <!-- Uses PaginationClient internally when manualPagination is false -->
  </DataTable>

  <!-- Or use standalone -->
  <PaginationClient :table="table" />
</template>`;

const serverExample = `<script setup lang="ts">
import { ref } from 'vue';
import { PaginationServer } from '@/components/datatable';
import type { PaginationMeta, PaginationState } from '@/components/datatable/types';

const meta = ref<PaginationMeta>({
  current_page: 1,
  from: 1,
  to: 10,
  last_page: 5,
  per_page: 10,
  total: 50,
});

function handlePaginationChange(pagination: PaginationState) {
  // Fetch new data from server
  fetchData({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
  });
}
<\/script>

<template>
  <PaginationServer
    :meta="meta"
    :is-loading-data="isLoading"
    @pagination-change="handlePaginationChange"
  />
</template>`;

const metaInterface = `interface PaginationMeta {
  current_page: number;  // Current page (1-indexed)
  from: number | null;   // First record index
  to: number | null;     // Last record index
  last_page: number;     // Total pages
  per_page: number;      // Records per page
  total: number;         // Total records
}`;
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Pagination</h1>
      <p class="text-xl text-muted-foreground">
        Two pagination components: PaginationClient for client-side and PaginationServer for server-side pagination.
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Import</h2>
      <CodeBlock
        code="import { PaginationClient, PaginationServer } from '@/components/datatable';"
        language="typescript"
      />
    </div>

    <div class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
      <h3 class="font-semibold text-blue-900 dark:text-blue-100">When to use which?</h3>
      <ul class="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
        <li><strong>PaginationClient:</strong> When all data is loaded in memory (small datasets)</li>
        <li><strong>PaginationServer:</strong> When data is fetched from server per page (large datasets)</li>
      </ul>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">PaginationClient</h2>
      <p class="text-muted-foreground">
        Used automatically by DataTable when <code class="rounded bg-muted px-1.5 py-0.5">manualPagination</code> is false.
      </p>
      <CodeBlock :code="clientExample" language="vue" />
      <h3 class="text-lg font-semibold">Props</h3>
      <PropsTable :props="clientProps" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">PaginationServer</h2>
      <p class="text-muted-foreground">
        For server-side pagination. Requires metadata from your API response.
      </p>
      <CodeBlock :code="serverExample" language="vue" />

      <h3 class="text-lg font-semibold">PaginationMeta Interface</h3>
      <CodeBlock :code="metaInterface" language="typescript" />

      <h3 class="text-lg font-semibold">Props</h3>
      <PropsTable :props="serverProps" />

      <h3 class="text-lg font-semibold">Events</h3>
      <PropsTable :props="serverEvents" />
    </div>
  </div>
</template>
