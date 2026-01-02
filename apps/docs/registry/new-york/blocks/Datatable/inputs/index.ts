import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import EditableCell from './EditableCell.vue';

export { default as EditableCell } from './EditableCell.vue';

interface EditableCellOptions {
    type?: 'text' | 'number' | 'email' | 'tel' | 'url';
    placeholder?: string;
}

/**
 * Helper para criar uma célula editável
 *
 * @example
 * {
 *   accessorKey: 'precoVenda',
 *   header: 'Preço',
 *   cell: editableCell<CotacaoItem>({ type: 'number' }),
 *   meta: createColumnMeta({
 *     columnName: 'Preço',
 *     cell: { editable: true, inputType: 'number' }
 *   }),
 * }
 */
export function editableCell<TData>(options: EditableCellOptions = {}): ColumnDef<TData, unknown>['cell'] {
    return (props) => {
        return h(EditableCell<TData>, {
            cell: props.cell,
            ...options,
        });
    };
}
