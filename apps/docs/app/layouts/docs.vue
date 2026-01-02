<script setup lang="ts">
import { Menu, X, ChevronRight, Github } from 'lucide-vue-next';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/docs/ThemeToggle.vue';

const isSidebarOpen = ref(false);

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Data Table', href: '/docs/datatable' },
    ],
  },
  {
    title: 'Data Table',
    items: [
      { title: 'Overview', href: '/docs/datatable' },
      { title: 'Examples', href: '/docs/datatable/examples' },
      { title: 'DataTable', href: '/docs/datatable/datatable' },
      { title: 'DataTableHeader', href: '/docs/datatable/header' },
      { title: 'DataTableBody', href: '/docs/datatable/body' },
      { title: 'Pagination', href: '/docs/datatable/pagination' },
      { title: 'Column Manager', href: '/docs/datatable/column-manager' },
      { title: 'Sortable Header', href: '/docs/datatable/sortable-header' },
      { title: 'Editable Cells', href: '/docs/datatable/editable-cells' },
    ],
  },
];
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Top Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex h-14 items-center px-4 lg:px-6">
        <!-- Mobile menu button -->
        <Button variant="ghost" size="icon" class="lg:hidden" @click="isSidebarOpen = !isSidebarOpen">
          <Menu v-if="!isSidebarOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </Button>

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold lg:ml-0 ml-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            B
          </div>
          <span class="hidden sm:inline-block">Bitred UI</span>
        </NuxtLink>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Right side actions -->
        <nav class="flex items-center gap-1">
          <Button variant="ghost" size="icon" as-child>
            <a href="https://github.com/victoralbino/bitred-ui" target="_blank" rel="noopener">
              <Github class="h-5 w-5" />
              <span class="sr-only">GitHub</span>
            </a>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 top-14 z-40 w-72 transform border-r bg-background/95 backdrop-blur transition-transform duration-200 lg:static lg:translate-x-0 lg:bg-transparent"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <nav class="h-[calc(100vh-3.5rem)] overflow-y-auto p-4 lg:p-6">
          <div v-for="group in navigation" :key="group.title" class="mb-6">
            <h4 class="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {{ group.title }}
            </h4>
            <ul class="space-y-1">
              <li v-for="item in group.items" :key="item.href">
                <NuxtLink
                  :to="item.href"
                  class="flex items-center rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  active-class="bg-accent text-accent-foreground font-medium"
                  @click="isSidebarOpen = false"
                >
                  <ChevronRight class="mr-1.5 h-3 w-3 opacity-50" />
                  {{ item.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- Overlay -->
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 top-14 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          @click="isSidebarOpen = false"
        />
      </Transition>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <div class="container max-w-4xl py-8 px-6 lg:py-12 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
