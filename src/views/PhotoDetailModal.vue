<template>
    <div class="fixed top-0 left-0 w-full h-full backdrop-blur-md z-40 flex flex-col justify-center items-center"
        v-on:click.self="emit('onClose')">
        <div class="w-4/5 md:w-[672px] h-4/5 overflow-y-auto bg-gray-900 border-gray-700 border-0.5 rounded">
            <Skeleton v-if="isLoading" />
            <div v-else class="flex flex-col p-4 gap-6">
                <RouterLink :to="'/photos/' + props.photoId" class="self-end">
                    <span class=" text-sm underline">🔗 상세 페이지로</span>
                </RouterLink>
                <img :src="photo.largeUrl"
                    class=" max-h-[450px] object-contain bg-gray-800 rounded overflow-y-auto cursor-pointer"
                    @click="enlarged = !enlarged">
                <div class="flex justify-between items-center">
                    <SectionHeader content="✍️ 제목과 설명" />
                </div>
                <div class="flex flex-col gap-2">
                    <h2 class=" text-xl">{{ photo.title }}</h2>
                    <h3>{{ photo.desc }}</h3>
                </div>
                <SectionHeader content="👨‍💻 업로더" />
                <div @click="router.push('/user/' + photo.user.id)" class="flex gap-2 items-center cursor-pointer">
                    <img :src="photo.user?.profilePhotoUrl ?? '/default-prof-img.webp'"
                        class="w-10 h-10 rounded-full object-cover">
                    <div class="flex flex-col justify-between">
                        <h3>{{ photo.user?.userName ?? '' }}</h3>
                        <span class="text-xs">{{ TimeHelper.timeSince(new Date(photo.createdAtUtc)) }}</span>
                    </div>
                </div>
                <SectionHeader content="💽 사진 정보" />
                <PhotoExifPanel v-if="photo.exifTags" :exif="photo.exifTags" class="max-w-[450px]" />
                <SectionHeader content="📝 이 사진이 포함된 게시글" />
                <PostVList :posts="relatedPosts" />
                <SectionHeader content="📷 비슷한 사진들" />
                <ul class="flex overflow-x-scroll gap-2">
                    <li class=" shrink-0 " v-for="photo in relatedPhotos" :key="photo.id">
                        <img @click="onRelatedPhotoClicked(photo)" :src="photo.thumbnailUrl"
                            class="w-20 h-20 rounded object-cover cursor-pointer border-0.5 border-gray-700">
                    </li>
                </ul>
            </div>
            <div v-if="enlarged" @click="enlarged = false" class="fixed w-screen h-screen top-0 left-0 z-30 cursor-pointer">
                <div class="w-full h-full absolute bg-black opacity-80">
                </div>
                <PhotoExifPanel v-if="photo.exifTags" :exif="photo.exifTags"
                    class="absolute left-1/2 -translate-x-[50%] bottom-0 w-4/5 sm:max-w-[450px] z-50 mb-8" />
                <img :src="photo.largeUrl" class="w-full h-full object-contain relative z-40" @click="enlarged = !enlarged">
            </div>
        </div>
        <DefaultButton class="self-center mt-4" type="submit" @click="emit('onClose')" :content="'❌ 닫기'"/>
    </div>
</template>
<script setup>
import axios from 'axios'
import { ref, onMounted, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { TimeHelper } from '@/helpers/TimeHelper';
import PhotoExifPanel from '@/components/PhotoExifPanel.vue';
import PostVList from '@/components/PostVList.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import Skeleton from '@/components/Skeleton.vue';
import DefaultButton from '@/components/DefaultButton.vue';

const router = useRouter()

const props = defineProps(['photoId'])
const emit = defineEmits(['onClose'])

const photo = ref({
});
const enlarged = ref(false);
const isLoading = ref(true);
const relatedPosts = ref([]);
const relatedPhotos = ref([]);

const fetchData = async (photoId) => {
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos/${photoId}?breakpoints=Large&includeEmbedding=false`)
    let user = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${result.data.uploaderId}`)
    photo.value = result.data
    photo.value.user = user.data

    result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?photoId=${result.data.id}&PageLimit=5&articleSorts=Added&isDescending=true`)
    result = await Promise.all(result.data.map(async (article) => {
        article.user = (await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${article.authorId}`)).data
        return article
    }))
    relatedPosts.value = result


    let related = await axios.get(`${import.meta.env.VITE_API_URL}/api/searchPhotos/${photoId}`)
    related.data = related.data.filter((id) => id !== photoId)
    related = await Promise.all(related.data.map(async (id) => {
        let photo = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos/${id}?breakpoints=Thumbnail&includeEmbedding=false`)
        return photo.data
    }
    ))
    relatedPhotos.value = related
}

const onRelatedPhotoClicked = async (photo) => {
    isLoading.value = true
    await fetchData(photo.id)
    isLoading.value = false
}

onMounted(async () => {
    await fetchData(props.photoId)
    isLoading.value = false
})
</script>