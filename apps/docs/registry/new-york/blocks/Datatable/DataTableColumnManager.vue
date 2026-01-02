<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
    ColumnManagerTrigger,
    ColumnManagerHeader,
    ColumnManagerSearch,
    ColumnManagerActions,
    ColumnManagerItem,
    ColumnManagerEmpty,
    useColumnManager,
} from './column-manager';

interface DataTableColumnManagerProps {
    table: Table<TData>;
}

const props = defineProps<DataTableColumnManagerProps>();

const {
    searchQuery,
    isCompactView,
    filteredColumns,
    visibleColumnsCount,
    hiddenColumnsCount,
    pinnedColumnsCount,
    hasActionsAvailable,
    columns,
    showAllColumns,
    hideAllColumns,
    unpinAllColumns,
    resetToDefault,
    toggleColumnVisibility,
    togglePinLeft,
    togglePinRight,
    clearSearch,
    toggleCompactView,
} = useColumnManager(props.table);
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <ColumnManagerTrigger :pinned-count="pinnedColumnsCount" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
            align="end"
            :class="cn('max-h-[500px] overflow-y-auto', isCompactView ? 'w-[260px]' : 'w-[320px]')"
        >
            <!-- Header -->
            <ColumnManagerHeader
                :visible-count="visibleColumnsCount"
                :total-count="columns.length"
                :is-compact="isCompactView"
                @toggle-compact="toggleCompactView"
            />

            <DropdownMenuSeparator />

            <!-- Campo de Busca -->
            <ColumnManagerSearch v-model="searchQuery" @clear="clearSearch" />

            <!-- Ações em Massa -->
            <template v-if="hasActionsAvailable">
                <DropdownMenuSeparator />

                <ColumnManagerActions
                    :has-actions="hasActionsAvailable"
                    :hidden-count="hiddenColumnsCount"
                    :visible-count="visibleColumnsCount"
                    :pinned-count="pinnedColumnsCount"
                    @show-all="showAllColumns"
                    @hide-all="hideAllColumns"
                    @unpin-all="unpinAllColumns"
                    @reset="resetToDefault"
                />
            </template>

            <DropdownMenuSeparator />

            <!-- Lista de Colunas -->
            <ColumnManagerEmpty v-if="filteredColumns.length === 0" />

            <DropdownMenuGroup v-else>
                <ColumnManagerItem
                    v-for="column in filteredColumns"
                    :key="column.id"
                    :column="column"
                    :is-compact="isCompactView"
                    @toggle-visibility="toggleColumnVisibility"
                    @toggle-pin-left="togglePinLeft"
                    @toggle-pin-right="togglePinRight"
                />
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
