<template>
    <div class="flex flex-col items-center pt-40 px-4 gap-4">
        <h1 class="text-3xl font-bold">계정이 정지되었습니다.</h1>
        <p class="text-lg">사유: {{ userBan.reason }}</p>
        <span class="text-sm">정지 일시: {{ userBan.banDate }}</span>
        <span class="text-sm">해제 일시: {{ userBan.unbanDate }}</span>
        <span class="text-sm">정시 일수: {{ userBan.days }}일</span>
        <p class="text-sm text-center">
            본 조치에 대한 이의 제기 및 소명은 snapsociety531@gmail.com 을 통해 가능합니다.
            <br>
            검토를 거친 후 가능한한 빠르게 답변 드리겠습니다.
        </p>
    </div>
</template>
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue'
import { AuthHelper } from '@/helpers/AuthHelper';


const userBan = ref({});

onMounted(async() => {
    userBan.value = await AuthHelper.checkIfBanned(AuthHelper.getUser().id);
})
</script>
