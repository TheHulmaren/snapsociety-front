<template>
    <div class="flex flex-col gap-4 items-center">
        <div class="px-4 w-1/2">
            <h1 class="my-4 text-center text-main text-xl font-semibold">🎉 회원가입 🙋‍♀️</h1>
            <div class="flex flex-col gap-2 text-sm">
                <label for="email" class="text-slate-500 ">이메일</label>
                <input v-model="signUpForm.email" name="email" type="text" placeholder="이메일"
                    class="py-2 px-4 rounded bg-gray-950 border-0.5 border-gray-700 font-normal">
                <label for="password" class="text-slate-500 ">비밀번호</label>
                <input v-model="signUpForm.password" type="password" placeholder="비밀번호"
                    class="py-2 px-4 rounded bg-gray-950 border-0.5 border-gray-700 font-normal">
                <input v-model="signUpForm.passwordConfirm" type="password" placeholder="비밀번호 확인"
                    class="py-2 px-4 rounded bg-gray-950 border-0.5 border-gray-700 font-normal">
                <span class="text-xs text-slate-500">* 6자 이상, 영문, 숫자를 포함해야 합니다.</span>
                <DefaultButton @click="onSignUp" class="self-end" type="submit" content="가입하기" />
            </div>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios';
import * as EmailValidator from 'email-validator';
import DefaultButton from '@/components/DefaultButton.vue';
import { ref } from 'vue'

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
}
</script>