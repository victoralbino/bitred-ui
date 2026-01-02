<script setup lang="ts" generic="TData">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { Pencil } from 'lucide-vue-next';
import { vMaska } from 'maska/vue';
import type { Cell } from '@tanstack/vue-table';
import type { DataTableMeta, EditableCellMeta } from '../types';
import { useMaska, type MaskaType } from '@/composables/useMaska';

interface EditableCellProps {
    cell: Cell<TData, unknown>;
}
const props = defineProps<EditableCellProps>();

const inputRef = ref<HTMLInputElement | null>(null);
const localValue = ref<string>('');
const initialEditValue = ref<string>('');
const rootRef = ref<HTMLDivElement | null>(null);

const { getMaskaConfig, formatValue, parseValue: parseMaskaValue } = useMaska();

const tableMeta = computed(() => props.cell.getContext().table.options.meta as DataTableMeta<TData> | undefined);
const cellMeta = computed(() => (props.cell.column.columnDef.meta as { cell?: EditableCellMeta })?.cell);
const isEditable = computed(() => cellMeta.value?.editable ?? false);
const inputType = computed(() => cellMeta.value?.inputType ?? 'text');
const placeholder = computed(() => cellMeta.value?.placeholder ?? '');
const prefix = computed(() => cellMeta.value?.prefix ?? '');
const suffix = computed(() => cellMeta.value?.suffix ?? '');

const cellId = computed(() => ({
    rowId: props.cell.row.id,
    columnId: props.cell.column.id,
}));

const isEditing = computed(() => {
    const editing = tableMeta.value?.editingCell;
    return editing?.rowId === cellId.value.rowId && editing?.columnId === cellId.value.columnId;
});

const currentValue = computed(() => {
    const row = props.cell.row.original as Record<string, unknown>;
    return row[props.cell.column.id];
});

const hasMask = computed(() => {
    const type = inputType.value;
    return ['money:2', 'money:4', 'cep', 'cpf', 'cnpj', 'cpf_cnpj'].includes(type);
});

const maskaOptions = computed(() => {
    if (!hasMask.value) return undefined;
    return getMaskaConfig(inputType.value as MaskaType);
});

const displayValue = computed(() => {
    const value = currentValue.value;
    if (value === null || value === undefined) return '';

    const type = inputType.value;
    const formattedValue = hasMask.value ? formatValue(value, type) : String(value);

    const pre = prefix.value ? `${prefix.value} ` : '';
    const suf = suffix.value ? ` ${suffix.value}` : '';
    return `${pre}${formattedValue}${suf}`.trim();
});

const htmlInputType = computed(() => {
    if (hasMask.value) return 'text';
    if (inputType.value === 'number') return 'number';
    return 'text';
});

const inputStep = computed(() => {
    if (inputType.value === 'number') return '1';
    return undefined;
});

const hasPrefix = computed(() => prefix.value.length > 0);
const hasSuffix = computed(() => suffix.value.length > 0);

/**
 * Depois de sair do modo edição, devolve o foco para a célula da tabela
 */
function focusParentCell(): void {
    const rowId = String(props.cell.row.id);
    const colId = String(props.cell.column.id);

    const selector = `.data-table-row[data-row-id="${rowId}"] .data-table-cell[data-col-id="${colId}"]`;
    const cellElement = document.querySelector<HTMLElement>(selector);

    cellElement?.focus();
}

watch(isEditing, async (editing) => {
    if (editing) {
        const type = inputType.value;

        if (type.startsWith('money:')) {
            const numValue = currentValue.value;
            if (numValue === null || numValue === undefined || numValue === 0) {
                localValue.value = '';
            } else {
                const decimals = parseInt(type.split(':')[1] ?? '2', 10);
                const num = typeof numValue === 'number' ? numValue : parseFloat(String(numValue));
                if (!Number.isNaN(num)) {
                    localValue.value = num.toFixed(decimals).replace('.', ',');
                } else {
                    localValue.value = '';
                }
            }
        } else {
            let valueToEdit = displayValue.value;
            if (prefix.value) {
                valueToEdit = valueToEdit.replace(new RegExp(`^${prefix.value}\\s*`), '');
            }
            if (suffix.value) {
                valueToEdit = valueToEdit.replace(new RegExp(`\\s*${suffix.value}$`), '');
            }
            localValue.value = valueToEdit.trim();
        }

        initialEditValue.value = localValue.value;

        await nextTick();
        inputRef.value?.focus();
        inputRef.value?.select();
    }
});

function handleGlobalClick(event: MouseEvent): void {
    if (!isEditing.value) return;

    const target = event.target as Node | null;
    if (!target) return;

    if (rootRef.value && rootRef.value.contains(target)) {
        return;
    }

    cancelEditing();
}

onMounted(() => {
    window.addEventListener('mousedown', handleGlobalClick);
});

onUnmounted(() => {
    window.removeEventListener('mousedown', handleGlobalClick);
});

// Methods
function startEditing(): void {
    if (!isEditable.value) return;
    tableMeta.value?.setEditingCell?.(cellId.value);
}

