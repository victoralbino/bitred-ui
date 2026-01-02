import {
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
    type SortingState,
    type VisibilityState,
    type PaginationState,
    type RowSelectionState,
    type RowPinningState,
    type ColumnPinningState,
    type ColumnOrderState,
    type Updater,
} from '@tanstack/vue-table';
import { ref, computed } from 'vue';
import { valueUpdater } from '@/lib/utils';
import type { DataTableProps, PaginationMeta, DataTableEmits, DataTableMeta } from './types';

export function useDataTableState<TData>(props: DataTableProps<TData>, emit: DataTableEmits<TData>) {
    const initialPagination: PaginationState = props.pagination ?? {
        pageIndex: 0,
        pageSize: 10,
    };

    const sorting = ref<SortingState>([]);
    const columnVisibility = ref<VisibilityState>({});
    const columnOrder = ref<ColumnOrderState>([]);
    const columnPinning = ref<ColumnPinningState>({ left: [], right: [] });
    const rowSelection = ref<RowSelectionState>({});
    const expanded = ref<Record<string, boolean>>({});
    const pagination = ref<PaginationState>(initialPagination);
    const rowPinning = ref<RowPinningState>({ top: [], bottom: [] });

    const editingCell = ref<{ rowId: string; columnId: string } | null>(null);

    const setEditingCell = (cell: { rowId: string; columnId: string } | null) => {
        editingCell.value = cell;
    };

    const handleCellCommit = (payload: { row: TData; columnId: string; value: unknown }) => {
        const rowData = payload.row as Record<string, unknown>;
        rowData[payload.columnId] = payload.value;

        emit('cell-commit', payload);
    };

    const metaData = computed<PaginationMeta>(() => props.meta ?? ({} as PaginationMeta));

    const tableMeta = computed<DataTableMeta<TData>>(() => ({
        editingCell: editingCell.value,
        setEditingCell,
        onCellCommit: handleCellCommit,
    }));

    const table = useVueTable({
        get data() {
            return props.data;
        },
        get columns() {
            return props.columns;
        },
        get meta() {
            return tableMeta.value;
        },
        getCoreRowModel: getCoreRowModel(),
        manualSorting: props.manualSorting,
        ...(props.manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),

        getExpandedRowModel: getExpandedRowModel(),
        enableRowPinning: props.enableRowPinning,
        enablePinning: props.enableColumnPinning,
        ...(props.withoutPagination
            ? {}
            : props.manualPagination
              ? {
                    manualPagination: true,
                    pageCount: metaData.value?.last_page || -1,
                }
              : {
                    getPaginationRowModel: getPaginationRowModel(),
                }),
        state: {
            get sorting() {
                return sorting.value;
            },
            get columnVisibility() {
                return columnVisibility.value;
            },
            get rowSelection() {
                return rowSelection.value;
            },
            get expanded() {
                return expanded.value;
            },
            get pagination() {
                return pagination.value;
            },
            get rowPinning() {
                return rowPinning.value;
            },
            get columnPinning() {
                return columnPinning.value;
            },
            get columnOrder() {
                return columnOrder.value;
            },
        },
        onSortingChange: (updater: Updater<SortingState>) => {
            valueUpdater(updater, sorting);
            emit('sorting-change', updater);
            emit('table-change', {
                sorting: sorting.value,
                visibility: columnVisibility.value,
                pagination: pagination.value,
            });
        },
        onColumnVisibilityChange: (updater: Updater<VisibilityState>) => {
            valueUpdater(updater, columnVisibility);
            emit('visibility-change', columnVisibility.value);
            emit('table-change', {
                sorting: sorting.value,
                visibility: columnVisibility.value,
                pagination: pagination.value,
            });
        },
        onRowSelectionChange: (updaterOrValue: Updater<RowSelectionState>) =>
            valueUpdater(updaterOrValue, rowSelection),
        onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
        onPaginationChange: props.withoutPagination
            ? undefined
            : (updater: Updater<PaginationState>) => {
                  valueUpdater(updater, pagination);
                  handlePaginationChange(pagination.value);
              },
        onRowPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowPinning),
        onColumnPinningChange: (updater) => valueUpdater(updater, columnPinning),
        onColumnOrderChange: (updater) => valueUpdater(updater, columnOrder),
    });

    const handlePaginationChange = (v: PaginationState) => {
        emit('pagination-change', v);
        emit('table-change', {
            sorting: sorting.value,
            visibility: columnVisibility.value,
            pagination: v,
        });
    };

    return { table, metaData, handlePaginationChange };
}
