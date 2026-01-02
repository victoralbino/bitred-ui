import { computed, ref } from 'vue';
import type { Table, Column } from '@tanstack/vue-table';
import { toast } from 'vue-sonner';
import type { ExtendedColumnMeta } from '../types';

export function useColumnManager<TData>(table: Table<TData>) {
    const searchQuery = ref('');
    const isCompactView = ref(true);

    // Colunas disponíveis
    const columns = computed(() =>
        table.getAllColumns().filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
    );

    // Colunas filtradas pela busca
    const filteredColumns = computed(() =>
        columns.value.filter((column) => {
            const meta = column.columnDef.meta as ExtendedColumnMeta<TData> | undefined;
            const name = (meta?.columnName ?? column.id).toString();
            return name.toLowerCase().includes(searchQuery.value.toLowerCase());
        })
    );

    // Contadores
    const visibleColumnsCount = computed(() => columns.value.filter((col) => col.getIsVisible()).length);
    const hiddenColumnsCount = computed(() => columns.value.length - visibleColumnsCount.value);
    const pinnedColumnsCount = computed(() => columns.value.filter((col) => col.getIsPinned()).length);

    // Verifica se há ações disponíveis
    const hasActionsAvailable = computed(
        () => hiddenColumnsCount.value > 0 || visibleColumnsCount.value > 1 || pinnedColumnsCount.value > 0
    );

    // Ações em massa
    const showAllColumns = () => {
        columns.value.forEach((column) => {
            column.toggleVisibility(true);
        });
        toast.success('Colunas exibidas');
    };

    const hideAllColumns = () => {
        // Mantém pelo menos a primeira coluna visível
        columns.value.forEach((column, index) => {
            column.toggleVisibility(index === 0);
        });
        toast.success('Colunas ocultadas');
    };

    const unpinAllColumns = () => {
        columns.value.forEach((column) => {
            if (column.getIsPinned()) {
                column.pin(false);
            }
        });
        toast.success('Pins removidos');
    };

    const resetToDefault = () => {
        columns.value.forEach((column) => {
            column.toggleVisibility(true);
            column.pin(false);
        });
        toast.success('Configurações resetadas');
    };

    // Ações individuais
    const toggleColumnVisibility = (column: Column<TData>) => {
        const wasVisible = column.getIsVisible();
        column.toggleVisibility(!wasVisible);
        toast.success(wasVisible ? 'Coluna ocultada' : 'Coluna revelada');
    };

    const togglePinLeft = (column: Column<TData>) => {
        const currentPin = column.getIsPinned();
        column.pin(currentPin === 'left' ? false : 'left');
        toast.success(currentPin === 'left' ? 'Pin removido' : 'Fixada à esquerda');
    };

    const togglePinRight = (column: Column<TData>) => {
        const currentPin = column.getIsPinned();
        column.pin(currentPin === 'right' ? false : 'right');
        toast.success(currentPin === 'right' ? 'Pin removido' : 'Fixada à direita');
    };

    const getColumnPinState = (column: Column<TData>) => {
        return column.getIsPinned();
    };

    // Utilitários
    const clearSearch = () => {
        searchQuery.value = '';
    };

    const toggleCompactView = () => {
        isCompactView.value = !isCompactView.value;
    };

    return {
        // State
        searchQuery,
        isCompactView,

        // Computed
        columns,
        filteredColumns,
        visibleColumnsCount,
        hiddenColumnsCount,
        pinnedColumnsCount,
        hasActionsAvailable,

        // Actions
        showAllColumns,
        hideAllColumns,
        unpinAllColumns,
        resetToDefault,
        toggleColumnVisibility,
        togglePinLeft,
        togglePinRight,
        getColumnPinState,
        clearSearch,
        toggleCompactView,
    };
}
