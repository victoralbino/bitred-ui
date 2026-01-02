import { ref } from 'vue';
import type { Table, ColumnPinningPosition, Column } from '@tanstack/vue-table';
import { toast } from 'vue-sonner';
import type { ExtendedColumnMeta } from './types';

export function useColumnReorder<TData>(table: Table<TData>) {
    const draggedColumnId = ref<string | null>(null);
    const dragOverColumnId = ref<string | null>(null);
    const lastAppliedOrder = ref<string>('');

    let dragPreviewEl: HTMLDivElement | null = null;

    const createDragPreview = (label: string): HTMLDivElement => {
        if (dragPreviewEl) {
            dragPreviewEl.remove();
            dragPreviewEl = null;
        }

        const el = document.createElement('div');
        el.className = 'data-table-drag-preview';
        el.setAttribute('data-pin', 'center');

        const iconSpan = document.createElement('span');
        iconSpan.className = 'data-table-drag-preview-icon';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'data-table-drag-preview-label';
        labelSpan.textContent = label;

        el.appendChild(iconSpan);
        el.appendChild(labelSpan);

        document.body.appendChild(el);
        dragPreviewEl = el;

        return el;
    };

    const updateDragPreviewPin = (pinState: ColumnPinningPosition | false): void => {
        if (!dragPreviewEl) return;

        const pin = pinState === 'left' ? 'left' : pinState === 'right' ? 'right' : 'center';
        dragPreviewEl.setAttribute('data-pin', pin);
    };

    const destroyDragPreview = (): void => {
        if (dragPreviewEl) {
            dragPreviewEl.remove();
            dragPreviewEl = null;
        }
    };

    const getColumnMeta = (column: Column<TData, unknown> | undefined): ExtendedColumnMeta<TData> | undefined => {
        if (!column || !column.columnDef.meta) return undefined;
        return column.columnDef.meta as ExtendedColumnMeta<TData>;
    };

    const handleDragStart = (event: DragEvent, columnId: string, label?: string): void => {
        draggedColumnId.value = columnId;
        lastAppliedOrder.value = '';

        const allColumns = table.getAllLeafColumns();
        const column = allColumns.find((col) => col.id === columnId);

        const meta = getColumnMeta(column);
        const headerLabel = label ?? meta?.columnName ?? (column ? String(column.id) : 'Coluna');

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', columnId);

            const previewEl = createDragPreview(headerLabel);
            const rect = previewEl.getBoundingClientRect();
            event.dataTransfer.setDragImage(previewEl, rect.width / 2, rect.height / 2);
        }
    };

    const handleDragOver = (
        event: DragEvent,
        columnId: string,
        targetPinState: ColumnPinningPosition | false
    ): void => {
        event.preventDefault();

        if (!draggedColumnId.value || draggedColumnId.value === columnId) {
            return;
        }

        updateDragPreviewPin(targetPinState);

        if (dragOverColumnId.value === columnId) {
            return;
        }

        dragOverColumnId.value = columnId;

        const allColumns = table.getAllLeafColumns();
        const draggedColumn = allColumns.find((col) => col.id === draggedColumnId.value);
        const targetColumn = allColumns.find((col) => col.id === columnId);

        if (!draggedColumn || !targetColumn) return;

        let pinnedLeft = allColumns.filter((col) => col.getIsPinned() === 'left').map((col) => col.id);
        let unpinned = allColumns.filter((col) => !col.getIsPinned()).map((col) => col.id);
        let pinnedRight = allColumns.filter((col) => col.getIsPinned() === 'right').map((col) => col.id);

        const draggedCurrentPin = draggedColumn.getIsPinned();

        if (draggedCurrentPin === 'left') {
            pinnedLeft = pinnedLeft.filter((id) => id !== draggedColumnId.value);
        } else if (draggedCurrentPin === 'right') {
            pinnedRight = pinnedRight.filter((id) => id !== draggedColumnId.value);
        } else {
            unpinned = unpinned.filter((id) => id !== draggedColumnId.value);
        }

        if (targetPinState === 'left') {
            const targetIndex = pinnedLeft.indexOf(columnId);
            if (targetIndex !== -1) {
                pinnedLeft.splice(targetIndex, 0, draggedColumnId.value);
            } else {
                pinnedLeft.push(draggedColumnId.value);
            }
        } else if (targetPinState === 'right') {
            const targetIndex = pinnedRight.indexOf(columnId);
            if (targetIndex !== -1) {
                pinnedRight.splice(targetIndex, 0, draggedColumnId.value);
            } else {
                pinnedRight.push(draggedColumnId.value);
            }
        } else {
            const targetIndex = unpinned.indexOf(columnId);
            if (targetIndex !== -1) {
                unpinned.splice(targetIndex, 0, draggedColumnId.value);
            } else {
                unpinned.push(draggedColumnId.value);
            }
        }

        const finalOrder = [...pinnedLeft, ...unpinned, ...pinnedRight];
        const orderKey = finalOrder.join(',');

        if (orderKey === lastAppliedOrder.value) {
            return;
        }

        lastAppliedOrder.value = orderKey;

        table.setColumnPinning({
            left: pinnedLeft,
            right: pinnedRight,
        });

        table.setColumnOrder(finalOrder);
    };

    const handleDrop = (event: DragEvent): void => {
        event.preventDefault();

        if (draggedColumnId.value) {
            toast.success('Coluna reordenada');
        }

        reset();
    };

    const handleDragEnd = (): void => {
        reset();
    };

    const reset = (): void => {
        draggedColumnId.value = null;
        dragOverColumnId.value = null;
        lastAppliedOrder.value = '';
        destroyDragPreview();
    };

    return {
        draggedColumnId,
        dragOverColumnId,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    };
}
