<template>
    <div>
        <PostVList :posts="posts" />
    </div>
</template>
<script setup>
import axios from 'axios';
import PostVList from '@/components/PostVList.vue';
import { ref, onMounted } from 'vue';

const posts = ref([]);
const props = defineProps(['userId']);

onMounted(async () => {
    var result = await axios.get(`/api/likes/getLikedList/articles/user/${props.userId}`);
    await Promise.all(result.data.map(async (post) => {
        let user = await axios.get(`/api/users/${post.authorId}`);
        let likeCount = await axios.get(`/api/likes/countLikes/articles/${post.id}`);
        let isLikedByCurrentUser = await axios.get(`/api/likes/checkIfLiked/articles/${post.id}/user/${props.userId}`);
        post.user = user.data;
        post.likeCount = likeCount.data;
        post.isLikedByCurrentUser = isLikedByCurrentUser.data;
    }));
    posts.value = result.data;
});
</script>