<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table';
import { Spinner } from '@/components/ui/spinner';

interface DataTableToolbarProps {
    table?: Table<TData>;
    isFetching?: boolean;
}
defineProps<DataTableToolbarProps>();
</script>

<template>
    <div class="py-3 flex items-end lg:items-center justify-between">
        <div class="w-full flex flex-1 items-center space-x-2">
            <slot name="left" :table="table" />
            <Spinner v-if="isFetching" class="ml-2 text-muted-foreground" />
        </div>
        <slot name="right" :table="table" />
    </div>
</template>
