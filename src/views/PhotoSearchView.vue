<template>
    <div class="p-4">
        <PhotoMasonryList ref="photoMasonryListRef" :columns="2" @photo-clicked="(photo)=>router.push(`/photos/${photo.id}`)" />
    </div>
</template>
<script setup>
import PhotoMasonryList from '@/components/PhotoMasonryList.vue';
import axios from 'axios';
import {ref, onMounted, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const photos = ref([]);
const photoMasonryListRef = ref();

watch(
    () => route.query.query,
    async () => {
        let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/searchPhotos?query=${route.query.query}&breakpoints=medium&includePreUploads=false`)
        photoMasonryListRef.value.updateItems(result.data);
    }
)

onMounted(async() => {
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/searchPhotos?query=${route.query.query}&breakpoints=medium&includePreUploads=false`)
    
    photoMasonryListRef.value.appendItems(result.data);
})

</script>