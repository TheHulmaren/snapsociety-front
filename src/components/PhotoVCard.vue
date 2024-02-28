<template>
    <li class="flex flex-col gap-2 p-4 cursor-pointer hover:bg-gray-800 transition duration-100 ease-in-out">
        <div v-if="props.showProfile" class="flex items-center gap-2">
            <img @click="router.push(`/user/${photo.user.id}`)"
                class="w-6 h-6 rounded-full object-cover hover:cursor-pointer"
                :src="props.photo.user.profilePhotoUrl ?? '/default-prof-img.webp'">
            <h1 @click="router.push(`/user/${photo.user.id}`)" class=" text-xs hover:cursor-pointer">{{ props.photo.user.userName }}</h1>
            <span class=" text-xs font-normal text-text-dark dark:text-gray-500 hover:cursor-pointer">{{ TimeHelper.timeSince(new
                Date(props.photo.createdAtUtc)) }} 전</span>
            <div class="grow"></div>
            <button @click="onLikeClicked" class=" text-base font-semibold">{{ isLiked ? "❤️" : "🩶" }} {{
                props.photo.likeCount
            }}</button>
        </div>
        <img  @click="router.push(`/photos/${photo.id}`)" class="rounded border-gray-700 border-0.5"
            :src="props.photo.largeUrl ?? props.photo.mediumUrl ?? props.photo.smallUrl ?? props.photo.thumbnailUrl ?? props.photo.url"
            :alt="props.photo.desc" />
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

const onLikeClicked = async () => {
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

onMounted(async () => {
    isLiked.value = props.photo.isLikedByCurrentUser
})
</script>