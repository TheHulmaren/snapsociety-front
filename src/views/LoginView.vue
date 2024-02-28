<template>
    <form @submit.prevent="onLoginSubmit()" class="flex flex-col gap-2 px-4 py-2 mt-32 items-center sm:w-1/2 mx-auto">
        <div class="flex items-start gap-4 mb-4 items-center">

            <img src="/icon-512-maskable.png" class="w-14 h-14 rounded hover:cursor-pointer"/>
            <h1 class="text-lg font-semibold text-main">
                어서오세요🙋‍♀️<br>기다리고 있었습니다
            </h1>
        </div>
        <DefaultTextField v-model="id" placeholder="이메일" type="email"/>
        <DefaultTextField v-model="password" type="password" placeholder="비밀번호" />
        <button type="submit" class="py-2 px-4 rounded border-0.5 border-gray-700 text-xs font-semibold hover:text-main transition duration-100 ease-in-out">
            로그인
        </button>
    </form>
</template>
<script setup>
import DefaultTextField from '@/components/DefaultTextField.vue';
import { AuthHelper } from '@/helpers/AuthHelper';
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const id = ref("");
const password = ref("");

const onLoginSubmit = async () => {
    console.log("Attempt to login")
    console.log(import.meta.env.VITE_API_URL)
    var result = await AuthHelper.signIn(id.value, password.value);
    if (result) {
        console.log(result)
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