<template>
    <button v-if="props.type === 'primary' || props.type === undefined"
        class="px-4 py-2 border-main border-0.5 text-main hover:text-white hover:bg-main rounded-full w-fit font-semibold text-sm"
        :class="{ 'bg-main text-white': isSelected }">{{ props.content }}</button>
    <button v-else-if="props.type === 'disabled'"
        class="px-4 py-2 border-gray-400 border-0.5 text-gray-400 rounded-full w-fit font-semibold text-sm"
        :class="{ 'bg-gray-400 text-white': isSelected }">{{ props.content }}</button>
    <button v-else-if="props.type === 'submit'"
        class="px-4 py-2 border-green-600 border-0.5 text-green-600 hover:text-white hover:bg-green-600 rounded-full w-fit font-semibold text-sm"
        :class="{ 'bg-green-600 text-white': isSelected }">{{ props.content }}</button>
    <button v-else-if="props.type === 'cancel'"
        class="px-4 py-2 border-red-600 border-0.5 text-red-600 hover:text-white hover:bg-red-600 rounded-full w-fit font-semibold text-sm"
        :class="{ 'bg-red-600 text-white': isSelected }">{{ props.content }}</button>
    <button v-else-if="props.type === 'info'"
        class="px-4 py-2 border-blue-500 border-0.5 text-blue-500 hover:text-white hover:bg-blue-500 rounded-full w-fit font-semibold text-sm"
        :class="{ 'bg-blue-500 text-white': isSelected }">{{ props.content }}</button>
</template>
<script setup>
import { defineProps, watch, ref, onMounted } from 'vue'
const isSelected = ref(false)

const props = defineProps(['content', 'isSelected', 'type'])

watch(
    () => props.isSelected,
    () => {
        isSelected.value = props.isSelected
    }
)


onMounted(() => {
    isSelected.value = props.isSelected
})
</script>