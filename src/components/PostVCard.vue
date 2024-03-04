<template>
    <li class="flex flex-col items-start py-4 px-4 gap-2 cursor-pointer hover:bg-gray-800 group transition duration-100 ease-in-out">
        <div class="flex flex-col w-full gap-2 text-xs items-start">
            <div>
                <span class="mr-2 text-[11px] rounded bg-gray-800  px-2 py-0.5 text-nowrap">{{ props.post.isLikedByCurrentUser ? '❤️' : '🩶' }} {{ props.post.likeCount }}</span>
                <span
                    class="font-normal text-[11px] rounded bg-gray-800 group-hover:outline outline-main px-2 py-0.5 text-nowrap">{{
                        articleTypes[props.post.articleTypeId] }}</span>
            </div>
            <h3 class="text-sm mt-2 text-gray-300">{{ props.post.title }}</h3>
        </div>
        <ul v-if="photoThumbnails.length > 0" class="flex gap-2 overflow-clip">
            <li v-for="thumbnail in photoThumbnails" :key="thumbnail" class="flex shrink-0 items-center">
                <img :src="thumbnail" class="h-16 w-16 sm:h-24 sm:w-24 object-cover rounded border-gray-700 border-0.5" />
            </li>
        </ul>
        <div class=" text-xs flex gap-4 items-center">
            <div class="gap-2 flex">
                <img class="w-4 h-4 rounded-full object-cover"
                    :src="props.post.user.profilePhotoUrl ?? '/default-prof-img.webp'">
                <h1 class=" text-xs font-normal">{{ props.post.user.userName }}</h1>
            </div>
            <span class=" text-gray-500 font-normal">{{ TimeHelper.timeSince(new Date(props.post.createdAtUtc)) }} 전</span>
            <span class=" text-gray-500 font-normal">댓글 {{ commentsCount }}</span>
            <span class=" text-gray-500 font-normal">조회수 {{ props.post.viewCount }}</span>
        </div>
    </li>
</template>
<script setup>
import axios from 'axios';
import { defineProps, onMounted, ref } from 'vue';
import { TimeHelper } from '@/helpers/TimeHelper';
import { useRouter } from 'vue-router'

const router = useRouter();

const props = defineProps(['post']);

const commentsCount = ref(0)
const photoThumbnails = ref([])

const articleTypes = {
    photo: '📸 사진',
    casual: '📝 글',
    ask: '🙋‍♂️ 질문',
    gear: '📷 장비',
    "to-dev": '👨‍💻 개발자에게',
    "from-dev": '👨‍💻 개발자로부터',
}

const fetchPhotoThumbails = async () => {
    props.post.articlePhotos.sort((a, b) => a.order - b.order)
    var result = await Promise.all(props.post.articlePhotos.map(async (photo) => {
        let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos/${photo.photoId}?breakpoints=thumbnail`)
        return res.data.thumbnailUrl
    }))
    photoThumbnails.value = result
}

const fetchCommentCount = async () => {
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/count?articleId=${props.post.id}`)
    commentsCount.value = result.data
}

onMounted(() => {
    fetchCommentCount()
    fetchPhotoThumbails()
})
</script>