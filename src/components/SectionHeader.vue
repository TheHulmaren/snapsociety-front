<template>
  <h3 class="text-xs px-4 py-1 rounded-full bg-slate-100 border-slate-200 border-0.5 w-fit">{{ props.content }}</h3>
</template>
<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps(['content'])
</script>