<template>
    <form @submit.prevent="onLoginSubmit()" class="flex flex-col gap-4 px-4 py-2 mt-32 items-center sm:w-1/2 mx-auto">
        <div class="flex gap-4 items-center">
            <img src="/icon-512-maskable.png" class="w-14 h-14 rounded hover:cursor-pointer" />
            <h1 class="text-lg font-semibold text-main">
                어서오세요🙋‍♀️<br>기다리고 있었습니다
            </h1>
        </div>
        <div class="flex flex-col w-full gap-2">
            <DefaultTextField v-model="id" placeholder="이메일" type="email" />
            <DefaultTextField v-model="password" type="password" placeholder="비밀번호" />
        </div>
        <span class="text-xs text-slate-500 text-center">이메일 혹은 비밀번호를 잊으셨나요?<br><a href="mailto:snapsociety531@gmail.com"
                class="underline">snapsociety531@gmail.com</a> 으로 문의해 주세요<br>
            <button type="button" @click="showHelpDetail = !showHelpDetail" class="text-xs underline mt-2">문의 도움말 보기</button>
            <br>
            <span v-if="showHelpDetail">이메일을 잊으신 경우: 계정의 소유자임을 입증할 만한 근거를 첨부해서 보내주세요.<br>
                (예시: 업로드 된 사진의 RAW 파일, 업로드 된 사진과 같은 시점과 장소에서 촬영한 다른 사진 등)
                <br>
                비밀번호를 잊으신 경우: 계정에 등록된 이메일을 발신자로 해서 새로운 비밀번호를 보내주세요.
            </span>
        </span>
        <button type="submit"
            class="py-2 px-4 rounded self-center border-0.5 border-gray-700 text-xs font-semibold hover:text-main transition duration-100 ease-in-out">
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
const showHelpDetail = ref(false);

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