<template>
    <div class="fixed z-30 inset-0 w-screen h-screen bg-text-searchbar bg-opacity-30 flex justify-center items-center">
        <div class="flex flex-col w-3/4 h-3/4 z-20 p-4 gap-4 bg-white shadow-md">
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