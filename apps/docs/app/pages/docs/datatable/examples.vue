<script setup lang="ts">
import { ref, h, computed } from 'vue';
import { CodeBlock } from '@/components/docs';
import {
  DataTable,
  DataTableColumnManager,
  DataTableToolbar,
  buildTableQueryParams,
} from '#registry/new-york/blocks/Datatable';
import {
  DataTableSortableHeader,
  DataTableAdvancedHeader,
  createSelectColumn,
} from '#registry/new-york/blocks/Datatable/headers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, RefreshCw } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import type { PaginationMeta, ExtendedColumnMeta } from '#registry/new-york/blocks/Datatable/types';
import { EditableCell } from '#registry/new-york/blocks/Datatable/inputs';
import { createColumnMeta } from '#registry/new-york/blocks/Datatable';

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
  department: string;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface EditableProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  cpf: string;
}

// Sample Data
const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', department: 'Engineering', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', department: 'Marketing', createdAt: '2024-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', department: 'Sales', createdAt: '2024-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'guest', status: 'pending', department: 'HR', createdAt: '2024-04-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', status: 'active', department: 'Engineering', createdAt: '2024-05-12' },
  { id: 6, name: 'Diana Miller', email: 'diana@example.com', role: 'admin', status: 'active', department: 'Finance', createdAt: '2024-06-18' },
  { id: 7, name: 'Edward Davis', email: 'edward@example.com', role: 'user', status: 'inactive', department: 'Engineering', createdAt: '2024-07-22' },
  { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', role: 'guest', status: 'pending', department: 'Marketing', createdAt: '2024-08-30' },
]);

const products = ref<Product[]>([
  { id: 1, name: 'Laptop Pro', price: 1299.99, stock: 45, category: 'Electronics' },
  { id: 2, name: 'Wireless Mouse', price: 29.99, stock: 150, category: 'Accessories' },
  { id: 3, name: 'USB-C Hub', price: 49.99, stock: 80, category: 'Accessories' },
  { id: 4, name: 'Monitor 27"', price: 399.99, stock: 30, category: 'Electronics' },
  { id: 5, name: 'Keyboard', price: 89.99, stock: 100, category: 'Accessories' },
]);

// Editable products data
const editableProducts = ref<EditableProduct[]>([
  { id: 1, name: 'Laptop Pro', price: 1299.99, quantity: 10, cpf: '12345678901' },
  { id: 2, name: 'Wireless Mouse', price: 29.99, quantity: 50, cpf: '98765432100' },
  { id: 3, name: 'USB-C Hub', price: 49.99, quantity: 25, cpf: '11122233344' },
  { id: 4, name: 'Monitor 27"', price: 399.99, quantity: 5, cpf: '55566677788' },
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

// Advanced Header columns (with sorting, pinning, and hide options)
const advancedHeaderColumns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID', size: 60, enablePinning: false },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableAdvancedHeader, { column, title: 'Name' }),
    enablePinning: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => h(DataTableAdvancedHeader, { column, title: 'Email' }),
    enablePinning: true,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => h(DataTableAdvancedHeader, { column, title: 'Department' }),
    enablePinning: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => h(DataTableAdvancedHeader, { column, title: 'Role' }),
    enablePinning: true,
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const variant = role === 'admin' ? 'default' : role === 'user' ? 'secondary' : 'outline';
      return h(Badge, { variant }, () => role);
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableAdvancedHeader, { column, title: 'Status' }),
    enablePinning: true,
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
    accessorKey: 'createdAt',
    header: ({ column }) => h(DataTableAdvancedHeader, { column, title: 'Created At' }),
    enablePinning: true,
  },
];

