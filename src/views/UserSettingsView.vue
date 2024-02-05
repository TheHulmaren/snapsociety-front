<template>
    <div class="flex flex-col items-center">
        {{user}}
        <button @click="onLogoutClick">Logout</button>
    </div>
</template>
  
<script setup>
import { AuthHelper } from '@/helpers/AuthHelper';
import { onMounted, ref } from 'vue'

const user = ref({});

onMounted(() => {
    user.value = AuthHelper.getUser();
})

const onLogoutClick = () => {
    AuthHelper.clearTokens();
    window.location.reload();
}
</script>