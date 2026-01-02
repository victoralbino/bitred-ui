<script setup lang="ts">
import { computed } from 'vue';
import type { Column } from '@tanstack/vue-table';
import { ArrowUp, ArrowDown, ArrowUpDown, Pin, PinOff, EyeOff, ChevronsUpDown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: Column<any, any>;
    title: string;
}

const props = defineProps<Props>();

const sortDirection = computed(() => props.column.getIsSorted());
const isPinned = computed(() => props.column.getIsPinned());

const handleSort = (direction?: 'asc' | 'desc') => {
    if (direction) {
        props.column.toggleSorting(direction === 'desc');
    } else {
        props.column.clearSorting();
    }
};

const handlePin = (position: 'left' | 'right' | false) => {
    props.column.pin(position);
};

const handleHide = () => {
    props.column.toggleVisibility(false);
};
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="-ml-3 h-8 data-[state=open]:bg-accent group hover:bg-transparent!">
                <span>{{ title }}</span>
                <ChevronsUpDown class="ml-2" />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" class="w-[160px]">
            <!-- Sorting -->
            <template v-if="column.getCanSort()">
                <DropdownMenuItem @click="handleSort('asc')">
                    <ArrowUp class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Ordenar A-Z
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleSort('desc')">
                    <ArrowDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Ordenar Z-A
                </DropdownMenuItem>
                <DropdownMenuItem v-if="sortDirection" @click="handleSort()">
                    <ArrowUpDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Limpar ordenação
                </DropdownMenuItem>

                <DropdownMenuSeparator />
            </template>

            <template v-if="column.getCanPin()">
                <!-- Pinning -->
                <DropdownMenuItem :disabled="isPinned === 'left'" @click="handlePin('left')">
                    <Pin class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Fixar à esquerda
                </DropdownMenuItem>
                <DropdownMenuItem :disabled="isPinned === 'right'" @click="handlePin('right')">
                    <Pin class="mr-2 h-3.5 w-3.5 text-muted-foreground/70 rotate-90" />
                    Fixar à direita
                </DropdownMenuItem>
                <DropdownMenuItem v-if="isPinned" @click="handlePin(false)">
                    <PinOff class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Desafixar
                </DropdownMenuItem>

                <DropdownMenuSeparator />
            </template>

            <template v-if="column.getCanHide()">
                <!-- Hide -->
                <DropdownMenuItem @click="handleHide">
                    <EyeOff class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Ocultar coluna
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
