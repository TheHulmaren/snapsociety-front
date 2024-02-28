<template>
    <div class="fixed z-30 inset-0 w-screen h-screen bg-gray-950 bg-opacity-70 flex justify-center items-center">
        <div class="flex flex-col sm:w-3/4 h-3/4 z-20 p-4 gap-4 bg-gray-800 border-gray-700 border-0.5 shadow-lg">
            <div class="grow overflow-y-scroll">
                <slot></slot>
            </div>
            <DefaultButton class="self-end" content="닫기" @click="emits('onClose')"/>
        </div>
    </div>
</template>
<script setup>
import DefaultButton from '@/components/DefaultButton.vue';
import { onMounted, ref, defineEmits } from 'vue'

const emits = defineEmits(['onClose'])
</script>