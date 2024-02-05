<template>
    <div class="flex flex-col p-4 gap-6">
        <img :src="photo.largeUrl" class="w-full">
        <SectionHeader content="✍️ 제목과 설명" />
        <div class="flex flex-col gap-2">

            <h2 class=" text-xl">{{ photo.title }}</h2>
            <h3>{{ photo.desc }}</h3>
        </div>
        <SectionHeader content="👨‍💻 업로더" />
        <div class="flex gap-2 items-center">
            <img src="https://t1.gstatic.com/images?q=tbn:ANd9GcQQn6_Hz9zTckXYuOa1biiMhulnHv6pKtadAFcdg79yocrL3Y29"
                class="w-10 h-10 rounded-full object-cover">
            <div class="flex flex-col justify-between">
                <h3>{{ photo.user?.userName ?? '' }}</h3>
                <span class="text-xs">{{ TimeHelper.timeSince(new Date(photo.createdAtUtc)) }}</span>
            </div>
        </div>
        <SectionHeader content="💽 사진 정보" />
        <PhotoExifPanel v-if="photo.exifTags" :exif="photo.exifTags" />
        <SectionHeader content="📝 이 사진이 포함된 게시글" />
        <PostVList :posts="relatedPosts" />
        <SectionHeader content="📷 비슷한 사진들" />
        <ul class="flex overflow-x-scroll gap-2">
            <li class=" shrink-0 " v-for="photo in relatedPhotos" :key="photo.id">
                <img @click="router.push({ name: 'photo-detail', params: { id: photo.id } })" :src="photo.thumbnailUrl"
                    class="w-20 h-20 rounded-md object-cover cursor-auto">
            </li>
        </ul>
    </div>
</template>
<script setup>
import axios from 'axios'
import { ref, onMounted, watch, defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TimeHelper } from '@/helpers/TimeHelper';
import PhotoExifPanel from '@/components/PhotoExifPanel.vue';
import PhotoVList from '@/components/PhotoVList.vue';
import PostVList from '@/components/PostVList.vue';
import SectionHeader from '@/components/SectionHeader.vue';

const route = useRoute()
const router = useRouter()

const photo = ref({});
const relatedPosts = ref([]);
const relatedPhotos = ref([]);

watch(
    () => route.fullPath,
    async () => {
        await fetchData()
    }
);

const fetchData = async () => {
    // make them run in parallel
    (async () => {
        let result = await axios.get(`/api/photos/${route.params.id}?breakpoints=Large&includeEmbedding=false`)
        let user = await axios.get(`/api/users/${result.data.uploaderId}`)
        photo.value = result.data
        photo.value.user = user.data

        result = await axios.get(`/api/forumArticles?photoId=${result.data.id}&PageLimit=5&articleSorts=Added&isDescending=true`)
        result = await Promise.all(result.data.map(async (article) => {
            article.username = await axios.get(`/api/users/${article.authorId}`).then((res) => res.data.userName)
            return article
        }))
        relatedPosts.value = result
    })();

    (async () => {
        let related = await axios.get(`/api/searchPhotos/${route.params.id}`)
        related.data = related.data.filter((id) => id !== route.params.id)
        related = await Promise.all(related.data.map(async (id) => {
            let photo = await axios.get(`/api/photos/${id}?breakpoints=Thumbnail&includeEmbedding=false`)
            return photo.data
        }
        ))
        relatedPhotos.value = related
    })();
}

onMounted(async () => {
    await fetchData()
})
</script>