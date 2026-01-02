<script setup lang="ts">
definePageMeta({
  layout: 'docs',
});
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Bitred UI</h1>
      <p class="text-xl text-muted-foreground">
        A collection of beautifully designed, accessible components built with Vue 3, Tailwind CSS, and shadcn-vue.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <NuxtLink
        to="/docs/datatable"
        class="group rounded-lg border p-6 transition-colors hover:border-foreground/50 hover:bg-muted/50"
      >
        <h3 class="mb-2 text-lg font-semibold group-hover:text-primary">Data Table</h3>
        <p class="text-sm text-muted-foreground">
          Advanced data table with sorting, pagination, column pinning, reordering, and editable cells.
        </p>
      </NuxtLink>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">Features</h2>
      <ul class="grid gap-2 text-muted-foreground">
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Built with Vue 3 and TypeScript
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Styled with Tailwind CSS
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Compatible with shadcn-vue
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Copy and paste - no runtime dependencies
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          Dark mode support
        </li>
      </ul>
    </div>
  </div>
</template>
