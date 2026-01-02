<script setup lang="ts">
import { CodeBlock, PropsTable } from '@/components/docs';

definePageMeta({
  layout: 'docs',
});

const props = [
  { name: 'table', type: 'Table<TData>', description: 'TanStack Table instance', required: true },
  { name: 'pinHeader', type: 'boolean', default: 'false', description: 'Make header sticky' },
  { name: 'enableReorder', type: 'boolean', default: 'false', description: 'Enable column reordering via drag and drop' },
];

const example = `<script setup lang="ts">
import { DataTableHeader } from '@/components/datatable';
<\/script>

<template>
  <table>
    <DataTableHeader
      :table="table"
      :pin-header="true"
      :enable-reorder="true"
    />
    <!-- ... body -->
  </table>
</template>`;

const reorderExample = `<!-- Enable column reordering -->
<DataTableHeader
  :table="table"
  :enable-reorder="true"
/>

<!-- The header will automatically handle:
  - Drag and drop of columns
  - Visual feedback during drag
  - Column position updates
-->`;
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">DataTableHeader</h1>
      <p class="text-xl text-muted-foreground">
        Renders the table header with support for sorting, column pinning, and drag-and-drop reordering.
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Import</h2>
      <CodeBlock
        code="import { DataTableHeader } from '@/components/datatable';"
        language="typescript"
      />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Usage</h2>
      <CodeBlock :code="example" language="vue" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Column Reordering</h2>
      <p class="text-muted-foreground">
        When <code class="rounded bg-muted px-1.5 py-0.5">enableReorder</code> is true, columns can be reordered by dragging.
      </p>
      <CodeBlock :code="reorderExample" language="vue" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Sticky Header</h2>
      <p class="text-muted-foreground">
        Use <code class="rounded bg-muted px-1.5 py-0.5">pinHeader</code> to make the header sticky when scrolling.
        Make sure the table container has a defined height.
      </p>
      <CodeBlock
        code='<div class="h-[400px] overflow-auto">
  <table>
    <DataTableHeader :table="table" :pin-header="true" />
    <DataTableBody :table="table" :columns="columns" />
  </table>
</div>'
        language="vue"
      />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Props</h2>
      <PropsTable :props="props" />
    </div>
  </div>
</template>
