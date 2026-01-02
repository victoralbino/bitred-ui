<script setup lang="ts">
import { Search, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu';

interface ColumnManagerSearchProps {
    modelValue: string;
}

defineProps<ColumnManagerSearchProps>();
const emit = defineEmits<{
    'update:modelValue': [value: string];
    clear: [];
}>();

function handleUpdate(v: string | number) {
    emit('update:modelValue', typeof v === 'number' ? String(v) : v);
}
</script>

<template>
    <DropdownMenuLabel class="font-normal py-0">
        <div class="py-2">
            <div class="relative">
                <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    :model-value="modelValue"
                    placeholder="Buscar..."
                    class="h-8 pl-8 pr-8"
                    @update:model-value="handleUpdate"
                />
                <Button
                    v-if="modelValue"
                    variant="ghost"
                    size="sm"
                    class="absolute right-0 top-0 h-8 w-8 p-0"
                    @click="emit('clear')"
                >
                    <X class="h-4 w-4" />
                </Button>
            </div>
        </div>
    </DropdownMenuLabel>
</template>
