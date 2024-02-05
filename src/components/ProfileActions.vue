<template>
    <div class="flex flex-col text-nowrap divide-y divide-stroke-light text-text-dark rounded-xl overflow-clip">
        <button @click="router.push('/user/' + AuthHelper.getUser().id); emits('on-select')"
            class="text-left w-full py-2 px-6 hover:bg-main hover:text-white">💁‍♂️ My Profile</button>
        <button @click="router.push('/submit/photo'); emits('on-select')"
            class="text-left w-full py-2 px-6 hover:bg-main hover:text-white">🛜 Upload Photos</button>
        <button @click="router.push('/submit/post'); emits('on-select')"
            class="text-left w-full py-2 px-6 hover:bg-main hover:text-white">🖌️ Write Post</button>
        <button @click="router.push('/userSettings'); emits('on-select')"
            class="text-left w-full py-2 px-6 hover:bg-main hover:text-white">⚙️ Settings</button>
    </div>
</template>
<script setup>
import { AuthHelper } from '@/helpers/AuthHelper';
import { useRouter } from 'vue-router';
import { defineEmits } from 'vue';

const router = useRouter();

const emits = defineEmits(['on-select']);
</script>