// Column Pinning columns
const pinningColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
    enablePinning: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableAdvancedHeader, { column, title: 'Name' }),
    size: 150,
    enablePinning: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 200,
    enablePinning: true,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    size: 150,
    enablePinning: true,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    size: 100,
    enablePinning: true,
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const variant = role === 'admin' ? 'default' : role === 'user' ? 'secondary' : 'outline';
      return h(Badge, { variant }, () => role);
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 100,
    enablePinning: true,
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
    accessorKey: 'createdAt',
    header: 'Created At',
    size: 120,
    enablePinning: true,
  },
  {
    id: 'actions',
    header: '',
    size: 60,
    enablePinning: true,
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

// Columns with selection and actions
const selectionColumns: ColumnDef<User>[] = [
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

// Reorder columns
const reorderColumns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID', size: 60 },
  { accessorKey: 'name', header: 'Name', size: 150 },
  { accessorKey: 'email', header: 'Email', size: 200 },
  { accessorKey: 'department', header: 'Department', size: 120 },
  { accessorKey: 'role', header: 'Role', size: 100 },
  { accessorKey: 'status', header: 'Status', size: 100 },
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

// Editable columns - demonstrates different input types with maska
const editableColumns: ColumnDef<EditableProduct>[] = [
  { accessorKey: 'id', header: 'ID', size: 60 },
  {
    accessorKey: 'name',
    header: 'Product Name',
    cell: (props) => h(EditableCell, { cell: props.cell }),
    meta: {
      columnName: 'Product Name',
      cell: { editable: true, inputType: 'text', placeholder: 'Enter name...' },
    } as ExtendedColumnMeta<EditableProduct>,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: (props) => h(EditableCell, { cell: props.cell }),
    meta: {
      columnName: 'Price',
      cell: { editable: true, inputType: 'money:2', prefix: 'R$' },
    } as ExtendedColumnMeta<EditableProduct>,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: (props) => h(EditableCell, { cell: props.cell }),
    meta: {
      columnName: 'Quantity',
      cell: { editable: true, inputType: 'number', suffix: 'un' },
    } as ExtendedColumnMeta<EditableProduct>,
  },
  {
    accessorKey: 'cpf',
    header: 'CPF',
    cell: (props) => h(EditableCell, { cell: props.cell }),
    meta: {
      columnName: 'CPF',
      cell: { editable: true, inputType: 'cpf', placeholder: '000.000.000-00' },
    } as ExtendedColumnMeta<EditableProduct>,
  },
];

// Handle cell edit commit
function handleCellCommit(payload: { row: EditableProduct; columnId: string; value: unknown }) {
  console.log('Cell committed:', payload);
  // In a real app, you would update the data here
  const index = editableProducts.value.findIndex(p => p.id === payload.row.id);
  if (index !== -1) {
    (editableProducts.value[index] as Record<string, unknown>)[payload.columnId] = payload.value;
  }
}

// Server-side pagination state
const serverData = ref<User[]>([]);
const serverMeta = ref<PaginationMeta>({
  current_page: 1,
  from: 1,
  last_page: 3,
  per_page: 3,
  to: 3,
  total: 8,
});
const isServerLoading = ref(false);
const serverSearchTerm = ref('');

// All users for server simulation
const allUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', department: 'Engineering', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', department: 'Marketing', createdAt: '2024-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', department: 'Sales', createdAt: '2024-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'guest', status: 'pending', department: 'HR', createdAt: '2024-04-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', status: 'active', department: 'Engineering', createdAt: '2024-05-12' },
  { id: 6, name: 'Diana Miller', email: 'diana@example.com', role: 'admin', status: 'active', department: 'Finance', createdAt: '2024-06-18' },
  { id: 7, name: 'Edward Davis', email: 'edward@example.com', role: 'user', status: 'inactive', department: 'Engineering', createdAt: '2024-07-22' },
  { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', role: 'guest', status: 'pending', department: 'Marketing', createdAt: '2024-08-30' },
];

// Server columns
const serverColumns: ColumnDef<User>[] = [
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
];

// Simulate server fetch
async function fetchServerData(page: number = 1, perPage: number = 3, sortField?: string, sortDir?: string) {
  isServerLoading.value = true;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...allUsers];

  // Apply search filter
  if (serverSearchTerm.value) {
    const search = serverSearchTerm.value.toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  }

  // Apply sorting
  if (sortField) {
    filtered.sort((a, b) => {
      const aVal = String(a[sortField as keyof User]);
      const bVal = String(b[sortField as keyof User]);
      return sortDir === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });
  }

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  serverData.value = filtered.slice(start, end);
  serverMeta.value = {
    current_page: page,
    from: total > 0 ? start + 1 : null,
    last_page: Math.ceil(total / perPage),
    per_page: perPage,
    to: total > 0 ? Math.min(end, total) : null,
    total,
  };

  isServerLoading.value = false;
}

// Initial load
fetchServerData();

// Handle table changes
function handleTableChange(e: { sorting: { id: string; desc: boolean }[]; pagination: { pageIndex: number; pageSize: number } }) {
  const params = buildTableQueryParams(e);
  const [sortField, sortDir] = params.sort?.split(':') ?? [];
  fetchServerData(params.page, params.per_page, sortField, sortDir);
}

function handleServerSearch() {
  fetchServerData(1, serverMeta.value.per_page);
}

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

const advancedHeaderCode = `import { DataTableAdvancedHeader } from '@/components/datatable/headers';

// Advanced header with sorting, pinning, and hide options
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableAdvancedHeader, {
      column,
      title: 'Name',
    }),
    enablePinning: true, // Enable column pinning
  },
  // ...more columns
];

// Enable column pinning in DataTable
<DataTable
  :columns="columns"
  :data="data"
  enable-column-pinning
/>`;

const selectionCode = `import { createSelectColumn } from '@/components/datatable/headers';

const columns: ColumnDef<User>[] = [
  createSelectColumn<User>(), // Adds checkbox column
  { accessorKey: 'name', header: 'Name' },
  // ...more columns
];`;

const pinningCode = `// Enable column pinning
<DataTable
  :columns="columns"
  :data="data"
  enable-column-pinning
/>

// Columns with enablePinning
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableAdvancedHeader, {
      column,
      title: 'Name',
    }),
    enablePinning: true,
  },
  {
    accessorKey: 'actions',
    header: '',
    enablePinning: true, // Pin actions to the right
  },
];`;

const reorderCode = `// Enable column reordering with drag and drop
<DataTable
  :columns="columns"
  :data="data"
  enable-reorder
/>`;

const serverSideCode = `<script setup>
import { ref } from 'vue';
import { DataTable, buildTableQueryParams } from '@/components/datatable';

const data = ref([]);
const meta = ref({
  current_page: 1,
  from: 1,
  last_page: 1,
  per_page: 10,
  to: 10,
  total: 100,
});
const isLoading = ref(false);

async function fetchData(params) {
  isLoading.value = true;
  const response = await fetch(\`/api/users?\${new URLSearchParams(params)}\`);
  const result = await response.json();
  data.value = result.data;
  meta.value = result.meta;
  isLoading.value = false;
}

function handleTableChange(e) {
  const params = buildTableQueryParams(e);
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

const badgeCode = `{
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const status = row.getValue('status');
    return h(Badge, { variant: 'default' }, () => status);
  },
}`;

const editableCellsCode = `import { EditableCell } from '@/components/datatable/inputs';
import type { ExtendedColumnMeta } from '@/components/datatable/types';

