import type {
    Table,
    SortingState,
    VisibilityState,
    PaginationState,
    ColumnDef,
    ColumnMeta,
    Updater,
} from '@tanstack/vue-table';

/**
 * Dados de paginação retornados pelo backend
 */
export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

/**
 * Dados de mudança emitidos pelos eventos da tabela
 */
export interface TableChangeData {
    sorting: SortingState;
    visibility: VisibilityState;
    pagination: PaginationState;
}

/**
 * Opção utilizada em filtros com múltiplas seleções
 */
export interface DataTableFacetedOption {
    label: string;
    value: string;
    icon?: unknown;
}

/**
 * Propriedades aceitas pelo componente DataTable
 */
export interface DataTableProps<TData> {
    /** Estado inicial da tabela */
    initialState?: Partial<TableState>;

    /** Colunas da tabela */
    columns: ColumnDef<TData, unknown>[];

    /** Dados a serem exibidos */
    data: TData[];

    /** Metadados de paginação (quando manualPagination = true) */
    meta?: PaginationMeta;

    /** Define se a ordenação será no servidor ou no cliente */
    manualSorting?: boolean;

    /** Estado de carregamento (primeiro carregamento) */
    isLoadingData?: boolean;

    /** Estado de refetch em background */
    isFetchingData?: boolean;

    /** Remove a paginação */
    withoutPagination?: boolean;

    /** Ativa paginação manual (servidor) */
    manualPagination?: boolean;

    /** Estado atual de paginação */
    pagination?: PaginationState;

    /** Total de registros (opcional, usado com paginação manual) */
    totalCount?: number;

    /** Classe CSS condicional por linha */
    rowClassName?: (row: TData) => string;

    /** Habilita clique na linha */
    enableRowClick?: boolean;

    /** Variante visual da tabela */
    variant?: 'default' | 'striped' | 'bordered' | 'minimal';

    /** Classe(s) extras no container */
    containerClass?: string | string[];

    /** Mantém o cabeçalho fixo (sticky) */
    pinHeader?: boolean;

    /** Permite fixar linhas no topo/base */
    enableRowPinning?: boolean;

    /** Permite fixar colunas na esquerda/direita */
    enableColumnPinning?: boolean;

    /** Permite reordenar colunas */
    enableReorder?: boolean;

    /** Quebra de linha de texto dentro das células */
    textWrap?: boolean;

    /** Callback quando a instância da tabela estiver pronta */
    onTableReady?: (table: Table<TData>) => void;
}

export interface EditableCellMeta {
    /** Define se a célula é editável */
    editable?: boolean;
    /** Tipo de input (text, number, money:2, etc.) */
    inputType?: 'text' | 'string' | 'number' | 'money:2' | 'money:4' | 'cep' | 'cpf' | 'cnpj' | 'cpf_cnpj';
    /** Placeholder do input */
    placeholder?: string;
    /** Prefixo (ex: 'R$ ', '$ ', etc) */
    prefix?: string;
    /** Sufixo (ex: ' %', ' kg', etc) */
    suffix?: string;
}

export interface ExtendedColumnMeta<TData> extends ColumnMeta<TData, unknown> {
    columnName?: string;
    cell?: EditableCellMeta;
}

export type DataTableMeta<TData> = {
    onCellCommit?: (payload: { row: TData; columnId: string; value: unknown }) => void;
    editingCell?: { rowId: string; columnId: string } | null;
    setEditingCell?: (cell: { rowId: string; columnId: string } | null) => void;
};

export type DataTableEmits<TData> = {
    /** Quando muda a ordenação da tabela */
    (e: 'sorting-change', v: Updater<SortingState>): void;

    /** Quando muda a visibilidade das colunas */
    (e: 'visibility-change', v: VisibilityState): void;

    /** Quando muda a paginação */
    (e: 'pagination-change', v: PaginationState): void;

    /** Quando há uma mudança geral de estado */
    (
        e: 'table-change',
        v: {
            sorting: SortingState;
            visibility: VisibilityState;
            pagination: PaginationState;
        }
    ): void;

    /** Quando clica na linha */
    (e: 'row-click', v: TData): void;
    /** Quando uma célula é editada e confirmada */
    (e: 'cell-commit', v: { row: TData; columnId: string; value: unknown }): void;
};

export interface PaginationParams {
    page?: number;
    per_page?: number;
    sort?: string;
}
