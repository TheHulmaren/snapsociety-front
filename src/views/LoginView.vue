<template>
    <form @submit.prevent="onLoginSubmit()" class="flex flex-col gap-2 px-4 py-2 mt-32 items-center">
        <h1 class="text-2xl font-semibold text-main my-2">
            👋 Welcome, again.
        </h1>
        <input placeholder="Enter ID" type="text" v-model="id" class="w-2/3 py-2 px-4 rounded-full grow bg-button-back-light border-0.5 border-stroke-light text-xs font-normal">
        <input placeholder="Enter password" type="password" v-model="password" class="w-2/3 py-2 px-4 rounded-full grow bg-button-back-light border-0.5 border-stroke-light text-xs font-normal">
        <button type="submit" class="hover:bg-main hover:text-white py-2 px-4 rounded-full border-0.5 border-main font-semibold text-main">Login</button>
    </form>
</template>
<script setup>
import { AuthHelper } from '@/helpers/AuthHelper';
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const id = ref("");
const password = ref("");

const onLoginSubmit = async () =>{
    console.log("Attempt to login")
    console.log(import.meta.env.VITE_API_URL)
    console.log(process.env.VITE_API_URL)
    var result = await AuthHelper.signIn(id.value, password.value);
    if(result){
        console.log("Login success")
        AuthHelper.clearTokens()
        AuthHelper.setAccessToken(result.accessToken)
        AuthHelper.setRefreshToken(result.refreshToken)
        router.push('/')
        return;
    }
    console.log("Login failed")
    alert("Login failed")
}

</script>@/router/router