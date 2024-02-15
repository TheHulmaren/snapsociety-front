<template>
  <h3 class="text-xs px-4 py-1 rounded bg-gray-800 border-gray-700 border-0.5 w-fit">{{ props.content }}</h3>
</template>
<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps(['content'])
</script>