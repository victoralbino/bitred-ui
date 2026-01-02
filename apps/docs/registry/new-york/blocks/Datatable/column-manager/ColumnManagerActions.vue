<script setup lang="ts">
import { Eye, EyeOff, Pin, RotateCcw } from 'lucide-vue-next';
import { DropdownMenuItem, DropdownMenuGroup } from '@/components/ui/dropdown-menu';

interface ColumnManagerActionsProps {
    hasActions: boolean;
    hiddenCount: number;
    visibleCount: number;
    pinnedCount: number;
}

defineProps<ColumnManagerActionsProps>();
const emit = defineEmits<{
    'show-all': [];
    'hide-all': [];
    'unpin-all': [];
    reset: [];
}>();
</script>

<template>
    <template v-if="hasActions">
        <DropdownMenuGroup>
            <DropdownMenuItem v-if="hiddenCount > 0" @click="emit('show-all')">
                <Eye class="mr-2 h-4 w-4" />
                <span>Exibir Todas</span>
            </DropdownMenuItem>

            <DropdownMenuItem v-if="visibleCount > 1" @click="emit('hide-all')">
                <EyeOff class="mr-2 h-4 w-4" />
                <span>Ocultar Todas</span>
            </DropdownMenuItem>

            <DropdownMenuItem v-if="pinnedCount > 0" @click="emit('unpin-all')">
                <Pin class="mr-2 h-4 w-4" />
                <span>Remover Todos os Pins</span>
            </DropdownMenuItem>

            <DropdownMenuItem @click="emit('reset')">
                <RotateCcw class="mr-2 h-4 w-4" />
                <span>Resetar Padrão</span>
            </DropdownMenuItem>
        </DropdownMenuGroup>
    </template>
</template>
