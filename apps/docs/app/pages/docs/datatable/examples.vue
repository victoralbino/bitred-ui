<script setup lang="ts">
import { ref, h } from 'vue';
import { CodeBlock } from '@/components/docs';
import {
  DataTable,
  DataTableColumnManager,
  DataTableToolbar,
} from '#registry/new-york/blocks/Datatable';
import { DataTableSortableHeader, createSelectColumn } from '#registry/new-york/blocks/Datatable/headers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';

definePageMeta({
  layout: 'docs',
});

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Sample Data
const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2024-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', createdAt: '2024-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'guest', status: 'pending', createdAt: '2024-04-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', status: 'active', createdAt: '2024-05-12' },
  { id: 6, name: 'Diana Miller', email: 'diana@example.com', role: 'admin', status: 'active', createdAt: '2024-06-18' },
  { id: 7, name: 'Edward Davis', email: 'edward@example.com', role: 'user', status: 'inactive', createdAt: '2024-07-22' },
  { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', role: 'guest', status: 'pending', createdAt: '2024-08-30' },
]);

const products = ref<Product[]>([
  { id: 1, name: 'Laptop Pro', price: 1299.99, stock: 45, category: 'Electronics' },
  { id: 2, name: 'Wireless Mouse', price: 29.99, stock: 150, category: 'Accessories' },
  { id: 3, name: 'USB-C Hub', price: 49.99, stock: 80, category: 'Accessories' },
  { id: 4, name: 'Monitor 27"', price: 399.99, stock: 30, category: 'Electronics' },
  { id: 5, name: 'Keyboard', price: 89.99, stock: 100, category: 'Accessories' },
]);

// Basic columns
const basicColumns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID', size: 60 },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
];

// Sortable columns
const sortableColumns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID', size: 60 },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableSortableHeader, { column, title: 'Name' }),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => h(DataTableSortableHeader, { column, title: 'Email' }),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => h(DataTableSortableHeader, { column, title: 'Created At' }),
  },
];

// Columns with badges and actions
const advancedColumns: ColumnDef<User>[] = [
  createSelectColumn<User>(),
  { accessorKey: 'id', header: 'ID', size: 60 },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableSortableHeader, { column, title: 'Name' }),
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const variant = role === 'admin' ? 'default' : role === 'user' ? 'secondary' : 'outline';
      return h(Badge, { variant }, () => role);
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colors: Record<string, string> = {
        active: 'bg-green-500/10 text-green-500',
        inactive: 'bg-red-500/10 text-red-500',
        pending: 'bg-yellow-500/10 text-yellow-500',
      };
      return h('span', { class: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[status]}` }, status);
    },
  },
  {
    id: 'actions',
    header: '',
    size: 60,
    cell: ({ row }) => {
      return h(DropdownMenu, {}, {
        default: () => [
          h(DropdownMenuTrigger, { asChild: true }, () =>
            h(Button, { variant: 'ghost', size: 'icon', class: 'h-8 w-8' }, () =>
              h(MoreHorizontal, { class: 'h-4 w-4' })
            )
          ),
          h(DropdownMenuContent, { align: 'end' }, () => [
            h(DropdownMenuItem, { onClick: () => console.log('Edit', row.original) }, () => [
              h(Pencil, { class: 'mr-2 h-4 w-4' }),
              'Edit',
            ]),
            h(DropdownMenuItem, { class: 'text-destructive', onClick: () => console.log('Delete', row.original) }, () => [
              h(Trash2, { class: 'mr-2 h-4 w-4' }),
              'Delete',
            ]),
          ]),
        ],
      });
    },
  },
];

// Product columns with formatting
const productColumns: ColumnDef<Product>[] = [
  { accessorKey: 'id', header: 'ID', size: 60 },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableSortableHeader, { column, title: 'Product' }),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => h(DataTableSortableHeader, { column, title: 'Price' }),
    cell: ({ row }) => {
      const price = row.getValue('price') as number;
      return h('span', { class: 'font-medium' }, `$${price.toFixed(2)}`);
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => h(DataTableSortableHeader, { column, title: 'Stock' }),
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number;
      const color = stock > 50 ? 'text-green-500' : stock > 20 ? 'text-yellow-500' : 'text-red-500';
      return h('span', { class: color }, stock);
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => h(Badge, { variant: 'outline' }, () => row.getValue('category')),
  },
];

// Code examples
const basicCode = `<script setup lang="ts">
import { DataTable } from '@/components/datatable';
import type { ColumnDef } from '@tanstack/vue-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  // ...more data
];
<\/script>

