<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import AppBar from './components/AppBar.vue'
import DailyUpdateLabel from './components/DailyUpdateLabel.vue'
import store from './infra/vuex'
</script>

<template>
  <div class=" max-w-2xl bg-white dark:bg-gray-900 border-x-stroke-light dark:border-x-gray-800 border-x-0.5 mx-auto min-h-screen">
    <header class="w-full sticky top-0 z-20">
      <AppBar class=" bg-white dark:bg-gray-900 shadow-md" />
      <DailyUpdateLabel />
    </header>
    <main class="pb-20">
      <RouterView />
      <div v-if="store.state.showLoginLoading" class="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center gap-4 backdrop-blur-md z-50">
        <img src="/icon-512-maskable.png" class="w-12 h-12 rounded animate-pulse" />
        <span>로딩 중..</span>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
