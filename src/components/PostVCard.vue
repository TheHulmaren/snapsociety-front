<template>
    <li class="flex flex-col items-start py-2 px-4 gap-2 cursor-pointer hover:bg-gray-100 group">
        <div class="flex w-full gap-2 text-xs items-center">
            <span class=" font-normal text-[11px] rounded-full bg-gray-100 text-gray-800 group-hover:outline outline-main px-2 py-0.5">{{ articleTypes[props.post.articleTypeId] }}</span>
            <h3 class="font-medium">{{ props.post.title }}</h3>
        </div>
        <ul v-if="photoThumbnails.length > 0" class="flex gap-2 overflow-clip">
            <li v-for="thumbnail in photoThumbnails" :key="thumbnail" class="flex shrink-0 items-center">
                <img :src="thumbnail" class="h-10 w-10 object-cover rounded-sm" />
            </li>
        </ul>
        <div class=" text-xs flex gap-4 items-center">
            <span>{{ props.post.isLikedByCurrentUser ? '❤️' : '🩶' }} {{ props.post.likeCount }}</span>
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
        let res = await axios.get(`/api/photos/${photo.photoId}?breakpoints=thumbnail`)
        return res.data.thumbnailUrl
    }))
    photoThumbnails.value = result
}

const fetchCommentCount = async () => {
    let result = await axios.get(`/api/comments/count?articleId=${props.post.id}`)
    commentsCount.value = result.data
}

onMounted(() => {
    fetchCommentCount()
    fetchPhotoThumbails()
})
</script>