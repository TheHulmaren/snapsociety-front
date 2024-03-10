<template>
    <div>
        <PostVList :posts="posts" id="likedPostList" />
        <Skeleton v-if="isLoading" />
    </div>
</template>
<script setup>
import axios from 'axios';
import PostVList from '@/components/PostVList.vue';
import Skeleton from '@/components/Skeleton.vue';
import { ref, onMounted } from 'vue';

const posts = ref([]);
const props = defineProps(['userId']);

const isLoading = ref(true);
const reachedEnd = ref(false);

var pageIndex = 0;
const pageLimit = 20;
var list = null;

const loadMoreLikedPosts = async () => {
    var result = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/getLikedList/articles/user/${props.userId}?PageLimit=${pageLimit}&PageIndex=${pageIndex}`);

    await Promise.all(result.data.map(async (post) => {
        let user = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${post.authorId}`);
        let likeCount = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/countLikes/articles/${post.id}`);
        let isLikedByCurrentUser = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/checkIfLiked/articles/${post.id}/user/${props.userId}`);
        post.user = user.data;
        post.likeCount = likeCount.data;
        post.isLikedByCurrentUser = isLikedByCurrentUser.data;
    }));

    return result.data;
}


onMounted(async () => {
    isLoading.value = true;
    var result = await loadMoreLikedPosts();
    posts.value = result;
    isLoading.value = false;

    list = document.getElementById("likedPostList");

    document.addEventListener("scroll", async () => {
        let top = (window.scrollY || document.documentElement.scrollTop)
        let clientRect = list.getBoundingClientRect()

        let listBottom = clientRect.bottom + top
        var screenBottom = top + window.innerHeight
        if (listBottom <= screenBottom + 50 && !reachedEnd.value && !isLoading.value) {
            isLoading.value = true;
            pageIndex++
            var result = await loadMoreLikedPosts();
            if (result.length === 0) {
                reachedEnd.value = true;
                isLoading.value = false;
                return
            }
            posts.value.push(...result);
            isLoading.value = false;
        }
    });
});
</script>