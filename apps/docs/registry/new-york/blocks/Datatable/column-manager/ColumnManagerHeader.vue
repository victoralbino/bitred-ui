<script setup lang="ts">
import { Maximize2, Minimize2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ColumnManagerHeaderProps {
    visibleCount: number;
    totalCount: number;
    isCompact: boolean;
}

defineProps<ColumnManagerHeaderProps>();
const emit = defineEmits<{
    'toggle-compact': [];
}>();
</script>

<template>
    <DropdownMenuLabel class="font-normal py-0">
        <div class="flex items-center py-2">
            <span class="flex-1">Configurar Colunas</span>
            <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground"> {{ visibleCount }}/{{ totalCount }} </span>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button variant="ghost" size="icon" class="h-5 w-5" @click="emit('toggle-compact')">
                                <component :is="isCompact ? Maximize2 : Minimize2" class="h-3 w-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{{ isCompact ? 'Expandir' : 'Compactar' }}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    </DropdownMenuLabel>
</template>
