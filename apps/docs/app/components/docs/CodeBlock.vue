<script setup lang="ts">
import { ref, computed } from 'vue';
import { Check, Copy, Terminal } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

interface Props {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  language: 'typescript',
  showLineNumbers: false,
});

const copied = ref(false);

async function copyToClipboard() {
  await navigator.clipboard.writeText(props.code.trim());
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

const lines = computed(() => props.code.trim().split('\n').length);
</script>

<template>
  <div class="group relative rounded-lg border bg-zinc-950 dark:bg-zinc-900 text-sm overflow-hidden">
    <div v-if="filename" class="flex items-center gap-2 border-b border-zinc-800 px-4 py-2 text-zinc-400">
      <Terminal class="h-4 w-4" />
      <span class="font-mono text-xs">{{ filename }}</span>
    </div>

    <div class="relative">
      <Button
        variant="ghost"
        size="icon"
        class="absolute right-2 top-2 z-10 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
        @click="copyToClipboard"
      >
        <Check v-if="copied" class="h-4 w-4 text-green-500" />
        <Copy v-else class="h-4 w-4" />
      </Button>

      <div class="flex">
        <div
          v-if="showLineNumbers"
          class="select-none border-r border-zinc-800 py-4 pr-4 pl-4 text-right font-mono text-xs text-zinc-600"
        >
          <div v-for="n in lines" :key="n">{{ n }}</div>
        </div>

        <div class="overflow-x-auto p-4 font-mono text-sm [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!bg-transparent">
          <Shiki :lang="language" :code="code.trim()" />
        </div>
      </div>
    </div>
  </div>
</template>
