<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import AppBar from './components/AppBar.vue'
import DailyUpdateLabel from './components/DailyUpdateLabel.vue'
</script>

<template>
  <div class=" max-w-2xl bg-white dark:bg-gray-900 border-x-stroke-light dark:border-x-gray-800 border-x-0.5 mx-auto min-h-screen">
    <header class="w-full sticky top-0 z-20">
      <AppBar class=" bg-white dark:bg-gray-900 shadow-md" />
      <DailyUpdateLabel />
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
