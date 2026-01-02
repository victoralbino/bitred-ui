<script setup lang="ts">
import { ref } from 'vue';
import CodeBlock from './CodeBlock.vue';

interface Props {
  componentName: string;
  registryUrl?: string;
  dependencies?: string[];
  registryDependencies?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  registryUrl: 'https://ui.bitred.com.br/r',
  dependencies: () => [],
  registryDependencies: () => [],
});

const activeTab = ref<'cli' | 'manual'>('cli');

const cliCommand = `npx shadcn-vue@latest add ${props.registryUrl}/${props.componentName}.json`;
const npmCommand = props.dependencies.length > 0 ? `npm install ${props.dependencies.join(' ')}` : '';
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold tracking-tight">Installation</h2>

    <div class="rounded-lg border">
      <div class="flex border-b">
        <button
          class="px-4 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'cli' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'cli'"
        >
          CLI
        </button>
        <button
          class="px-4 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'manual' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'manual'"
        >
          Manual
        </button>
      </div>

      <div class="p-4 space-y-4">
        <template v-if="activeTab === 'cli'">
          <div class="space-y-2">
            <p class="text-sm text-muted-foreground">Run the following command:</p>
            <CodeBlock :code="cliCommand" language="bash" />
          </div>

          <div v-if="npmCommand" class="space-y-2">
            <p class="text-sm text-muted-foreground">Install the required dependencies:</p>
            <CodeBlock :code="npmCommand" language="bash" />
          </div>
        </template>

        <template v-else>
          <div class="space-y-4">
            <div v-if="registryDependencies.length > 0" class="space-y-2">
              <p class="text-sm text-muted-foreground">First, install the required shadcn-vue components:</p>
              <CodeBlock
                :code="`npx shadcn-vue@latest add ${registryDependencies.join(' ')}`"
                language="bash"
              />
            </div>

            <div v-if="dependencies.length > 0" class="space-y-2">
              <p class="text-sm text-muted-foreground">Install npm dependencies:</p>
              <CodeBlock :code="npmCommand" language="bash" />
            </div>

            <div class="space-y-2">
              <p class="text-sm text-muted-foreground">
                Then copy the component files from the registry:
              </p>
              <a
                :href="`${registryUrl}/${componentName}.json`"
                target="_blank"
                class="inline-flex items-center text-sm text-primary hover:underline"
              >
                View component source
              </a>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
