<script setup lang="ts" generic="TData">
import { Checkbox } from '@/components/ui/checkbox';
import type { SelectCheckboxProps } from './index';

const props = defineProps<SelectCheckboxProps<TData>>();

const isHeader = props.type === 'header';
</script>

<template>
    <Checkbox
        :model-value="isHeader ? props.table?.getIsAllPageRowsSelected() : props.row?.getIsSelected()"
        :aria-label="isHeader ? 'Selecionar todos' : 'Selecionar linha'"
        @update:model-value="
            (val) => {
                if (isHeader) props.table?.toggleAllPageRowsSelected(!!val);
                else props.row?.toggleSelected(!!val);
            }
        "
    />
</template>
