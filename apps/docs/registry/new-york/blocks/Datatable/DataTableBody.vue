<script setup lang="ts" generic="TData">
import { computed } from 'vue';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { type ColumnDef, FlexRender, type Table, type Row, type Cell } from '@tanstack/vue-table';
import DataTablePinnedRow from './DataTablePinnedRow.vue';
import DataTableEmpty from './DataTableEmpty.vue';
import DataTableSkeleton from './DataTableSkeleton.vue';
import { cn } from '@/lib/utils.ts';
import { useColumnPinning } from './useColumnPinning';
import type { DataTableMeta, ExtendedColumnMeta } from './types';

const props = defineProps<{
    table: Table<TData>;
    columns: ColumnDef<TData, unknown>[];
    enableRowClick?: boolean;
    rowClassName?: (row: TData) => string;
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'row-click', row: TData): void;
}>();

const { getCellPinnedStyle } = useColumnPinning(props.table);

const tableMeta = computed(() => props.table.options.meta as DataTableMeta<TData> | undefined);

const isCellEditable = (cell: Cell<TData, unknown>): boolean => {
    const meta = cell.column.columnDef.meta as ExtendedColumnMeta<TData> | undefined;
    return meta?.cell?.editable === true;
};

const handleCellClick = (event: MouseEvent, row: Row<TData>): void => {
    const target = event.currentTarget as HTMLElement | null;

    // garante foco na célula clicada
    target?.focus();

    // se linha é clicável, disparamos o row-click a partir da célula
    if (props.enableRowClick) {
        emit('row-click', row.original);
    }

    // evita que o clique suba pra <TableRow> (se ainda tiver @click lá)
    event.stopPropagation();
};

const handleCellKeydown = (event: KeyboardEvent, row: Row<TData>, cell: Cell<TData, unknown>): void => {
    const { key } = event;

    // ENTER: abre edição se editável, senão row-click
    if (key === 'Enter') {
        if (isCellEditable(cell) && tableMeta.value?.setEditingCell) {
            event.preventDefault();
            tableMeta.value.setEditingCell({
                rowId: row.id,
                columnId: cell.column.id,
            });
            return;
        }

        if (props.enableRowClick) {
            event.preventDefault();
            emit('row-click', row.original);
            return;
        }
    }

    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
        return;
    }

    event.preventDefault();

    const rowIndex = row.index;
    const colIndex = cell.column.getIndex();

    const allRows = props.table.getRowModel().rows;
    const visibleLeafColumns = props.table.getVisibleLeafColumns();

    const rowCount = allRows.length;
    const colCount = visibleLeafColumns.length;

    let targetRowIndex = rowIndex;
    let targetColIndex = colIndex;

    switch (key) {
        case 'ArrowUp':
            targetRowIndex = Math.max(0, rowIndex - 1);
            break;
        case 'ArrowDown':
            targetRowIndex = Math.min(rowCount - 1, rowIndex + 1);
            break;
        case 'ArrowLeft':
            targetColIndex = Math.max(0, colIndex - 1);
            break;
        case 'ArrowRight':
            targetColIndex = Math.min(colCount - 1, colIndex + 1);
            break;
        case 'Home':
            targetColIndex = 0;
            break;
        case 'End':
            targetColIndex = colCount - 1;
            break;
    }

    const selector = `.data-table-row[data-row-index="${targetRowIndex}"] .data-table-cell[data-col-index="${targetColIndex}"]`;
    const next = document.querySelector<HTMLElement>(selector);

    next?.focus();
};
</script>

<template>
    <TableBody class="data-table-body">
        <!-- Linhas fixadas no topo -->
        <template v-for="row in table.getTopRows()" :key="row.id">
            <DataTablePinnedRow
                :row="row"
                :table="table"
                class="data-table-row-pinned-top"
                :row-class-name="rowClassName"
                :enable-row-click="enableRowClick"
                @row-click="emit('row-click', $event)"
            />
        </template>

        <!-- Linhas centrais -->
        <template v-if="table.getCenterRows().length">
            <TableRow
                v-for="row in table.getCenterRows()"
                :key="row.id"
                :data-row-id="row.id"
                :data-row-index="row.index"
                :data-state="row.getIsSelected() ? 'selected' : undefined"
                :class="[
                    'data-table-row',
                    { 'data-table-row-selected': row.getIsSelected() },
                    { 'cursor-pointer': enableRowClick },
                    rowClassName ? rowClassName(row.original) : '',
                ]"
                @click="emit('row-click', row.original)"
            >
                <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                    :data-col-id="cell.column.id"
                    :data-col-index="cell.column.getIndex()"
                    :tabindex="0"
                    :class="
                        cn('data-table-cell', [
                            cell.column.getIsPinned() ? `data-table-cell-pinned-${cell.column.getIsPinned()}` : '',
                        ])
                    "
                    :style="getCellPinnedStyle(cell)"
                    @click="handleCellClick($event, row)"
                    @keydown="handleCellKeydown($event, row, cell)"
                >
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
            </TableRow>
        </template>

        <!-- Linhas fixadas no rodapé -->
        <template v-for="row in table.getBottomRows()" :key="row.id">
            <DataTablePinnedRow
                :row="row"
                :table="table"
                class="data-table-row-pinned-bottom"
                :row-class-name="rowClassName"
                :enable-row-click="enableRowClick"
                @row-click="emit('row-click', $event)"
            />
        </template>

        <!-- Skeleton durante loading -->
        <DataTableSkeleton v-if="isLoading" :columns="columns.length" :rows="5" />

        <!-- Empty state quando não há dados e não está loading -->
        <DataTableEmpty v-else-if="!table.getRowModel().rows?.length" :colspan="columns.length" />
    </TableBody>
</template>
