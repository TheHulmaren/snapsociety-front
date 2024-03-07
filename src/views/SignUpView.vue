<template>
    <div class="relative flex flex-col gap-4 items-center">
        <!-- bg video -->
        <div class=" absolute top-0 left-0 w-full">
            <div class="absolute top-0 left-0 w-full h-[500px] bg-gray-900 bg-opacity-70"></div>
            <div class="absolute bottom-0 left-0 w-full h-[70px] bg-gray-900 wave-clip"></div>
            <video id="bgVideo" autoplay muted loop class="w-full h-[500px] object-cover">
                <source src="/intro-bgvideo.mov" type="video/mp4">
            </video>
        </div>
        <!-- hero -->
        <div class="flex flex-col gap-8 items-start w-full p-8 text-gray-200 relative z-10">
            <div class="flex w-full gap-4">
                <div class="relative self-start">
                    <img src="/laurel.svg" alt="logo" class="laurel-white w-40" />
                    <span
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 text-xs text-center">No.1
                        고품격<br>사진 커뮤니티</span>
                </div>
                <img src="/icon-512-maskable.png" alt="logo" class="w-12 rounded hover:cursor-pointer" />
            </div>
            <div class="gap-4 flex flex-col *:underline-offset-4 [&_span]:decoration-main [&_span]:font-semibold">
                <h1 class="text-4xl font-semibold">갓 찍은 사진을 공유하고, 검색하고, 소통하세요.</h1>
                <h2 class="text-lg text-gray-300">창조적인 1% 당신을 위한 최고의 사진 커뮤니티</h2>
                <div class="flex flex-col gap-2">
                    <h3>🌎 <span class="underline">사진을 손쉽게 업로드</span> 하세요</h3>
                    <h3>📸 다른 작가님의 사진을 <span class="underline">고해상도로 열람하세요</span></h3>
                    <h3>👋 다른 <span class="underline">아마추어 & 프로페셔널 작가님과 소통</span>하세요</h3>
                    <h3>🔎 <span class="underline">최신 AI 이미지 검색 기술</span>을 이용해 원하는 사진을 검색하세요</h3>
                    <h3>🚀 <span class="underline">성장하는 커뮤니티</span>의 일원이 되세요</h3>
                </div>
            </div>
            <div class="flex flex-wrap gap-4 justify-center items-center w-full">
                <span class="text-xs text-gray-400">Powered by</span>
                <img src="/intro-poweredby-azure.png" alt="logo" class="h-10 poweredby-gray" />
                <img src="/intro-poweredby-dotnet.png" alt="logo" class="h-10 poweredby-gray" />
                <img src="/intro-poweredby-pg.png" alt="logo" class="h-10 poweredby-gray-invert" />
                <img src="/intro-poweredby-vue.svg" alt="logo" class="h-10 poweredby-gray-invert" />
            </div>
        </div>
        <!-- hot photo masonry -->
        <div class="relative w-full">
            <div class="absolute top-0 left-0 w-full h-[200px] sm:h-[500px] top-photos-uppershade z-50"></div>
            <div class="px-4 w-full">
                <div id="photoMasonryGrid" class="w-full"></div>
            </div>

        </div>
        <!-- sign up form -->
        <div class="px-4 w-full border-y-0.5 border-gray-700 py-4">
            <h1 class="my-4 text-center text-main text-xl font-semibold">🎉 회원가입 🙋‍♀️</h1>
            <div class="flex flex-col gap-2 text-sm w-full sm:w-1/2 mx-auto">
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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const signUpForm = ref({
    email: "",
    password: "",
    passwordConfirm: ""
})
const topPhotos = ref([])

var msnry = null;
const passwordRegex = /^[A-Za-z\d!@#$%^&*()]{6,}$/

const fetchTopPhotos = async () => {
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=Small&photoSorts=Top&isDescending=true&includePreUploaded=false&pageIndex=0&pageLimit=15`);
    topPhotos.value = result.data
}

const appendItems = async (photos) => {
    var grid = document.querySelector('#photoMasonryGrid');
    for (const photo of photos) {
        let gridItem = document.createElement('img');
        gridItem.setAttribute('src', photo.largeUrl ?? photo.mediumUrl ?? photo.smallUrl ?? photo.thumbnailUrl ?? photo.url);
        gridItem.setAttribute('class', 'grid-item p-1 object-cover cursor-pointer');
        gridItem.setAttribute('style', `width: ${100 / 3}%; border-radius: 0.5rem;`)
        gridItem.addEventListener('click', () => {
            router.push(`/photos/${photo.id}`)
        });
        grid.appendChild(gridItem);
        msnry.appended(gridItem);
        await new Promise(resolve => setTimeout(resolve, 200));
        msnry.layout();
    };
}

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
</script>
<style scoped>
.laurel-white {
    -webkit-filter: grayscale(1) invert(1);
    filter: grayscale(1) invert(1);
}

.poweredby-gray {
    filter: grayscale(1);
}

.poweredby-gray-invert {
    filter: grayscale(1) invert(1);
}

.top-photos-uppershade {
    background: rgb(17, 24, 39);
    background: linear-gradient(180deg, rgba(17, 24, 39, 1) 11%, rgba(255, 255, 255, 0) 100%);
}

.wave-clip {
    clip-path: polygon(100% 100%, 0% 100% , 0.00% 83.71%, 3.33% 76.12%, 6.67% 67.19%, 10.00% 57.81%, 13.33% 48.88%, 16.67% 41.29%, 20.00% 35.77%, 23.33% 32.87%, 26.67% 32.87%, 30.00% 35.77%, 33.33% 41.29%, 36.67% 48.88%, 40.00% 57.81%, 43.33% 67.19%, 46.67% 76.12%, 50.00% 83.71%, 53.33% 89.23%, 56.67% 92.13%, 60.00% 92.13%, 63.33% 89.23%, 66.67% 83.71%, 70.00% 76.12%, 73.33% 67.19%, 76.67% 57.81%, 80.00% 48.88%, 83.33% 41.29%, 86.67% 35.77%, 90.00% 32.87%, 93.33% 32.87%, 96.67% 35.77%, 100.00% 41.29%);}
</style>