<template>
  <DataTable :columns="columns" :data="data" />
</template>`;

const sortableCode = `import { DataTableSortableHeader } from '@/components/datatable/headers';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableSortableHeader, {
      column,
      title: 'Name',
    }),
  },
  // ...more columns
];`;

const selectionCode = `import { createSelectColumn } from '@/components/datatable/headers';

const columns: ColumnDef<User>[] = [
  createSelectColumn<User>(), // Adds checkbox column
  { accessorKey: 'name', header: 'Name' },
  // ...more columns
];`;

const badgeCode = `{
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const status = row.getValue('status');
    return h(Badge, { variant: 'default' }, () => status);
  },
}`;
</script>

<template>
  <div class="space-y-16">
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Examples</h1>
      <p class="text-xl text-muted-foreground">
        Interactive examples of the DataTable component in action.
      </p>
    </div>

    <!-- Basic Table -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Basic Table</h2>
      <p class="text-muted-foreground">
        A simple table with basic columns and data.
      </p>

      <div class="rounded-lg border">
        <DataTable :columns="basicColumns" :data="users" />
      </div>

      <CodeBlock :code="basicCode" language="vue" filename="BasicTable.vue" />
    </section>

    <!-- Sortable Table -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Sortable Columns</h2>
      <p class="text-muted-foreground">
        Click on column headers to sort the data.
      </p>

      <div class="rounded-lg border">
        <DataTable :columns="sortableColumns" :data="users" />
      </div>

      <CodeBlock :code="sortableCode" language="typescript" filename="sortable-columns.ts" />
    </section>

    <!-- Table with Selection -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Row Selection</h2>
      <p class="text-muted-foreground">
        Table with checkbox selection for rows.
      </p>

      <div class="rounded-lg border">
        <DataTable :columns="advancedColumns" :data="users">
          <template #toolbar="{ table }">
            <DataTableToolbar>
              <template #left>
                <span class="text-sm text-muted-foreground">
                  {{ table.getFilteredSelectedRowModel().rows.length }} of
                  {{ table.getFilteredRowModel().rows.length }} row(s) selected
                </span>
              </template>
              <template #right>
                <DataTableColumnManager :table="table" />
              </template>
            </DataTableToolbar>
          </template>
        </DataTable>
      </div>

      <CodeBlock :code="selectionCode" language="typescript" filename="selection-column.ts" />
    </section>

    <!-- Table with Custom Cells -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Custom Cell Rendering</h2>
      <p class="text-muted-foreground">
        Table with badges, formatted values, and conditional styling.
      </p>

      <div class="rounded-lg border">
        <DataTable :columns="productColumns" :data="products" />
      </div>

      <CodeBlock :code="badgeCode" language="typescript" filename="custom-cell.ts" />
    </section>

    <!-- Table Variants -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Table Variants</h2>
      <p class="text-muted-foreground">
        Different visual styles for the table.
      </p>

      <div class="grid gap-8">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Striped</h3>
          <div class="rounded-lg border">
            <DataTable :columns="basicColumns" :data="users.slice(0, 4)" variant="striped" />
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Bordered</h3>
          <div class="rounded-lg border">
            <DataTable :columns="basicColumns" :data="users.slice(0, 4)" variant="bordered" />
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Minimal</h3>
          <div class="rounded-lg border">
            <DataTable :columns="basicColumns" :data="users.slice(0, 4)" variant="minimal" />
          </div>
        </div>
      </div>
    </section>

    <!-- Without Pagination -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Without Pagination</h2>
      <p class="text-muted-foreground">
        Table without pagination controls.
      </p>

      <div class="rounded-lg border">
        <DataTable :columns="basicColumns" :data="users.slice(0, 4)" without-pagination />
      </div>
    </section>
  </div>
</template>
