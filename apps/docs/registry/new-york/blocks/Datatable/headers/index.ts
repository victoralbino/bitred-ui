import type { ColumnDef, Table, Row } from '@tanstack/vue-table';
import SelectCheckbox from './SelectCheckbox.vue';
import { h, type DefineComponent } from 'vue';

export { default as DataTableSortableHeader } from './DataTableSortableHeader.vue';
export { default as DataTableAdvancedHeader } from './DataTableAdvancedHeader.vue';
export { default as SelectCheckbox } from './SelectCheckbox.vue';

export type SelectCheckboxProps<TData> = {
    type: 'header' | 'cell';
    table?: Table<TData>;
    row?: Row<TData>;
};

export function createSelectColumn<TData>(): ColumnDef<TData> {
    const SelectCheckboxTyped = SelectCheckbox as unknown as DefineComponent<SelectCheckboxProps<TData>>;
    return {
        id: 'select',
        header: ({ table }) =>
            h(SelectCheckboxTyped, {
                type: 'header',
                table,
            }),
        cell: ({ row }) =>
            h(SelectCheckboxTyped, {
                type: 'cell',
                row,
            }),
        enableSorting: false,
        enableHiding: false,
        size: 40,
        minSize: 40,
        maxSize: 40,
    };
}