function cancelEditing(): void {
    let valueToEdit = displayValue.value;
    if (prefix.value) {
        valueToEdit = valueToEdit.replace(new RegExp(`^${prefix.value}\\s*`), '');
    }
    if (suffix.value) {
        valueToEdit = valueToEdit.replace(new RegExp(`\\s*${suffix.value}$`), '');
    }
    localValue.value = valueToEdit.trim();
    tableMeta.value?.setEditingCell?.(null);

    void nextTick(() => {
        focusParentCell();
    });
}

function parseValue(value: string): unknown {
    const type = inputType.value;

    if (hasMask.value) {
        let toParse = value;

        if (prefix.value) {
            toParse = toParse.replace(new RegExp(`^${prefix.value}\\s*`), '');
        }

        if (suffix.value) {
            toParse = toParse.replace(new RegExp(`\\s*${suffix.value}$`), '');
        }

        return parseMaskaValue(toParse, type);
    }

    if (type === 'number') {
        if (value === '') return null;
        const parsed = Number(value);
        return Number.isNaN(parsed) ? null : parsed;
    }

    return value === '' ? null : value;
}

function commitValue(): void {
    const raw = localValue.value.trim();
    const initialRaw = initialEditValue.value.trim();

    console.log(raw, initialRaw);

    if (raw === initialRaw) {
        cancelEditing();
        return;
    }

    const parsedValue = parseValue(raw);

    if (parsedValue === currentValue.value) {
        cancelEditing();
        return;
    }

    tableMeta.value?.onCellCommit?.({
        row: props.cell.row.original,
        columnId: props.cell.column.id,
        value: parsedValue,
    });

    tableMeta.value?.setEditingCell?.(null);

    void nextTick(() => {
        focusParentCell();
    });
}

function handleKeydown(event: KeyboardEvent): void {
    const key = event.key;

    if (key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        commitValue();
        return;
    }

    if (key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        cancelEditing();
        return;
    }

    if (
        key === 'ArrowUp' ||
        key === 'ArrowDown' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight' ||
        key === 'Home' ||
        key === 'End'
    ) {
        event.stopPropagation();
    }
}
</script>

<template>
    <div
        class="w-full min-h-8 transition-all duration-200 group/cell"
        :class="{
            'border-2 border-primary/30 bg-primary/5': isEditing,
            'editable-cell--editing': isEditing,
        }"
    >
        <template v-if="isEditing">
            <div ref="rootRef" class="flex items-center w-fit">
                <span
                    v-if="hasPrefix"
                    class="px-2 py-1 text-sm font-medium text-white/70 bg-foreground/50 whitespace-nowrap select-none rounded-l"
                >
                    {{ prefix }}
                </span>

                <input
                    v-if="hasMask"
                    ref="inputRef"
                    v-model="localValue"
                    v-maska="maskaOptions"
                    type="text"
                    :placeholder="placeholder"
                    class="w-fit flex-1 px-2 py-1 text-sm font-inherit outline-none bg-foreground/50 text-white focus:border-ring focus:shadow-[0_0_0_2px_hsl(var(--ring)/0.2)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    :class="{
                        'rounded-r border-l-0': hasPrefix && !hasSuffix,
                        'rounded-l border-r-0': !hasPrefix && hasSuffix,
                        'rounded-none border-x-0': hasPrefix && hasSuffix,
                        rounded: !hasPrefix && !hasSuffix,
                    }"
                    @keydown="handleKeydown"
                />
                <input
                    v-else
                    ref="inputRef"
                    v-model="localValue"
                    :type="htmlInputType"
                    :placeholder="placeholder"
                    :step="inputStep"
                    class="w-fit flex-1 px-2 py-1 text-sm font-inherit outline-none bg-foreground/50 text-white focus:border-ring focus:shadow-[0_0_0_2px_hsl(var(--ring)/0.2)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    :class="{
                        'rounded-r border-l-0': hasPrefix && !hasSuffix,
                        'rounded-l border-r-0': !hasPrefix && hasSuffix,
                        'rounded-none border-x-0': hasPrefix && hasSuffix,
                        rounded: !hasPrefix && !hasSuffix,
                    }"
                    @keydown="handleKeydown"
                />

                <span
                    v-if="hasSuffix"
                    class="px-2 py-1 text-sm font-medium text-muted-foreground text-white/70 bg-foreground/50 whitespace-nowrap select-none rounded-r border-l border-border"
                >
                    {{ suffix }}
                </span>
            </div>
        </template>

        <template v-else>
            <div
                class="flex items-center justify-between gap-2 px-2 py-1 min-h-7 cursor-text rounded transition-colors duration-200 hover:bg-muted/50"
                @dblclick="startEditing"
            >
                <span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {{ displayValue }}
                </span>

                <button
                    v-if="isEditable"
                    type="button"
                    class="hidden group-hover/cell:flex items-center justify-center p-1 bg-transparent border-0 rounded cursor-pointer text-muted-foreground transition-all duration-200 flex-shrink-0 hover:bg-accent hover:text-accent-foreground"
                    aria-label="Editar célula"
                    @click.stop="startEditing"
                >
                    <Pencil :size="14" />
                </button>
            </div>
        </template>
    </div>
</template>
