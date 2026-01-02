<script setup lang="ts" generic="TData">
import { Eye, EyeOff, Pin } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Column } from '@tanstack/vue-table';
import type { ExtendedColumnMeta } from '../types';

interface ColumnManagerItemProps {
    column: Column<TData, unknown>;
    isCompact: boolean;
}

const props = defineProps<ColumnManagerItemProps>();
const emit = defineEmits<{
    (e: 'toggle-visibility', column: Column<TData, unknown>): void;
    (e: 'toggle-pin-left', column: Column<TData, unknown>): void;
    (e: 'toggle-pin-right', column: Column<TData, unknown>): void;
}>();

const getColumnPinState = (column: Column<TData, unknown>) => column.getIsPinned();

const meta = props.column.columnDef.meta as ExtendedColumnMeta<TData> | undefined;
</script>

<template>
    <DropdownMenuLabel class="font-normal py-0 cursor-default">
        <div :class="cn('flex items-center gap-2', !isCompact ? 'py-2' : 'py-1.5')">
            <span :class="cn('flex-1 text-sm capitalize', !column.getIsVisible() && 'opacity-60 line-through')">
                {{ meta?.columnName ?? column.id }}
            </span>

            <TooltipProvider>
                <div class="flex items-center gap-1">
                    <template v-if="column.getCanHide()">
                        <!-- Toggle Visibilidade -->
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Button
                                    :variant="!column.getIsVisible() ? 'default' : 'ghost'"
                                    size="icon"
                                    class="h-7 w-7"
                                    @click.prevent="emit('toggle-visibility', column)"
                                >
                                    <component :is="column.getIsVisible() ? Eye : EyeOff" class="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{{ column.getIsVisible() ? 'Ocultar' : 'Exibir' }}</p>
                            </TooltipContent>
                        </Tooltip>
                    </template>

                    <template v-if="column.getCanPin()">
                        <!-- Pin Esquerda -->
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Button
                                    :variant="getColumnPinState(column) === 'left' ? 'default' : 'ghost'"
                                    size="icon"
                                    class="h-7 w-7"
                                    @click.prevent="emit('toggle-pin-left', column)"
                                >
                                    <Pin class="h-4 w-4 rotate-[-45deg]" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{{ getColumnPinState(column) === 'left' ? 'Remover pin' : 'Pin à esquerda' }}</p>
                            </TooltipContent>
                        </Tooltip>

                        <!-- Pin Direita -->
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Button
                                    :variant="getColumnPinState(column) === 'right' ? 'default' : 'ghost'"
                                    size="icon"
                                    class="h-7 w-7"
                                    @click.prevent="emit('toggle-pin-right', column)"
                                >
                                    <Pin class="h-4 w-4 rotate-[45deg]" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{{ getColumnPinState(column) === 'right' ? 'Remover pin' : 'Pin à direita' }}</p>
                            </TooltipContent>
                        </Tooltip>
                    </template>
                </div>
            </TooltipProvider>
        </div>
    </DropdownMenuLabel>
</template>
