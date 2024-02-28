<template>
    <div class="flex flex-col divide-y-0.5 divide-gray-800 text-xs">
        <table class="table-auto [&_td]:border-gray-700 [&_td]:border-y-0.5 border-collapse hover:[&_tr]:bg-gray-800 [&_tr]:cursor-pointer">
            <tbody>
                <tr>
                    <td class="py-2 px-4">이름</td>
                    <td class="py-2 px-4">{{ user.userName }}</td>
                </tr>
                <tr>
                    <td class="py-2 px-4">아이디</td>
                    <td class="py-2 px-4">{{ user.id }}</td>
                </tr>
                <tr>
                    <td class="py-2 px-4">이메일</td>
                    <td class="py-2 px-4">{{ user.email ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="py-2 px-4">권한</td>
                    <td class="py-2 px-4">{{ AuthHelper.getUser().roles }}</td>
                </tr>
            </tbody>
        </table>
        <p class="px-4 py-2 text-gray-500 font-bold">
            계정 정보(이메일, 비밀번호)를 변경하려면 <a href="mailto:snapsociety531@gmail.com" class="underline hover:text-gray-400">snapsociety531@gmail.com</a> 로 문의해주세요.
        </p>
        <DefaultButton class="m-4 self-end" @click="onLogoutClick" content="로그아웃"/>
    </div>
</template>
<script setup>
import axios from 'axios';
import DefaultButton from '@/components/DefaultButton.vue';
import { AuthHelper } from '@/helpers/AuthHelper';
import { onMounted, ref } from 'vue'

const user = ref({});

onMounted(async () => {
    user.value = (await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${AuthHelper.getUser().id}`)).data;
})

const onLogoutClick = () => {
    if(!confirm('로그아웃 하시겠습니까?')) return;
    AuthHelper.clearTokens();
    window.location.reload();
}
</script>