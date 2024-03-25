<template>
    <div class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center z-50 backdrop-blur-sm">
        <div
            class="flex flex-col items-center w-4/5 sm:w-[512px] gap-4 bg-gray-800 px-4 py-12 border border-gray-700 rounded shadow-md shadow-gray-900">
            <div class="flex gap-4 items-center">
                <img src="/icon-512-maskable.png" class="w-14 h-14 rounded hover:cursor-pointer" />
                <h1 class="text-3xl font-semibold text-main">
                    회원가입
                </h1>
            </div>
            <input v-model="signUpForm.email" name="email" type="text" placeholder="이메일"
                class="py-2 px-4 rounded bg-gray-950 border-0.5 border-gray-700 font-normal w-full focus:outline-none focus:ring-1 ring-main">
            <input v-model="signUpForm.password"
                class="py-2 px-4 rounded bg-gray-950 border-0.5 border-gray-700 font-normal w-full focus:outline-none focus:ring-1 ring-main" type="password"
                placeholder="비밀번호">
            <input v-model="signUpForm.passwordConfirm"
                class="py-2 px-4 rounded bg-gray-950 border-0.5 border-gray-700 font-normal w-full focus:outline-none focus:ring-1 ring-main" type="password"
                placeholder="비밀번호 확인">
            <span class="text-xs text-slate-500 text-center self-start">*비밀번호는 6자 이상, 영문, 숫자를 포함해야 합니다.</span>
            <div class="flex w-full justify-between gap-4">
                <button class=" w-1/2 bg-gray-700 py-2 rounded border-0.5 border-gray-600" type="submit" @click="emits('onClose')">닫기</button>
                <button class="w-1/2 bg-main py-2 text-gray-800 font-semibold rounded border-0.5 border-gray-600" type="submit" @click="onSignUp">가입하기</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios';
import { onMounted, ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { AuthHelper } from '@/helpers/AuthHelper';
import * as EmailValidator from 'email-validator';

const router = useRouter()

const emits = defineEmits(['onClose'])

const signUpForm = ref({
    email: "",
    password: "",
    passwordConfirm: ""
})

const passwordRegex = /^[A-Za-z\d!@#$%^&*()]{6,}$/

const onSignUp = async () => {
    console.log(signUpForm.value)
    if (signUpForm.value.email === "" || signUpForm.value.password === "" || signUpForm.value.passwordConfirm === "") {
        alert("❌ 모든 항목을 입력해주세요.")
        return
    }
    if (!EmailValidator.validate(signUpForm.value.email)) {
        alert("❌ 이메일 형식이 올바르지 않습니다.")
        return
    }
    if (signUpForm.value.password !== signUpForm.value.passwordConfirm) {
        alert("❌ 비밀번호가 일치하지 않습니다.")
        return
    }
    if (!passwordRegex.test(signUpForm.value.password)) {
        alert("❌ 비밀번호는 6자 이상, 영문, 숫자를 포함해야 합니다.")
        return
    }
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signUp`, signUpForm.value)
        alert("✅ 회원가입에 성공했습니다.")
    } catch (e) {
        alert("❌ 회원가입에 실패했습니다.\n아이디 또는 이메일이 다른 계정과 중복되지 않는지 확인해주세요!")
    }

    // login and redirect
    var result = await AuthHelper.signIn(signUpForm.value.email, signUpForm.value.password);
    if (result) {
        console.log(result)
        console.log("Login success")
        AuthHelper.clearTokens()
        AuthHelper.setAccessToken(result.accessToken)
        AuthHelper.setRefreshToken(result.refreshToken)
        router.push('/')
        return;
    }
    alert("❌ 에러 발생")
}

onMounted(async () => {

    msnry = new Masonry('#photoMasonryGrid', {
        itemSelector: '.grid-item',
        percentPosition: true,
        columnWidth: document.querySelector('#photoMasonryGrid').clientWidth / 3,
        transitionDuration: '0.2s',
        stagger: 30
    });

    await fetchTopPhotos()
    appendItems(topPhotos.value)
})

onMounted(async () => {
    console.log('SignUpModalView mounted')
})
</script>