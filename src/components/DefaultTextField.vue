<template>
    <div class="w-full flex flex-col text-sm">
        <textarea v-if="props.type === 'textarea'" v-model="model" :placeholder="props.placeholder" class="w-full py-2 px-4 rounded grow bg-gray-950 border-0.5 border-gray-700 font-normal focus:outline-none focus:ring-1 ring-main transition duration-100 ease-in-out"></textarea>
        <input v-else v-model="model" :placeholder="props.placeholder" class="w-full py-2 px-4 rounded bg-gray-950 border-0.5 border-gray-700 font-normal focus:outline-none focus:ring-1 ring-main transition duration-100 ease-in-out">
    </div>
</template>
<script setup>
import { defineProps, defineModel } from 'vue';

const props = defineProps(['placeholder', 'type']);

const model = defineModel()
</script>