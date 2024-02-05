<template>
    <div class="w-full flex flex-col">
        <textarea v-if="props.type === 'textarea'" v-model="model" :placeholder="props.placeholder" class="w-full py-2 px-4 rounded-xl grow bg-button-back-light border-0.5 border-stroke-light font-normal"></textarea>
        <input v-else v-model="model" :placeholder="props.placeholder" class="w-full py-2 px-4 rounded-xl bg-button-back-light border-0.5 border-stroke-light font-normal">
    </div>
</template>
<script setup>
import { defineProps, defineModel } from 'vue';

const props = defineProps(['placeholder', 'type']);

const model = defineModel()
</script>