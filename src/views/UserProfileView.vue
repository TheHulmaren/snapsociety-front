<template>
    <div class="gap-4 flex flex-col">
        <div
            class="w-full h-36 object-cover object-top top-0 
             bg-top bg-fixed bg-contain
            bg-[url('https://drscdn.500px.org/photo/1084667777/q%3D90_m%3D1024/v2?sig=8c88b8e6cf92b394fe1f5111b752386d48ec846569852ccf78a607d8cdb62690')]">
        </div>
        <input @change="onProfilePhotoSubmit" id="imageInput" type="file" name="file" style="display:none;"
            accept="image/jpg, image/jpeg, image/png, image/webp, image/tiff" />
        <div class="my-4 px-4 flex flex-col items-center -mt-16 gap-4">
            <img @click="onProfileImgClicked" :src="user.profilePhotoUrl ?? '/default-prof-img.webp'" alt="프로필 사진"
                class="w-24 md:w-32 aspect-square rounded-full object-cover hover:cursor-pointer relative z-10 border-white border-4 cursor-pointer">
            <h2 class="text-xl font-semibold">{{ user.userName }}</h2>
            <DefaultTextField v-model="user.userName" :placeholder="'닉네임'" v-if="showBioEdit" />
            <DefaultTextField v-model="user.bio" type="textarea" :placeholder="'프로필 메세지를 입력하세요'" v-if="showBioEdit" />
            <span v-else-if="user.bio === ''" class="text-xs text-slate-500">아직 프로필 메세지를 설정하지 않았어요</span>
            <p v-else>{{ user.bio }}</p>
            <DefaultButton v-if="showBioEdit" @click="onBioSaved" type="submit" content="저장하기"></DefaultButton>
            <DefaultButton v-else-if="AuthHelper.getUser().id === user.id" @click="showBioEdit = true" type="primary"
                content="프로필 메세지 수정"></DefaultButton>
        </div>
        <div class="flex flex-col px-4">
            <ul class="flex gap-2 flex-wrap">
                <DefaultButton class="grow" v-for="tab in tabs" :key="tab.slug" :content="tab.name" :is-selected="selectedTabSlug === tab.slug" @click="router.push(`/user/${user.id}/${tab.slug}`)" />
            </ul>
        </div>
        <RouterView class="px-4" :key="route.fullPath" />
    </div>
</template>
<script setup>
import DefaultButton from '@/components/DefaultButton.vue';
import DefaultTextField from '@/components/DefaultTextField.vue';
import { AuthHelper } from '@/helpers/AuthHelper';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const user = ref({});
const selectedTabSlug = ref("")
const showBioEdit = ref(false)

var imgInput = null

const tabs = [
    {
        name: "📸 사진",
        slug: "photos"
    },
    {
        name: "📝 게시글",
        slug: "posts"
    },
    {
        name: "❤️ 좋아요한 사진",
        slug: "liked-photos"
    },
    {
        name: "❤️ 좋아요한 게시글",
        slug: "liked-posts"
    },
    {
        name: "💬 작성한 댓글",
        slug: "comments"
    }
]

const onBioSaved = async () => {
    let result = await axios.put(`/api/users/${route.params.id}`, {
        userName: user.value.userName,
        bio: user.value.bio
    })
    user.value = result.data
    showBioEdit.value = false
}

const onProfileImgClicked = () => {
    if(AuthHelper.getUser().id !== user.value.id) return
    if (!confirm("📷 프로필 사진을 변경하시겠습니까?")) return
    imgInput.click()
}

const onProfilePhotoSubmit = async () => {
    if (imgInput.files.length === 0) return
    let formData = new FormData()
    formData.append("image", imgInput.files[0])
    let result = await axios.post(`/api/users/${route.params.id}/profilePhoto`, formData)
    user.value = result.data
}

onMounted(async () => {
    imgInput = document.getElementById("imageInput")
    let result = await axios.get(`/api/users/${route.params.id}`)
    user.value = result.data
})

</script>