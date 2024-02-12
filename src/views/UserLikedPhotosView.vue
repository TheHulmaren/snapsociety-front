<template>
    <div>
        <Skeleton v-if="isLoading" />
        <PhotoVList v-else :photos="photos" />
    </div>
</template>
<script setup>
import PhotoVList from '@/components/PhotoVList.vue';
import Skeleton from '@/components/Skeleton.vue';
import axios from 'axios';
import { defineProps, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps(['userId']);

const photos = ref([]);
const isLoading = ref(true);

const router = useRouter();

onMounted(async () => {
    var result = await axios.get(`/api/likes/getLikedList/photos/user/${props.userId}?breakpoints=medium`);
    await Promise.all(result.data.map(async (photo) => {
        let user = await axios.get(`/api/users/${photo.uploaderId}`);
        let likeCount = await axios.get(`/api/likes/countLikes/photos/${photo.id}`);
        let isLikedByCurrentUser = await axios.get(`/api/likes/checkIfLiked/photos/${photo.id}/user/${router.currentRoute.value.params.id}`);
        photo.user = user.data;
        photo.likeCount = likeCount.data;
        photo.isLikedByCurrentUser = isLikedByCurrentUser.data;
    }));

    photos.value = result.data;
    isLoading.value = false;
});

</script>