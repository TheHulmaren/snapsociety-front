<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import AppBar from './components/AppBar.vue'
import DailyUpdateLabel from './components/DailyUpdateLabel.vue'
</script>

<template>
  <div class=" max-w-4xl bg-white border-x-stroke-light border-x-0.5 mx-auto min-h-screen">
    <header class="w-full sticky top-0 z-20">
      <AppBar class=" bg-white shadow-md" />
      <DailyUpdateLabel />
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
