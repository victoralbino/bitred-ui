<script setup lang="ts">
import { Github } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/docs/ThemeToggle.vue';
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 items-center justify-between px-4">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            B
          </div>
          <span>Bitred UI</span>
        </NuxtLink>

        <nav class="flex items-center gap-1">
          <Button variant="ghost" size="sm" as-child>
            <NuxtLink to="/docs">Docs</NuxtLink>
          </Button>
          <Button variant="ghost" size="icon" as-child>
            <a href="https://github.com/victoralbino/bitred-ui" target="_blank" rel="noopener">
              <Github class="h-5 w-5" />
            </a>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <main class="flex flex-1 flex-col">
      <section class="container flex flex-col items-center justify-center gap-8 py-24 text-center md:py-32 lg:py-40">
        <div class="flex flex-col items-center gap-4">
          <div class="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
            Open Source UI Components
          </div>
          <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Build beautiful apps with
            <span class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Bitred UI
            </span>
          </h1>
          <p class="max-w-[600px] text-lg text-muted-foreground md:text-xl">
            A collection of beautifully designed, accessible components built with Vue 3 and Tailwind CSS.
            Compatible with shadcn-vue.
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" as-child>
            <NuxtLink to="/docs">
              Get Started
            </NuxtLink>
          </Button>
          <Button variant="outline" size="lg" as-child>
            <a href="https://github.com/victoralbino/bitred-ui" target="_blank" rel="noopener">
              <Github class="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t py-6">
      <div class="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p class="text-sm text-muted-foreground">
          Built by Victor Damacena. Open source on GitHub.
        </p>
        <div class="flex items-center gap-4">
          <a href="https://github.com/victoralbino/bitred-ui" target="_blank" class="text-sm text-muted-foreground hover:text-foreground">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
