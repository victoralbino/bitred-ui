<script setup lang="ts">
interface Prop {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

defineProps<{
  props: Prop[];
}>();
</script>

<template>
  <div class="rounded-lg border">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b bg-muted/50">
          <th class="px-4 py-3 text-left font-medium">Prop</th>
          <th class="px-4 py-3 text-left font-medium">Type</th>
          <th class="px-4 py-3 text-left font-medium">Default</th>
          <th class="px-4 py-3 text-left font-medium">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in props" :key="prop.name" class="border-b last:border-0">
          <td class="px-4 py-3">
            <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              {{ prop.name }}
              <span v-if="prop.required" class="text-destructive">*</span>
            </code>
          </td>
          <td class="px-4 py-3">
            <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              {{ prop.type }}
            </code>
          </td>
          <td class="px-4 py-3 text-muted-foreground">
            {{ prop.default ?? '-' }}
          </td>
          <td class="px-4 py-3 text-muted-foreground">
            {{ prop.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