interface Product {
  id: number;
  name: string;
  price: number;
  cpf: string;
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (props) => h(EditableCell, { cell: props.cell }),
    meta: {
      columnName: 'Name',
      cell: { editable: true, inputType: 'text' },
    } as ExtendedColumnMeta<Product>,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: (props) => h(EditableCell, { cell: props.cell }),
    meta: {
      columnName: 'Price',
      cell: {
        editable: true,
        inputType: 'money:2', // Uses maska for formatting
        prefix: 'R$',
      },
    } as ExtendedColumnMeta<Product>,
  },
  {
    accessorKey: 'cpf',
    header: 'CPF',
    cell: (props) => h(EditableCell, { cell: props.cell }),
    meta: {
      columnName: 'CPF',
      cell: {
        editable: true,
        inputType: 'cpf', // Auto-formats to ###.###.###-##
      },
    } as ExtendedColumnMeta<Product>,
  },
];

// Handle the cell-commit event
function handleCellCommit(payload: { row: Product; columnId: string; value: unknown }) {
  console.log('Cell edited:', payload);
}

<template>
  <DataTable
    :columns="columns"
    :data="products"
    @cell-commit="handleCellCommit"
  />
</template>

// Available input types:
// - text: Plain text input
// - number: Numeric input
// - money:2: Currency with 2 decimal places (uses maska)
// - money:4: Currency with 4 decimal places (uses maska)
// - cep: Brazilian postal code #####-###
// - cpf: Brazilian CPF ###.###.###-##
// - cnpj: Brazilian CNPJ ##.###.###/####-##
// - cpf_cnpj: Auto-detect CPF or CNPJ`;

