<template>
    <div class="flex flex-col text-nowrap whitespace-nowrap break-words divide-y divide-gray-700 rounded overflow-clip bg-gray-800 text-sm">
        <button @click="router.push('/user/' + AuthHelper.getUser().id + '/photos?query=🕗 업로드_👇 최신 순'); emits('on-select')"
            class="text-left w-full py-2 px-10 hover:bg-gray-700 hover:text-white transition duration-100 ease-in-out">👤 프로필</button>
        <button @click="router.push('/submit/photo'); emits('on-select')"
            class="text-left w-full py-2 px-10 hover:bg-gray-700 hover:text-white transition duration-100 ease-in-out">📂 사진 업로드</button>
        <button @click="router.push('/submit/post'); emits('on-select')"
            class="text-left w-full py-2 px-10 hover:bg-gray-700 hover:text-white transition duration-100 ease-in-out">🖌️ 글쓰기</button>
        <button @click="router.push('/userSettings'); emits('on-select')"
            class="text-left w-full py-2 px-10 hover:bg-gray-700 hover:text-white transition duration-100 ease-in-out">⚙️ 설정</button>
    </div>
</template>
<script setup>
import { AuthHelper } from '@/helpers/AuthHelper';
import { useRouter } from 'vue-router';
import { defineEmits } from 'vue';

const router = useRouter();

const emits = defineEmits(['on-select']);
</script>