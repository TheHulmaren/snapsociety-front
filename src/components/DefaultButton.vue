<template>
    <button v-if="props.type === 'primary' || props.type === undefined"
        class="px-4 py-2 border-0.5 border-gray-700 shadow-main text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-800 rounded w-fit text-xs transition-all duration-100 ease-in-out"
        :class="{ 'bg-gray-800 shadow-md -translate-y-[2px] text-main hover:text-main': isSelected }">{{ props.content }}</button>
    <button v-else-if="props.type === 'disabled'"
    class="px-4 py-2 border-0.5 border-gray-700 shadow-main text-gray-400 hover:text-gray-200 bg-gray-900 hover:bg-gray-800 rounded w-fit text-xs transition-all duration-100 ease-in-out"
        :class="{ 'bg-gray-800 shadow-md -translate-y-[2px] text-main': isSelected }">{{ props.content }}</button>
    <button v-else-if="props.type === 'submit'"
    class="px-4 py-2 border-0.5 border-gray-700 shadow-main text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-800 rounded w-fit text-xs transition-all duration-100 ease-in-out"
        :class="{ 'bg-gray-800 shadow-md -translate-y-[2px] text-main': isSelected }">{{ props.content }}</button>
    <button v-else-if="props.type === 'cancel'"
    class="px-4 py-2 border-0.5 border-gray-700 shadow-main text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-800 rounded w-fit text-xs transition-all duration-100 ease-in-out"
        :class="{ 'bg-gray-800 shadow-md -translate-y-[2px] text-main': isSelected }">{{ props.content }}</button>
    <button v-else-if="props.type === 'info'"
    class="px-4 py-2 border-0.5 border-gray-700 shadow-main text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-800 rounded w-fit text-xs transition-all duration-100 ease-in-out"
        :class="{ 'bg-gray-800 shadow-md -translate-y-[2px] text-main': isSelected }">{{ props.content }}</button>
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