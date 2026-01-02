import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import type { Table, Column, Header, Cell } from '@tanstack/vue-table';

type ColumnLike<TData> = Column<TData, unknown> | Header<TData, unknown> | Cell<TData, unknown>;

export function useColumnPinning<TData>(table: Table<TData>) {
    const columnWidths = ref<Record<string, number>>({});
    const isCalculating = ref(false);

    const calculateColumnWidths = () => {
        if (isCalculating.value) return; // Evitar cálculos concorrentes

        isCalculating.value = true;

        const tableElement = document.querySelector('.data-table-container table');
        if (!tableElement) {
            isCalculating.value = false;
            return;
        }

        const headerCells = tableElement.querySelectorAll('thead th');
        const widths: Record<string, number> = {};

        headerCells.forEach((cell) => {
            const columnId = cell.getAttribute('data-column-id');
            if (columnId) {
                widths[columnId] = cell.getBoundingClientRect().width;
            }
        });

        columnWidths.value = widths;
        isCalculating.value = false;
    };

    const getPinnedStyle = (columnOrCell: ColumnLike<TData>, isHeader = false) => {
        const column = 'column' in columnOrCell ? columnOrCell.column : columnOrCell;
        const isPinned = column.getIsPinned?.();

        const baseSize =
            'getSize' in columnOrCell && typeof columnOrCell.getSize === 'function'
                ? columnOrCell.getSize()
                : column.getSize();

        const style: Record<string, string | number> = {
            width: `${baseSize}px`,
        };

        if (!isPinned) {
            return style;
        }

        // Usar largura calculada ou fallback
        const columnWidth = columnWidths.value[column.id] || baseSize;

        style.position = 'sticky';
        style.zIndex = isHeader ? 15 : 5;
        style.minWidth = `${columnWidth}px`;
        style.maxWidth = `${columnWidth}px`;
        style.width = `${columnWidth}px`;

        if (isPinned === 'left') {
            const leftColumns = table.getLeftLeafColumns();
            let leftPosition = 0;

            for (const col of leftColumns) {
                if (col.id === column.id) break;
                leftPosition += columnWidths.value[col.id] || col.getSize();
            }

            style.left = `${leftPosition}px`;
        } else if (isPinned === 'right') {
            const rightColumns = table.getRightLeafColumns();
            let rightPosition = 0;

            let found = false;
            for (const col of rightColumns) {
                if (col.id === column.id) {
                    found = true;
                    continue;
                }
                if (found) {
                    rightPosition += columnWidths.value[col.id] || col.getSize();
                }
            }

            style.right = `${rightPosition}px`;
        }

        return style;
    };

    const getHeaderPinnedStyle = (header: Header<TData, unknown>) => {
        const style = getPinnedStyle(header, true);

        if (header.column.columnDef.maxSize) {
            style.maxWidth = `${header.column.columnDef.maxSize}px`;
        }

        return style;
    };

    const getCellPinnedStyle = (cell: Cell<TData, unknown>) => {
        return getPinnedStyle(cell, false);
    };

    // Debounce para resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateColumnWidths();
        }, 150);
    };

    onMounted(() => {
        nextTick(() => {
            calculateColumnWidths();
            window.addEventListener('resize', handleResize);
        });
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimeout);
    });

    return {
        columnWidths,
        calculateColumnWidths,
        getHeaderPinnedStyle,
        getCellPinnedStyle,
    };
}
