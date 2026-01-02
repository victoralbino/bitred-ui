<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
    table: { type: Object, required: true },
    isLoadingData: { type: Boolean, default: false },
});
</script>

<template>
    <div class="flex items-center justify-between p-2">
        <div class="hidden lg:flex flex-1 text-sm text-muted-foreground">
            <span> Exibindo {{ table.getFilteredRowModel().rows.length }} de {{ table.getRowCount() }} itens. </span>
            <span v-if="table.getFilteredSelectedRowModel().rows.length">
                {{ table.getFilteredSelectedRowModel().rows.length }} selecionada(s).
            </span>
        </div>
        <div class="flex items-center justify-between lg:justify-start w-full lg:w-fit space-x-6 lg:space-x-8">
            <div class="flex items-center space-x-2">
                <p class="hidden lg:block text-sm font-medium">Itens por página</p>
                <Select
                    :model-value="`${table.getState().pagination.pageSize}`"
                    :disabled="isLoadingData"
                    @update:model-value="table.setPageSize"
                >
                    <SelectTrigger class="h-8 w-[70px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem v-for="size in [5, 10, 20, 30, 40, 50]" :key="size" :value="`${size}`">
                            {{ size }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div class="hidden lg:flex w-[100px] items-center justify-center text-sm font-medium">
                Página {{ table.getState().pagination.pageIndex + 1 }} de {{ table.getPageCount() }}
            </div>
            <div class="flex items-center space-x-2">
                <Button
                    variant="outline"
                    class="h-8 w-8 p-0"
                    :disabled="!table.getCanPreviousPage() || isLoadingData"
                    @click="table.setPageIndex(0)"
                >
                    <ChevronsLeft class="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    class="h-8 w-8 p-0"
                    :disabled="!table.getCanPreviousPage() || isLoadingData"
                    @click="table.previousPage()"
                >
                    <ChevronLeft class="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    class="h-8 w-8 p-0"
                    :disabled="!table.getCanNextPage() || isLoadingData"
                    @click="table.nextPage()"
                >
                    <ChevronRight class="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    class="h-8 w-8 p-0"
                    :disabled="!table.getCanNextPage() || isLoadingData"
                    @click="table.setPageIndex(table.getPageCount() - 1)"
                >
                    <ChevronsRight class="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
