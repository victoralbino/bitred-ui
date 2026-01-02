<script setup lang="ts" generic="TData">
import { onMounted } from 'vue';
import type { DataTableProps, DataTableEmits } from './types';
import { useDataTableState } from './useDataTableState';
import { DataTableHeader, DataTableBody, PaginationClient, PaginationServer } from './index';

const emit = defineEmits<DataTableEmits<TData>>();

const props = withDefaults(defineProps<DataTableProps<TData>>(), {
    isLoadingData: false,
    isFetchingData: false,
    manualPagination: false,
    manualSorting: false,
    withoutPagination: false,
    pagination: () => ({ pageIndex: 0, pageSize: 10 }),
    totalCount: 0,
    enableRowClick: false,
    variant: 'default',
    containerClass: '',
    textWrap: false,
    pinHeader: false,
    enableRowPinning: false,
    enableColumnPinning: false,
    enableReorder: false,
});

const { table, metaData, handlePaginationChange } = useDataTableState(props, emit);

onMounted(() => props.onTableReady?.(table));

function onRowClick(e: TData) {
    if (props.enableRowClick) {
        emit('row-click', e);
    }
}

defineOptions({
    inheritAttrs: false,
});
</script>

<template>
    <slot name="toolbar" :table="table" :is-fetching="isFetchingData" />
    <div :class="['data-table-wrapper', `data-table-${variant}`]">
        <div data-slot="table-container" :class="['data-table-container border', containerClass]">
            <table data-slot="table" :class="['w-full caption-bottom text-sm', { 'cell-text-wrap': textWrap }]">
                <DataTableHeader :table="table" :pin-header="pinHeader" :enable-reorder="enableReorder" />
                <DataTableBody
                    :table="table"
                    :columns="columns"
                    :enable-row-click="enableRowClick"
                    :row-class-name="rowClassName"
                    :is-loading="isLoadingData"
                    @row-click="onRowClick"
                />
            </table>
        </div>

        <template v-if="!withoutPagination">
            <PaginationServer
                v-if="manualPagination"
                :meta="metaData"
                :is-loading-data="isLoadingData"
                @pagination-change="handlePaginationChange"
            />
            <PaginationClient v-else :table="table" :is-loading-data="isLoadingData" />
        </template>
    </div>
</template>
