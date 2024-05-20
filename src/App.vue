<script setup lang="ts">
import { useStreamStore } from '@/stores/streams'
import { onMounted } from 'vue'

const store = useStreamStore()

onMounted(() => {
  store.createStreams(undefined)
})
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink :to="{ name: 'create-meeting' }">Crear</RouterLink>
      <RouterLink :to="{ name: 'join-meeting' }">Unirse</RouterLink>
    </nav>
  </header>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
