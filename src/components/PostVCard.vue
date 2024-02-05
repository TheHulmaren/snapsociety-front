<template>
    <li class="flex items-start h-20 gap-2 cursor-pointer">
        <img src="https://t1.gstatic.com/images?q=tbn:ANd9GcQQn6_Hz9zTckXYuOa1biiMhulnHv6pKtadAFcdg79yocrL3Y29"
            class=" h-full aspect-square rounded-md object-cover">
        <div class="flex flex-col gap-1 grow h-full text-text-dark truncate">
            <h2 class="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">{{ props.post.title }}</h2>
            <div class="flex items-center gap-2">
                <img src="https://t1.gstatic.com/images?q=tbn:ANd9GcQQn6_Hz9zTckXYuOa1biiMhulnHv6pKtadAFcdg79yocrL3Y29"
                    class=" w-4 h-4 rounded-full object-cover">
                <h3 class=" text-sm">{{ props.post.username }}</h3>
            </div>
            <div class="grow"></div>
            <div class="flex justify-between w-full font-normal text-sm">
                <span>{{ TimeHelper.timeSince(new Date(props.post.createdAtUtc)) }}</span>
                <span>{{ props.post.isLikedByCurrentUser ? '❤️' : '🩶' }} {{ props.post.likeCount }}</span>
                <span>💬 {{ commentsCount }}</span>
                <span>👁️ {{ post.viewCount }}</span>
            </div>
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

onMounted(async() => {
    let result = await axios.get(`/api/comments/count?articleId=${props.post.id}`)
    commentsCount.value = result.data
})
</script>