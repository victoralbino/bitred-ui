<script setup lang="ts">
import { CodeBlock, PropsTable } from '@/components/docs';

definePageMeta({
  layout: 'docs',
});

const cellMetaProps = [
  { name: 'editable', type: 'boolean', default: 'false', description: 'Enable cell editing' },
  { name: 'inputType', type: 'string', default: "'text'", description: 'Input type (text, number, money:2, money:4, cep, cpf, cnpj, cpf_cnpj)' },
  { name: 'placeholder', type: 'string', description: 'Input placeholder text' },
  { name: 'prefix', type: 'string', description: 'Input prefix (e.g., "R$ ")' },
  { name: 'suffix', type: 'string', description: 'Input suffix (e.g., " kg")' },
];

const example = `<script setup lang="ts">
import { DataTable, createColumnMeta } from '@/components/datatable';
import type { ColumnDef } from '@tanstack/vue-table';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: createColumnMeta({
      cell: {
        editable: true,
        inputType: 'text',
        placeholder: 'Enter name...',
      },
    }),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    meta: createColumnMeta({
      cell: {
        editable: true,
        inputType: 'money:2',
        prefix: 'R$ ',
      },
    }),
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    meta: createColumnMeta({
      cell: {
        editable: true,
        inputType: 'number',
        suffix: ' units',
      },
    }),
  },
];

function handleCellCommit({ row, columnId, value }) {
  console.log(\`Updated \${columnId} to \${value} for row \${row.id}\`);
  // Send update to API
}
<\/script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    @cell-commit="handleCellCommit"
  />
</template>`;

const inputTypesExample = `// Available input types:
const inputTypes = {
  'text': 'Free text input',
  'string': 'Alias for text',
  'number': 'Numeric input only',
  'money:2': 'Currency with 2 decimal places',
  'money:4': 'Currency with 4 decimal places',
  'cep': 'Brazilian postal code (00000-000)',
  'cpf': 'Brazilian individual ID (000.000.000-00)',
  'cnpj': 'Brazilian company ID (00.000.000/0000-00)',
  'cpf_cnpj': 'Auto-detect CPF or CNPJ',
};`;

const editableCellUsage = `import { EditableCell } from '@/components/datatable/inputs';

// EditableCell is used internally by DataTableBody
// when column meta has editable: true

// You can also use it directly:
<EditableCell
  :value="currentValue"
  :meta="{
    editable: true,
    inputType: 'money:2',
    prefix: 'R$ ',
  }"
  @commit="handleCommit"
  @cancel="handleCancel"
/>`;
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Editable Cells</h1>
      <p class="text-xl text-muted-foreground">
        Enable inline editing of table cells with validation and formatting.
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Import</h2>
      <CodeBlock
        code="import { EditableCell } from '@/components/datatable/inputs';
import { createColumnMeta } from '@/components/datatable';"
        language="typescript"
      />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Usage</h2>
      <p class="text-muted-foreground">
        Configure editable cells using column meta:
      </p>
      <CodeBlock :code="example" language="vue" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Input Types</h2>
      <p class="text-muted-foreground">
        The component supports various input types with automatic formatting:
      </p>
      <CodeBlock :code="inputTypesExample" language="typescript" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">How it works</h2>
      <ol class="space-y-2 text-muted-foreground list-decimal list-inside">
        <li>Click on a cell to enter edit mode</li>
        <li>Type the new value</li>
        <li>Press <kbd class="rounded border bg-muted px-1.5 py-0.5 text-xs">Enter</kbd> to confirm or <kbd class="rounded border bg-muted px-1.5 py-0.5 text-xs">Escape</kbd> to cancel</li>
        <li>The <code class="rounded bg-muted px-1.5 py-0.5">cell-commit</code> event is fired with the new value</li>
      </ol>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Standalone Usage</h2>
      <p class="text-muted-foreground">
        You can also use the EditableCell component directly:
      </p>
      <CodeBlock :code="editableCellUsage" language="vue" />
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Cell Meta Options</h2>
      <PropsTable :props="cellMetaProps" />
    </div>
  </div>
</template>
