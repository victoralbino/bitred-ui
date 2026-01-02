<script setup lang="ts">
import { ref } from 'vue';
import { Code, Eye } from 'lucide-vue-next';
import CodeBlock from './CodeBlock.vue';

interface Props {
  code?: string;
  language?: string;
}

withDefaults(defineProps<Props>(), {
  language: 'vue',
});

const activeTab = ref<'preview' | 'code'>('preview');
</script>

<template>
  <div class="rounded-lg border bg-background">
    <div class="flex items-center border-b px-4">
      <button
        class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'preview' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'preview'"
      >
        <Eye class="h-4 w-4" />
        Preview
      </button>
      <button
        v-if="code"
        class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'code' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'code'"
      >
        <Code class="h-4 w-4" />
        Code
      </button>
    </div>

    <div v-show="activeTab === 'preview'" class="flex min-h-[350px] items-center justify-center p-8">
      <slot />
    </div>

    <div v-if="code" v-show="activeTab === 'code'" class="p-4">
      <CodeBlock :code="code" :language="language" />
    </div>
  </div>
</template>
