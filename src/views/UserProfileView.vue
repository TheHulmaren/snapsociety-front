<template>
    <Skeleton v-if="isLoading" />
    <div v-else class="gap-4 flex flex-col">
        <div @click="onBannerClicked" class="w-full aspect-[21/9] cursor-pointer overflow-hidden">
            <img :src="user.bannerPhoto?.largeUrl ?? '/prof-back.jpg'" alt="배너 사진" class="w-full h-full object-cover object-center">
        </div>
        <input @change="onProfilePhotoSubmit" id="imageInput" type="file" name="file" style="display:none;"
            accept="image/jpg, image/jpeg, image/png, image/webp, image/tiff" />
        <div class="main-section my-4 px-4 flex flex-col items-center -mt-16 md:-mt-20 gap-4">
            <img @click="onProfileImgClicked" :src="user.profilePhotoUrl ?? '/default-prof-img.webp'" alt="프로필 사진"
                class="w-24 md:w-32 aspect-square rounded-full object-cover hover:cursor-pointer relative z-10 border-gray-900 border-4 cursor-pointer">
            <h2 class="text-xl font-semibold">{{ user.userName }}</h2>
            <DefaultTextField v-model="user.userName" :placeholder="'닉네임'" v-if="showBioEdit" />
            <DefaultTextField v-model="user.bio" type="textarea" :placeholder="'프로필 메세지를 입력하세요'" v-if="showBioEdit" />
            <span v-else-if="user.bio === ''" class="text-xs text-slate-500">아직 프로필 메세지를 설정하지 않았어요</span>
            <p v-else>{{ user.bio }}</p>
            <DefaultButton v-if="showBioEdit" @click="onBioSaved" type="submit" content="저장하기"></DefaultButton>
            <DefaultButton v-else-if="AuthHelper.getUser()?.id === user.id" @click="showBioEdit = true" type="primary"
                content="프로필 메세지 수정"></DefaultButton>
        </div>
        <ModalWrapperView v-if="showModal" @on-close="showModal = false">
            <PhotoSelectView :page-limit="10" :selection-limit="1" :columns="2" @on-confirm="onBannerSelected" />
        </ModalWrapperView>
        <div class="flex flex-col px-4">
            <ul class="flex gap-2 flex-wrap">
                <DefaultButton class="grow" v-for="tab in tabs" :key="tab.slug" :content="tab.name"
                    :is-selected="selectedTabSlug === tab.slug" @click="router.push(`/user/${user.id}/${tab.slug}`)" />
            </ul>
        </div>
        <RouterView v-slot="{ Component }">
            <KeepAlive :max="5">
                <component :is="Component"/>
            </KeepAlive>
        </RouterView>
    </div>
</template>
<script setup>
import DefaultButton from '@/components/DefaultButton.vue';
import DefaultTextField from '@/components/DefaultTextField.vue';
import { AuthHelper } from '@/helpers/AuthHelper';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModalWrapperView from './ModalWrapperView.vue';
import PhotoSelectView from './PhotoSelectView.vue';
import Skeleton from '../components/Skeleton.vue';

const route = useRoute();
const router = useRouter();

const user = ref({});
const selectedTabSlug = ref("")
const showBioEdit = ref(false)
const showModal = ref(false)
const isLoading = ref(true)

var imgInput = null

const tabs = [
    {
        name: "📸 사진",
        slug: "photos?query=🕗%20게시일_👇%20최신%20순"
    },
    {
        name: "📝 게시글",
        slug: "posts?query=🕗%20게시일_👇%20최신%20순"
    },
    {
        name: "❤️ 좋아요한 사진",
        slug: "liked-photos"
    },
    {
        name: "❤️ 좋아요한 게시글",
        slug: "liked-posts"
    }
]

const onBannerClicked = () => {
    if (AuthHelper.getUser()?.id !== user.value.id) return
    if(!confirm("📷 배너 사진을 변경하시겠습니까?")) return
    showModal.value = true
}

const onBannerSelected = async (selected) => {
    if(selected.length === 0) return
    let result = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${route.params.id}`, {
        userName: user.value.userName,
        bio: user.value.bio,
        email: user.value.email,
        bannerPhotoId: selected[0].id
    })
    user.value = result.data
    showModal.value = false
}

const onBioSaved = async () => {
    let result = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${route.params.id}`, {
        userName: user.value.userName,
        bio: user.value.bio,
        email: user.value.email,
        bannerPhotoId: user.value.bannerPhoto?.id
    })
    user.value = result.data
    showBioEdit.value = false
}

const onProfileImgClicked = () => {
    if (AuthHelper.getUser()?.id !== user.value.id) return
    if (!confirm("📷 프로필 사진을 변경하시겠습니까?")) return
    imgInput.click()
}

const onProfilePhotoSubmit = async () => {
    if (imgInput.files.length === 0) return
    let formData = new FormData()
    formData.append("image", imgInput.files[0])
    let result = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/${route.params.id}/profilePhoto`, formData)
    user.value = result.data
}

onMounted(async () => {
    selectedTabSlug.value = route.fullPath.split("/")[3]

    imgInput = document.getElementById("imageInput")
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${route.params.id}`)
    user.value = result.data

    isLoading.value = false
})

</script>
