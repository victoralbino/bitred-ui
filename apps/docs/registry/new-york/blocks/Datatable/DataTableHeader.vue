<script setup lang="ts" generic="TData">
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import type { Header, Table } from '@tanstack/vue-table';
import { useColumnPinning } from './useColumnPinning';
import { useColumnReorder } from './useColumnReorder';
import { FlexRender } from '@tanstack/vue-table';
import { GripVertical } from 'lucide-vue-next';
import { computed } from 'vue';
import type { ExtendedColumnMeta } from './types';

const props = defineProps<{
    table: Table<TData>;
    pinHeader?: boolean;
    enableReorder?: boolean;
}>();

const { getHeaderPinnedStyle } = useColumnPinning(props.table);
const { draggedColumnId, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useColumnReorder(props.table);

const headerGroups = computed(() => props.table.getHeaderGroups());

const isDragging = (columnId: string): boolean => draggedColumnId.value === columnId;

const getHeaderLabel = (header: Header<TData, unknown>): string => {
    const meta = header.column.columnDef.meta as ExtendedColumnMeta<TData> | undefined;
    return meta?.columnName ?? String(header.column.id);
};
</script>

<template>
    <TableHeader
        :style="table.getTopRows().length || pinHeader ? { position: 'sticky', top: 0, zIndex: 10 } : undefined"
    >
        <TableRow v-for="headerGroup in headerGroups" :key="headerGroup.id" class="data-table-header">
            <TableHead
                v-for="header in headerGroup.headers"
                :key="header.id"
                :data-column-id="header.column.id"
                :draggable="enableReorder"
                :class="[
                    'data-table-header-cell',
                    header.column.getIsPinned() ? `data-table-cell-pinned-${header.column.getIsPinned()}` : '',
                    {
                        'draggable-header': enableReorder,
                        'is-dragging': isDragging(header.column.id),
                    },
                ]"
                :style="getHeaderPinnedStyle(header)"
                @dragstart="
                    (e: DragEvent) => enableReorder && handleDragStart(e, header.column.id, getHeaderLabel(header))
                "
                @dragover="
                    (e: DragEvent) => enableReorder && handleDragOver(e, header.column.id, header.column.getIsPinned())
                "
                @drop="(e: DragEvent) => enableReorder && handleDrop(e)"
                @dragend="enableReorder && handleDragEnd()"
            >
                <div class="flex items-center gap-2">
                    <div v-if="enableReorder" class="drag-handle">
                        <GripVertical class="h-4 w-4 text-muted-foreground" />
                    </div>
                    <FlexRender
                        v-if="!header.isPlaceholder"
                        :render="header.column.columnDef.header"
                        :props="header.getContext()"
                    />
                </div>
            </TableHead>
        </TableRow>
    </TableHeader>
</template>

<style scoped>
.drag-handle {
    display: flex;
    align-items: center;
    cursor: grab;
    opacity: 0.4;
    transition: opacity 0.2s ease;
    padding: 4px;
    margin: -4px;
}

.draggable-header:hover .drag-handle {
    opacity: 1;
}

.drag-handle:active {
    cursor: grabbing;
}

.draggable-header {
    cursor: move;
    position: relative;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.is-dragging {
    opacity: 0.5;
    cursor: grabbing !important;
    z-index: 1000;
}

.draggable-header:hover {
    background: var(--accent);
    transition: background-color 0.15s ease;
}

/* Indicador visual para áreas pinadas */
.data-table-cell-pinned-left.draggable-header:hover {
    background: linear-gradient(to right, var(--primary) 2px, var(--accent) 2px);
}

.data-table-cell-pinned-right.draggable-header:hover {
    background: linear-gradient(to left, var(--primary) 2px, var(--accent) 2px);
}
</style>
