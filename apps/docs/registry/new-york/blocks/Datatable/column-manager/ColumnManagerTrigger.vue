<script setup lang="ts">
import { Settings2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ColumnManagerTriggerProps {
    pinnedCount: number;
}

defineProps<ColumnManagerTriggerProps>();
</script>

<template>
    <Button variant="outline" class="ml-auto lg:flex">
        <Settings2 class="h-4 w-4" />
        <Badge v-if="pinnedCount > 0" variant="secondary" class="ml-2 h-5 px-1.5 text-xs">
            {{ pinnedCount }}
        </Badge>
    </Button>
</template>
