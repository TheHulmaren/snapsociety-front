<template>
    <div>
        <PhotoVList :photos="photos" id="likedPhotoList" />
        <Skeleton v-if="isLoading" />
    </div>
</template>
<script setup>
import PhotoVList from '@/components/PhotoVList.vue';
import Skeleton from '@/components/Skeleton.vue';
import axios from 'axios';
import { defineProps, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps(['userId']);

const photos = ref([]);
const isLoading = ref(true);
const reachedEnd = ref(false);

var pageIndex = 0;
const pageLimit = 10;
var list = null;

const loadMoreLikedPhotos = async () => {
    var result = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/getLikedList/photos/user/${props.userId}?breakpoints=medium&PageLimit=${pageLimit}&PageIndex=${pageIndex}`);

    await Promise.all(result.data.map(async (photo) => {
        let user = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${photo.uploaderId}`);
        let likeCount = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/countLikes/photos/${photo.id}`);
        let isLikedByCurrentUser = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/checkIfLiked/photos/${photo.id}/user/${router.currentRoute.value.params.id}`);
        photo.user = user.data;
        photo.likeCount = likeCount.data;
        photo.isLikedByCurrentUser = isLikedByCurrentUser.data;
    }));

    return result.data;
}

onMounted(async () => {
    isLoading.value = true;
    var result = await loadMoreLikedPhotos();
    photos.value = result;
    isLoading.value = false;

    list = document.getElementById("likedPhotoList");

    document.addEventListener("scroll", async () => {
        let top = (window.scrollY || document.documentElement.scrollTop)
        let clientRect = list.getBoundingClientRect()

        let listBottom = clientRect.bottom + top
        var screenBottom = top + window.innerHeight

        if (listBottom <= screenBottom + 50 && !reachedEnd.value && !isLoading.value) {
            isLoading.value = true
            pageIndex++
            let result = await loadMoreLikedPhotos();
            photos.value.push(...result)

            if (result.length === 0) {
                reachedEnd.value = true
                isLoading.value = false
                return
            }
            
            isLoading.value = false
        }
    })
});

</script>