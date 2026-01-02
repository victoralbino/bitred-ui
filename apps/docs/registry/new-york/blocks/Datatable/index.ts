import type { ExtendedColumnMeta, PaginationParams, TableChangeData } from './types';
import type { ColumnDef } from '@tanstack/vue-table';

export { default as DataTable } from './DataTable.vue';
export { default as DataTableToolbar } from './DataTableToolbar.vue';
export { default as DataTableColumnManager } from './DataTableColumnManager.vue';
export { default as DataTablePinnedRow } from './DataTablePinnedRow.vue';
export { default as PaginationClient } from './PaginationClient.vue';
export { default as PaginationServer } from './PaginationServer.vue';

export { default as DataTableHeader } from './DataTableHeader.vue';
export { default as DataTableBody } from './DataTableBody.vue';
export { default as DataTableEmpty } from './DataTableEmpty.vue';

/**
 * Função auxiliar para converter estado da tabela em query params
 */
export function buildTableQueryParams(e: TableChangeData): PaginationParams {
    const params: PaginationParams = {};

    // Paginação
    if (e.pagination) {
        params.page = e.pagination.pageIndex + 1;
        params.per_page = e.pagination.pageSize;
    }

    // Ordenação
    if (e.sorting && e.sorting.length > 0) {
        const sortItem = e.sorting[0];
        const sortDirection = sortItem?.desc ? 'desc' : 'asc';
        params.sort = `${sortItem?.id}:${sortDirection}`;
    }

    return params;
}

/**
 * Helper para criar meta de coluna com type-safety
 */
export function createColumnMeta<TData = unknown>(meta: ExtendedColumnMeta<TData>): ExtendedColumnMeta<TData> {
    return meta;
}

/**
 * Helper para criar definição de coluna com meta tipada
 */
export function createColumn<TData = unknown>(column: ColumnDef<TData>): ColumnDef<TData> {
    return column;
}
