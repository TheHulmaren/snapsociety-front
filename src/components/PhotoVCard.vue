<template>
    <li class="flex flex-col gap-2 p-4 cursor-pointer transition duration-100 ease-in-out">
        <div v-if="props.showProfile" class="flex items-center gap-2">
            <img @click="router.push(`/user/${photo.user.id}?query=🕗%20업로드_👇%20최신%20순`)"
                class="w-6 h-6 rounded-full object-cover hover:cursor-pointer"
                :src="props.photo.user.profilePhotoUrl ?? '/default-prof-img.webp'">
            <h1 @click="router.push(`/user/${photo.user.id}`)" class=" text-xs hover:cursor-pointer">{{
            props.photo.user.userName }}</h1>
            <span class=" text-xs font-normal text-text-dark dark:text-gray-500 hover:cursor-pointer">{{
            TimeHelper.timeSince(new
                Date(props.photo.createdAtUtc)) }} 전</span>
            <div class="grow"></div>
            <button @click="onLikeClicked" class=" text-base font-semibold">{{ isLiked ? "❤️" : "🩶" }} {{
            props.photo.likeCount
        }}</button>
        </div>
        <div class="relative photo-image">
            <div class="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center rounded text-gray-900 photo-image-like-overlay"
                :class="showLikeOverlay ? (inLikeProcess ? 'processing' : 'done') : ''">
                <div class=" text-2xl heart">
                    ❤️
                </div>
            </div>
            <div v-if="isLiked"
                class="absolute bottom-0 left-0 flex gap-2 items-end w-full px-4 py-2 rounded-b bg-gray-800 border-gray-700 border-0.5 text-xs">
                ❤️ 좋아요한 사진
                <span class="text-[11px] text-gray-500">
                    클릭해서 자세히 보기
                </span>
            </div>
            <img @click="onImageClicked" class="rounded border-gray-700 border-0.5 sm:px-32 hover:bg-gray-800"
                :src="props.photo.largeUrl ?? props.photo.mediumUrl ?? props.photo.smallUrl ?? props.photo.thumbnailUrl ?? props.photo.url"
                :alt="props.photo.desc" />
        </div>
    </li>
</template>
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { TimeHelper } from '@/helpers/TimeHelper';
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { AuthHelper } from '@/helpers/AuthHelper';

const router = useRouter();

const props = defineProps(['photo', 'showProfile'])

const isLiked = ref(false)
const showLikeOverlay = ref(false)
const inLikeProcess = ref(false)

const onLikeClicked = async () => {
    if (!AuthHelper.getUser()) {
        alert("로그인이 필요합니다")
        return
    }
    if (isLiked.value) {
        let result = await axios.post(`${import.meta.env.VITE_API_URL}/api/likes/decrementLikes/photos/${props.photo.id}/user/${AuthHelper.getUser().id}`)
        props.photo.likeCount = result.data.likeCount
        isLiked.value = false
        return
    }
    let result = await axios.post(`${import.meta.env.VITE_API_URL}/api/likes/incrementLikes/photos/${props.photo.id}/user/${AuthHelper.getUser().id}`)
    props.photo.likeCount = result.data.likeCount
    isLiked.value = true
}

const onImageClicked = async () => {
    if (isLiked.value) {
        router.push(`/photos/${props.photo.id}`)
        return
    }
    showLikeOverlay.value = true
    inLikeProcess.value = true
    await onLikeClicked()
    inLikeProcess.value = false

    setTimeout(() => {
        showLikeOverlay.value = false
    }, 500)
}

onMounted(async () => {
    isLiked.value = props.photo.isLikedByCurrentUser
})
</script>
<style scoped>
.photo-image-like-overlay {
    visibility: hidden;
}

.photo-image-like-overlay.processing,
.photo-image-like-overlay.done {
    visibility: visible;
    backdrop-filter: blur(10px);
    transition: all 0.5s ease-in-out;
}

.processing .heart {
    visibility: visible;
}

.done .heart {
    visibility: visible;
    transition: all 0.5s ease-in-out;
    transform: scale(8);
    opacity: 0;
}
</style>