const dependenciesCode = `// The DataTable component requires these dependencies:

// Package dependencies (npm install):
// - @tanstack/vue-table: Table core functionality
// - maska: Input masking for editable cells
// - vue-sonner: Toast notifications

// shadcn-vue registry dependencies:
// table, button, select, skeleton, dropdown-menu,
// badge, checkbox, input, tooltip, spinner`;
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
        Click on column headers to sort the data. Uses <code class="bg-muted px-1 py-0.5 rounded">DataTableSortableHeader</code>.
      </p>

      <div class="rounded-lg border">
        <DataTable :columns="sortableColumns" :data="users" />
      </div>

      <CodeBlock :code="sortableCode" language="typescript" filename="sortable-columns.ts" />
    </section>

    <!-- Advanced Header -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Advanced Header</h2>
      <p class="text-muted-foreground">
        Headers with dropdown menu for sorting, pinning columns, and hiding columns.
        Uses <code class="bg-muted px-1 py-0.5 rounded">DataTableAdvancedHeader</code>.
      </p>

      <div class="rounded-lg border">
        <DataTable
          :columns="advancedHeaderColumns"
          :data="users"
          enable-column-pinning
        >
          <template #toolbar="{ table }">
            <DataTableToolbar>
              <template #right>
                <DataTableColumnManager :table="table" />
              </template>
            </DataTableToolbar>
          </template>
        </DataTable>
      </div>

      <CodeBlock :code="advancedHeaderCode" language="typescript" filename="advanced-header.ts" />
    </section>

    <!-- Column Pinning -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Column Pinning</h2>
      <p class="text-muted-foreground">
        Pin columns to the left or right side of the table. Use the column header menu to pin/unpin columns.
        Try scrolling horizontally to see pinned columns stay fixed.
      </p>

      <div class="rounded-lg border">
        <DataTable
          :columns="pinningColumns"
          :data="users"
          enable-column-pinning
          container-class="max-w-full overflow-x-auto"
        >
          <template #toolbar="{ table }">
            <DataTableToolbar>
              <template #left>
                <span class="text-sm text-muted-foreground">
                  Use the dropdown menu on column headers to pin columns
                </span>
              </template>
              <template #right>
                <DataTableColumnManager :table="table" />
              </template>
            </DataTableToolbar>
          </template>
        </DataTable>
      </div>

      <CodeBlock :code="pinningCode" language="typescript" filename="column-pinning.ts" />
    </section>

    <!-- Column Reordering -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Column Reordering</h2>
      <p class="text-muted-foreground">
        Drag and drop column headers to reorder them. Enable with <code class="bg-muted px-1 py-0.5 rounded">enable-reorder</code> prop.
      </p>

      <div class="rounded-lg border">
        <DataTable
          :columns="reorderColumns"
          :data="users"
          enable-reorder
        />
      </div>

      <CodeBlock :code="reorderCode" language="vue" filename="column-reorder.vue" />
    </section>

    <!-- Table with Selection -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Row Selection</h2>
      <p class="text-muted-foreground">
        Table with checkbox selection for rows.
      </p>

      <div class="rounded-lg border">
        <DataTable :columns="selectionColumns" :data="users">
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

    <!-- Server-Side Pagination -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Server-Side Pagination</h2>
      <p class="text-muted-foreground">
        Table with server-side pagination and sorting. Data is fetched from an API endpoint.
        The table emits events when pagination or sorting changes.
      </p>

      <div class="rounded-lg border">
        <DataTable
          :columns="serverColumns"
          :data="serverData"
          :meta="serverMeta"
          :is-loading-data="isServerLoading"
          manual-pagination
          manual-sorting
          @table-change="handleTableChange"
        >
          <template #toolbar>
            <DataTableToolbar>
              <template #left>
                <div class="flex items-center gap-2">
                  <Input
                    v-model="serverSearchTerm"
                    placeholder="Search users..."
                    class="w-64"
                    @keyup.enter="handleServerSearch"
                  />
                  <Button variant="outline" size="sm" @click="handleServerSearch">
                    Search
                  </Button>
                </div>
              </template>
              <template #right>
                <Button
                  variant="outline"
                  size="sm"
                  :disabled="isServerLoading"
                  @click="fetchServerData(serverMeta.current_page, serverMeta.per_page)"
                >
                  <RefreshCw :class="['h-4 w-4 mr-2', { 'animate-spin': isServerLoading }]" />
                  Refresh
                </Button>
              </template>
            </DataTableToolbar>
          </template>
        </DataTable>
      </div>

      <CodeBlock :code="serverSideCode" language="vue" filename="server-side.vue" />
    </section>

    <!-- Editable Cells -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Editable Cells</h2>
      <p class="text-muted-foreground">
        Table with inline editable cells. Double-click or click the edit icon to edit a cell.
        Uses <code class="bg-muted px-1 py-0.5 rounded">maska</code> for input formatting (money, CPF, CNPJ, etc).
      </p>

      <div class="rounded-lg border p-4 bg-muted/30 mb-4">
        <h4 class="font-semibold mb-2">Supported Input Types:</h4>
        <ul class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
          <li><code class="bg-muted px-1 rounded">text</code> - Plain text</li>
          <li><code class="bg-muted px-1 rounded">number</code> - Numeric</li>
          <li><code class="bg-muted px-1 rounded">money:2</code> - Currency (2 decimals)</li>
          <li><code class="bg-muted px-1 rounded">money:4</code> - Currency (4 decimals)</li>
          <li><code class="bg-muted px-1 rounded">cep</code> - Postal code</li>
          <li><code class="bg-muted px-1 rounded">cpf</code> - CPF</li>
          <li><code class="bg-muted px-1 rounded">cnpj</code> - CNPJ</li>
          <li><code class="bg-muted px-1 rounded">cpf_cnpj</code> - Auto-detect</li>
        </ul>
      </div>

      <div class="rounded-lg border">
        <DataTable
          :columns="editableColumns"
          :data="editableProducts"
          without-pagination
          @cell-commit="handleCellCommit"
        />
      </div>

      <CodeBlock :code="editableCellsCode" language="typescript" filename="editable-cells.ts" />
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
          <h3 class="text-lg font-semibold">Default</h3>
          <div class="rounded-lg border">
            <DataTable :columns="basicColumns" :data="users.slice(0, 4)" />
          </div>
        </div>

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

    <!-- Sticky Header -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Sticky Header</h2>
      <p class="text-muted-foreground">
        Keep the header fixed while scrolling the table body. Enable with <code class="bg-muted px-1 py-0.5 rounded">pin-header</code> prop.
      </p>

      <div class="rounded-lg border">
        <DataTable
          :columns="basicColumns"
          :data="users"
          pin-header
          container-class="max-h-[300px] overflow-auto"
          without-pagination
        />
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

    <!-- Dependencies -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Dependencies</h2>
      <p class="text-muted-foreground">
        The DataTable component requires the following dependencies to work properly.
      </p>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-lg border p-4">
          <h3 class="font-semibold mb-3">NPM Packages</h3>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <Badge variant="outline">@tanstack/vue-table</Badge>
              <span class="text-muted-foreground">Table core functionality</span>
            </li>
            <li class="flex items-center gap-2">
              <Badge variant="outline">maska</Badge>
              <span class="text-muted-foreground">Input masking for editable cells</span>
            </li>
            <li class="flex items-center gap-2">
              <Badge variant="outline">vue-sonner</Badge>
              <span class="text-muted-foreground">Toast notifications</span>
            </li>
          </ul>
        </div>

        <div class="rounded-lg border p-4">
          <h3 class="font-semibold mb-3">shadcn-vue Components</h3>
          <div class="flex flex-wrap gap-2">
            <Badge variant="secondary">table</Badge>
            <Badge variant="secondary">button</Badge>
            <Badge variant="secondary">select</Badge>
            <Badge variant="secondary">skeleton</Badge>
            <Badge variant="secondary">dropdown-menu</Badge>
            <Badge variant="secondary">badge</Badge>
            <Badge variant="secondary">checkbox</Badge>
            <Badge variant="secondary">input</Badge>
            <Badge variant="secondary">tooltip</Badge>
            <Badge variant="secondary">spinner</Badge>
          </div>
        </div>
      </div>

      <CodeBlock :code="dependenciesCode" language="typescript" filename="dependencies.ts" />
    </section>
  </div>
</template>
